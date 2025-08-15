# Módulo de Archivos (files.py)
# Responsable de la gestión completa de archivos en el sistema Drive

import os
import hashlib
from datetime import datetime
from typing import List, Optional, Dict, Any, BinaryIO
from pathlib import Path

class FileManager:
    """
    Gestor de archivos con soporte para subida, descarga, 
    organización en carpetas y operaciones CRUD completas.
    """
    
    def __init__(self, db_connection, storage_path: str = "./storage"):
        """
        Inicializa el gestor de archivos.
        
        Args:
            db_connection: Conexión a la base de datos Oracle
            storage_path: Ruta base para almacenamiento de archivos
        """
        self.db = db_connection
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(exist_ok=True)
        
        # Tipos de archivo permitidos
        self.allowed_extensions = {
            'document': ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
            'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
            'video': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
            'presentation': ['.ppt', '.pptx', '.odp'],
            'spreadsheet': ['.xls', '.xlsx', '.csv', '.ods'],
            'other': []  # Cualquier otro tipo
        }
        
        # Límite de tamaño por archivo (100MB por defecto)
        self.max_file_size = 100 * 1024 * 1024
    
    def upload_file(self, user_id: str, file_data: BinaryIO, filename: str,
                   folder_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Subir archivo a una carpeta.
        
        Args:
            user_id: ID del usuario
            file_data: Datos binarios del archivo
            filename: Nombre original del archivo
            folder_id: ID de la carpeta destino (opcional)
            
        Returns:
            Dict con información del archivo subido
        """
        try:
            # Validar tamaño del archivo
            file_data.seek(0, 2)  # Ir al final
            file_size = file_data.tell()
            file_data.seek(0)  # Volver al inicio
            
            if file_size > self.max_file_size:
                raise ValueError(f"Archivo demasiado grande. Máximo: {self.max_file_size / (1024*1024):.1f}MB")
            
            # Validar permisos de carpeta si se especifica
            if folder_id:
                if not self.validate_folder_access(user_id, folder_id, "write"):
                    raise PermissionError("No tienes permisos para subir archivos a esta carpeta")
            
            # Determinar tipo de archivo
            file_type = self.determine_file_type(filename)
            
            # Generar ID único y hash del archivo
            file_id = self.generate_file_id()
            file_hash = self.calculate_file_hash(file_data)
            file_data.seek(0)  # Resetear posición
            
            # Crear estructura de carpetas de almacenamiento
            storage_dir = self.storage_path / user_id[:2] / user_id[2:4]
            storage_dir.mkdir(parents=True, exist_ok=True)
            
            # Guardar archivo físicamente
            file_extension = Path(filename).suffix.lower()
            stored_filename = f"{file_id}{file_extension}"
            storage_file_path = storage_dir / stored_filename
            
            with open(storage_file_path, 'wb') as f:
                f.write(file_data.read())
            
            # Generar thumbnail si es imagen
            thumbnail_url = None
            if file_type == 'image':
                thumbnail_url = self.generate_thumbnail(storage_file_path, file_id)
            
            # Insertar en base de datos
            file_record = {
                'id': file_id,
                'name': filename,
                'original_name': filename,
                'file_type': file_type,
                'file_size': file_size,
                'file_hash': file_hash,
                'folder_id': folder_id,
                'user_id': user_id,
                'storage_path': str(storage_file_path),
                'url': f"/api/files/{file_id}/download",
                'thumbnail_url': thumbnail_url,
                'created_at': datetime.now(),
                'updated_at': datetime.now(),
                'is_deleted': False
            }
            
            self.insert_file_record(file_record)
            
            # Actualizar estadísticas de almacenamiento
            self.update_user_storage(user_id, file_size)
            
            return file_record
            
        except Exception as e:
            # Limpiar archivo físico si hay error
            if 'storage_file_path' in locals() and storage_file_path.exists():
                storage_file_path.unlink()
            raise e
    
    def list_folder_files(self, user_id: str, folder_id: Optional[str] = None,
                         include_deleted: bool = False) -> List[Dict[str, Any]]:
        """
        Listar archivos dentro de una carpeta.
        
        Args:
            user_id: ID del usuario
            folder_id: ID de la carpeta (None para archivos raíz)
            include_deleted: Incluir archivos eliminados
            
        Returns:
            Lista de archivos
        """
        conditions = ["usuario_id = :user_id"]
        params = {'user_id': user_id}
        
        if folder_id:
            conditions.append("carpeta_id = :folder_id")
            params['folder_id'] = folder_id
        else:
            conditions.append("carpeta_id IS NULL")
        
        if not include_deleted:
            conditions.append("eliminado = 0")
        
        query = f"""
        SELECT a.id, a.nombre as name, a.nombre_original as original_name,
               ta.nombre as file_type, a.tamaño as file_size,
               a.carpeta_id as folder_id, a.usuario_id as user_id,
               a.url, a.thumbnail_url, a.fecha_creacion as created_at,
               a.fecha_actualizacion as updated_at, a.eliminado as is_deleted
        FROM archivos a
        LEFT JOIN tipo_archivo ta ON a.tipo_archivo_id = ta.id
        WHERE {' AND '.join(conditions)}
        ORDER BY a.nombre
        """
        
        cursor = self.db.execute(query, params)
        return [dict(row) for row in cursor.fetchall()]
    
    def get_file(self, file_id: str) -> Optional[Dict[str, Any]]:
        """
        Obtener información de un archivo específico.
        
        Args:
            file_id: ID del archivo
            
        Returns:
            Diccionario con información del archivo o None
        """
        query = """
        SELECT a.id, a.nombre as name, a.nombre_original as original_name,
               ta.nombre as file_type, a.tamaño as file_size,
               a.carpeta_id as folder_id, a.usuario_id as user_id,
               a.ruta_almacenamiento as storage_path, a.url, a.thumbnail_url,
               a.fecha_creacion as created_at, a.fecha_actualizacion as updated_at,
               a.eliminado as is_deleted
        FROM archivos a
        LEFT JOIN tipo_archivo ta ON a.tipo_archivo_id = ta.id
        WHERE a.id = :file_id
        """
        
        cursor = self.db.execute(query, {'file_id': file_id})
        row = cursor.fetchone()
        
        return dict(row) if row else None
    
    def download_file(self, user_id: str, file_id: str) -> tuple[str, BinaryIO]:
        """
        Descargar archivo.
        
        Args:
            user_id: ID del usuario
            file_id: ID del archivo
            
        Returns:
            Tuple con (filename, file_data)
        """
        # Obtener información del archivo
        file_info = self.get_file(file_id)
        if not file_info:
            raise FileNotFoundError("Archivo no encontrado")
        
        # Validar permisos
        if not self.validate_file_access(user_id, file_id, "read"):
            raise PermissionError("No tienes permisos para descargar este archivo")
        
        # Verificar que el archivo físico existe
        storage_path = Path(file_info['storage_path'])
        if not storage_path.exists():
            raise FileNotFoundError("Archivo físico no encontrado")
        
        # Abrir archivo para lectura
        file_data = open(storage_path, 'rb')
        
        return file_info['original_name'], file_data
    
    def delete_file(self, user_id: str, file_id: str) -> bool:
        """
        Eliminación lógica de archivo (soft delete).
        
        Args:
            user_id: ID del usuario
            file_id: ID del archivo
            
        Returns:
            True si se eliminó exitosamente
        """
        try:
            # Validar permisos
            if not self.validate_file_access(user_id, file_id, "write"):
                raise PermissionError("No tienes permisos para eliminar este archivo")
            
            query = """
            UPDATE archivos 
            SET eliminado = 1, fecha_actualizacion = :updated_at
            WHERE id = :file_id AND usuario_id = :user_id
            """
            
            params = {
                'updated_at': datetime.now(),
                'file_id': file_id,
                'user_id': user_id
            }
            
            cursor = self.db.execute(query, params)
            self.db.commit()
            
            return cursor.rowcount > 0
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def restore_file(self, user_id: str, file_id: str) -> bool:
        """
        Restaurar archivo eliminado.
        
        Args:
            user_id: ID del usuario
            file_id: ID del archivo
            
        Returns:
            True si se restauró exitosamente
        """
        try:
            query = """
            UPDATE archivos 
            SET eliminado = 0, fecha_actualizacion = :updated_at
            WHERE id = :file_id AND usuario_id = :user_id AND eliminado = 1
            """
            
            params = {
                'updated_at': datetime.now(),
                'file_id': file_id,
                'user_id': user_id
            }
            
            cursor = self.db.execute(query, params)
            self.db.commit()
            
            return cursor.rowcount > 0
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def move_file(self, user_id: str, file_id: str, 
                 target_folder_id: Optional[str]) -> bool:
        """
        Mover archivo entre carpetas.
        
        Args:
            user_id: ID del usuario
            file_id: ID del archivo
            target_folder_id: ID de la carpeta destino (None para raíz)
            
        Returns:
            True si se movió exitosamente
        """
        try:
            # Validar permisos del archivo
            if not self.validate_file_access(user_id, file_id, "write"):
                raise PermissionError("No tienes permisos para mover este archivo")
            
            # Validar permisos de la carpeta destino
            if target_folder_id:
                if not self.validate_folder_access(user_id, target_folder_id, "write"):
                    raise PermissionError("No tienes permisos en la carpeta de destino")
            
            query = """
            UPDATE archivos 
            SET carpeta_id = :target_folder_id, fecha_actualizacion = :updated_at
            WHERE id = :file_id AND usuario_id = :user_id
            """
            
            params = {
                'target_folder_id': target_folder_id,
                'updated_at': datetime.now(),
                'file_id': file_id,
                'user_id': user_id
            }
            
            cursor = self.db.execute(query, params)
            self.db.commit()
            
            return cursor.rowcount > 0
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def search_files(self, user_id: str, search_term: str) -> List[Dict[str, Any]]:
        """
        Buscar archivos por nombre.
        
        Args:
            user_id: ID del usuario
            search_term: Término de búsqueda
            
        Returns:
            Lista de archivos que coinciden
        """
        query = """
        SELECT a.id, a.nombre as name, a.nombre_original as original_name,
               ta.nombre as file_type, a.tamaño as file_size,
               a.carpeta_id as folder_id, a.usuario_id as user_id,
               a.url, a.thumbnail_url, a.fecha_creacion as created_at,
               a.fecha_actualizacion as updated_at
        FROM archivos a
        LEFT JOIN tipo_archivo ta ON a.tipo_archivo_id = ta.id
        WHERE a.usuario_id = :user_id 
        AND a.eliminado = 0
        AND UPPER(a.nombre) LIKE UPPER(:search_term)
        ORDER BY a.fecha_actualizacion DESC
        """
        
        params = {
            'user_id': user_id,
            'search_term': f'%{search_term}%'
        }
        
        cursor = self.db.execute(query, params)
        return [dict(row) for row in cursor.fetchall()]
    
    def get_recent_files(self, user_id: str, days: int = 30) -> List[Dict[str, Any]]:
        """
        Obtener archivos modificados recientemente.
        
        Args:
            user_id: ID del usuario
            days: Número de días hacia atrás
            
        Returns:
            Lista de archivos recientes
        """
        query = """
        SELECT a.id, a.nombre as name, a.nombre_original as original_name,
               ta.nombre as file_type, a.tamaño as file_size,
               a.carpeta_id as folder_id, a.usuario_id as user_id,
               a.url, a.thumbnail_url, a.fecha_creacion as created_at,
               a.fecha_actualizacion as updated_at
        FROM archivos a
        LEFT JOIN tipo_archivo ta ON a.tipo_archivo_id = ta.id
        WHERE a.usuario_id = :user_id 
        AND a.eliminado = 0
        AND a.fecha_actualizacion >= (SYSDATE - :days)
        ORDER BY a.fecha_actualizacion DESC
        """
        
        cursor = self.db.execute(query, {'user_id': user_id, 'days': days})
        return [dict(row) for row in cursor.fetchall()]
    
    # Métodos auxiliares
    
    def determine_file_type(self, filename: str) -> str:
        """Determinar tipo de archivo basado en extensión."""
        extension = Path(filename).suffix.lower()
        
        for file_type, extensions in self.allowed_extensions.items():
            if extension in extensions:
                return file_type
        
        return 'other'
    
    def calculate_file_hash(self, file_data: BinaryIO) -> str:
        """Calcular hash SHA-256 del archivo."""
        hash_sha256 = hashlib.sha256()
        file_data.seek(0)
        for chunk in iter(lambda: file_data.read(4096), b""):
            hash_sha256.update(chunk)
        return hash_sha256.hexdigest()
    
    def generate_thumbnail(self, image_path: Path, file_id: str) -> Optional[str]:
        """Generar thumbnail para imágenes."""
        try:
            from PIL import Image
            
            # Crear directorio de thumbnails
            thumb_dir = self.storage_path / "thumbnails"
            thumb_dir.mkdir(exist_ok=True)
            
            # Generar thumbnail
            with Image.open(image_path) as img:
                img.thumbnail((200, 200))
                thumb_path = thumb_dir / f"{file_id}_thumb.jpg"
                img.save(thumb_path, "JPEG", quality=85)
                
                return f"/api/thumbnails/{file_id}_thumb.jpg"
                
        except ImportError:
            # PIL no disponible
            return None
        except Exception:
            # Error generando thumbnail
            return None
    
    def validate_file_access(self, user_id: str, file_id: str, 
                           access_type: str = "read") -> bool:
        """
        Validar permisos de acceso a un archivo.
        
        Args:
            user_id: ID del usuario
            file_id: ID del archivo
            access_type: Tipo de acceso ("read" o "write")
            
        Returns:
            True si tiene permisos
        """
        # Verificar si es propietario
        file_info = self.get_file(file_id)
        if file_info and file_info['user_id'] == user_id:
            return True
        
        # Verificar permisos compartidos
        query = """
        SELECT ta.nombre as access_type
        FROM compartidos c
        JOIN usuarios u ON u.email = c.email_compartido
        JOIN tipo_acceso ta ON ta.id = c.tipo_acceso_id
        WHERE c.archivo_id = :file_id 
        AND u.id = :user_id 
        AND c.activo = 1
        """
        
        cursor = self.db.execute(query, {'file_id': file_id, 'user_id': user_id})
        result = cursor.fetchone()
        
        if not result:
            return False
        
        shared_access = result[0]
        if access_type == "read":
            return shared_access in ["solo_lectura", "lectura_escritura"]
        elif access_type == "write":
            return shared_access == "lectura_escritura"
        
        return False
    
    def validate_folder_access(self, user_id: str, folder_id: str, 
                              access_type: str = "read") -> bool:
        """
        Validar permisos de acceso a una carpeta.
        Implementación simplificada - en producción sería más compleja.
        """
        # Por ahora, asumimos que si el usuario puede ver la carpeta, puede acceder
        query = """
        SELECT usuario_id 
        FROM carpetas 
        WHERE id = :folder_id
        """
        
        cursor = self.db.execute(query, {'folder_id': folder_id})
        result = cursor.fetchone()
        
        return result and result[0] == user_id
    
    def insert_file_record(self, file_record: Dict[str, Any]) -> None:
        """Insertar registro de archivo en la base de datos."""
        # Obtener ID del tipo de archivo
        type_id = self.get_file_type_id(file_record['file_type'])
        
        query = """
        INSERT INTO archivos (id, nombre, nombre_original, tipo_archivo_id, 
                            tamaño, hash_archivo, carpeta_id, usuario_id,
                            ruta_almacenamiento, url, thumbnail_url,
                            fecha_creacion, fecha_actualizacion, eliminado)
        VALUES (:id, :name, :original_name, :type_id, :file_size, :file_hash,
               :folder_id, :user_id, :storage_path, :url, :thumbnail_url,
               :created_at, :updated_at, :is_deleted)
        """
        
        params = {**file_record, 'type_id': type_id}
        
        self.db.execute(query, params)
        self.db.commit()
    
    def get_file_type_id(self, file_type: str) -> int:
        """Obtener ID del tipo de archivo."""
        query = "SELECT id FROM tipo_archivo WHERE nombre = :file_type"
        cursor = self.db.execute(query, {'file_type': file_type})
        result = cursor.fetchone()
        
        if result:
            return result[0]
        else:
            # Crear tipo si no existe
            query = "INSERT INTO tipo_archivo (nombre) VALUES (:file_type)"
            self.db.execute(query, {'file_type': file_type})
            self.db.commit()
            return self.db.lastrowid
    
    def update_user_storage(self, user_id: str, size_change: int) -> None:
        """Actualizar estadísticas de almacenamiento del usuario."""
        query = """
        UPDATE almacenamiento 
        SET espacio_usado = espacio_usado + :size_change,
            fecha_actualizacion = :updated_at
        WHERE usuario_id = :user_id
        """
        
        params = {
            'size_change': size_change,
            'updated_at': datetime.now(),
            'user_id': user_id
        }
        
        cursor = self.db.execute(query, params)
        
        # Si no existe registro, crear uno
        if cursor.rowcount == 0:
            insert_query = """
            INSERT INTO almacenamiento (usuario_id, espacio_usado, espacio_total, fecha_actualizacion)
            VALUES (:user_id, :size_change, 16106127360, :updated_at)
            """  # 15GB por defecto
            
            self.db.execute(insert_query, params)
        
        self.db.commit()
    
    def generate_file_id(self) -> str:
        """Generar ID único para archivo."""
        import uuid
        return f"file_{uuid.uuid4().hex[:12]}"