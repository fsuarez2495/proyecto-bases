# Módulo de Carpetas (folders.py)
# Responsable de la gestión completa de carpetas en el sistema Drive

from datetime import datetime
from typing import List, Optional, Dict, Any

class FolderManager:
    """
    Gestor de carpetas con soporte para estructura padre-hijo,
    permisos de acceso y operaciones CRUD completas.
    """
    
    def __init__(self, db_connection):
        """
        Inicializa el gestor de carpetas.
        
        Args:
            db_connection: Conexión a la base de datos Oracle
        """
        self.db = db_connection
    
    def create_folder(self, user_id: str, name: str, parent_folder_id: Optional[str] = None, 
                     color: str = "#1a73e8") -> Dict[str, Any]:
        """
        Crear una nueva carpeta con soporte para carpeta padre-hijo.
        
        Args:
            user_id: ID del usuario propietario
            name: Nombre de la carpeta
            parent_folder_id: ID de la carpeta padre (opcional)
            color: Color de la carpeta
            
        Returns:
            Dict con la información de la carpeta creada
        """
        try:
            # Validar permisos si es una subcarpeta
            if parent_folder_id:
                if not self.validate_folder_access(user_id, parent_folder_id, "write"):
                    raise PermissionError("No tienes permisos para crear carpetas aquí")
            
            # Validar nombre único en el mismo nivel
            if self.folder_name_exists(user_id, name, parent_folder_id):
                raise ValueError("Ya existe una carpeta con ese nombre en esta ubicación")
            
            folder_data = {
                'id': self.generate_folder_id(),
                'name': name,
                'parent_folder_id': parent_folder_id,
                'user_id': user_id,
                'created_at': datetime.now(),
                'updated_at': datetime.now(),
                'is_deleted': False,
                'color': color
            }
            
            # Insertar en base de datos
            query = """
            INSERT INTO carpetas (id, nombre, carpeta_padre_id, usuario_id, 
                                fecha_creacion, fecha_actualizacion, eliminado, color)
            VALUES (:id, :name, :parent_folder_id, :user_id, 
                   :created_at, :updated_at, :is_deleted, :color)
            """
            
            self.db.execute(query, folder_data)
            self.db.commit()
            
            return folder_data
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def list_user_folders(self, user_id: str, parent_folder_id: Optional[str] = None, 
                         include_deleted: bool = False) -> List[Dict[str, Any]]:
        """
        Listar carpetas de un usuario con filtros opcionales.
        
        Args:
            user_id: ID del usuario
            parent_folder_id: Filtrar por carpeta padre (None para carpetas raíz)
            include_deleted: Incluir carpetas eliminadas
            
        Returns:
            Lista de carpetas
        """
        conditions = ["usuario_id = :user_id"]
        params = {'user_id': user_id}
        
        if parent_folder_id:
            conditions.append("carpeta_padre_id = :parent_folder_id")
            params['parent_folder_id'] = parent_folder_id
        else:
            conditions.append("carpeta_padre_id IS NULL")
        
        if not include_deleted:
            conditions.append("eliminado = 0")
        
        query = f"""
        SELECT id, nombre as name, carpeta_padre_id as parent_folder_id,
               usuario_id as user_id, fecha_creacion as created_at,
               fecha_actualizacion as updated_at, eliminado as is_deleted,
               color
        FROM carpetas
        WHERE {' AND '.join(conditions)}
        ORDER BY nombre
        """
        
        cursor = self.db.execute(query, params)
        return [dict(row) for row in cursor.fetchall()]
    
    def get_folder(self, folder_id: str) -> Optional[Dict[str, Any]]:
        """
        Obtener información de una carpeta específica.
        
        Args:
            folder_id: ID de la carpeta
            
        Returns:
            Diccionario con información de la carpeta o None si no existe
        """
        query = """
        SELECT id, nombre as name, carpeta_padre_id as parent_folder_id,
               usuario_id as user_id, fecha_creacion as created_at,
               fecha_actualizacion as updated_at, eliminado as is_deleted,
               color
        FROM carpetas
        WHERE id = :folder_id
        """
        
        cursor = self.db.execute(query, {'folder_id': folder_id})
        row = cursor.fetchone()
        
        return dict(row) if row else None
    
    def move_folder(self, user_id: str, folder_id: str, 
                   new_parent_id: Optional[str] = None) -> bool:
        """
        Mover carpeta a una nueva ubicación.
        
        Args:
            user_id: ID del usuario
            folder_id: ID de la carpeta a mover
            new_parent_id: ID de la nueva carpeta padre
            
        Returns:
            True si se movió exitosamente
        """
        try:
            # Validar permisos de la carpeta a mover
            if not self.validate_folder_access(user_id, folder_id, "write"):
                raise PermissionError("No tienes permisos para mover esta carpeta")
            
            # Validar permisos del destino
            if new_parent_id:
                if not self.validate_folder_access(user_id, new_parent_id, "write"):
                    raise PermissionError("No tienes permisos en la carpeta de destino")
            
            # Prevenir bucles (carpeta padre no puede ser descendiente)
            if new_parent_id and self.is_descendant(folder_id, new_parent_id):
                raise ValueError("No se puede mover: crearía un bucle en la estructura")
            
            # Actualizar ubicación
            query = """
            UPDATE carpetas 
            SET carpeta_padre_id = :new_parent_id, fecha_actualizacion = :updated_at
            WHERE id = :folder_id AND usuario_id = :user_id
            """
            
            params = {
                'new_parent_id': new_parent_id,
                'updated_at': datetime.now(),
                'folder_id': folder_id,
                'user_id': user_id
            }
            
            cursor = self.db.execute(query, params)
            self.db.commit()
            
            return cursor.rowcount > 0
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def soft_delete_folder(self, user_id: str, folder_id: str) -> bool:
        """
        Eliminación lógica de carpeta (soft delete).
        
        Args:
            user_id: ID del usuario
            folder_id: ID de la carpeta
            
        Returns:
            True si se eliminó exitosamente
        """
        try:
            # Validar permisos
            if not self.validate_folder_access(user_id, folder_id, "write"):
                raise PermissionError("No tienes permisos para eliminar esta carpeta")
            
            # Marcar como eliminada
            query = """
            UPDATE carpetas 
            SET eliminado = 1, fecha_actualizacion = :updated_at
            WHERE id = :folder_id AND usuario_id = :user_id
            """
            
            params = {
                'updated_at': datetime.now(),
                'folder_id': folder_id,
                'user_id': user_id
            }
            
            cursor = self.db.execute(query, params)
            self.db.commit()
            
            return cursor.rowcount > 0
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def restore_folder(self, user_id: str, folder_id: str) -> bool:
        """
        Restaurar carpeta eliminada.
        
        Args:
            user_id: ID del usuario
            folder_id: ID de la carpeta
            
        Returns:
            True si se restauró exitosamente
        """
        try:
            query = """
            UPDATE carpetas 
            SET eliminado = 0, fecha_actualizacion = :updated_at
            WHERE id = :folder_id AND usuario_id = :user_id AND eliminado = 1
            """
            
            params = {
                'updated_at': datetime.now(),
                'folder_id': folder_id,
                'user_id': user_id
            }
            
            cursor = self.db.execute(query, params)
            self.db.commit()
            
            return cursor.rowcount > 0
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_folder_path(self, folder_id: str) -> List[Dict[str, Any]]:
        """
        Obtener la ruta completa de una carpeta (breadcrumb).
        
        Args:
            folder_id: ID de la carpeta
            
        Returns:
            Lista de carpetas desde la raíz hasta la carpeta especificada
        """
        path = []
        current_id = folder_id
        
        while current_id:
            folder = self.get_folder(current_id)
            if not folder:
                break
            path.insert(0, folder)
            current_id = folder['parent_folder_id']
        
        return path
    
    def validate_folder_access(self, user_id: str, folder_id: str, 
                              access_type: str = "read") -> bool:
        """
        Validar permisos de acceso a una carpeta.
        
        Args:
            user_id: ID del usuario
            folder_id: ID de la carpeta
            access_type: Tipo de acceso ("read" o "write")
            
        Returns:
            True si tiene permisos
        """
        # Verificar si es propietario
        folder = self.get_folder(folder_id)
        if folder and folder['user_id'] == user_id:
            return True
        
        # Verificar permisos compartidos
        query = """
        SELECT tipo_acceso_id
        FROM compartidos c
        JOIN usuarios u ON u.email = c.email_compartido
        WHERE c.carpeta_id = :folder_id 
        AND u.id = :user_id 
        AND c.activo = 1
        """
        
        cursor = self.db.execute(query, {'folder_id': folder_id, 'user_id': user_id})
        result = cursor.fetchone()
        
        if not result:
            return False
        
        # Verificar tipo de acceso
        access_id = result[0]
        if access_type == "read":
            return access_id in [1, 2]  # 1: solo lectura, 2: lectura/escritura
        elif access_type == "write":
            return access_id == 2  # 2: lectura/escritura
        
        return False
    
    def folder_name_exists(self, user_id: str, name: str, 
                          parent_folder_id: Optional[str]) -> bool:
        """
        Verificar si ya existe una carpeta con el mismo nombre en la ubicación.
        
        Args:
            user_id: ID del usuario
            name: Nombre de la carpeta
            parent_folder_id: ID de la carpeta padre
            
        Returns:
            True si existe
        """
        conditions = ["usuario_id = :user_id", "nombre = :name", "eliminado = 0"]
        params = {'user_id': user_id, 'name': name}
        
        if parent_folder_id:
            conditions.append("carpeta_padre_id = :parent_folder_id")
            params['parent_folder_id'] = parent_folder_id
        else:
            conditions.append("carpeta_padre_id IS NULL")
        
        query = f"""
        SELECT COUNT(*) 
        FROM carpetas 
        WHERE {' AND '.join(conditions)}
        """
        
        cursor = self.db.execute(query, params)
        return cursor.fetchone()[0] > 0
    
    def is_descendant(self, ancestor_id: str, potential_descendant_id: str) -> bool:
        """
        Verificar si una carpeta es descendiente de otra (prevenir bucles).
        
        Args:
            ancestor_id: ID de la carpeta ancestro
            potential_descendant_id: ID del potencial descendiente
            
        Returns:
            True si es descendiente
        """
        current_id = potential_descendant_id
        visited = set()
        
        while current_id and current_id not in visited:
            if current_id == ancestor_id:
                return True
            
            visited.add(current_id)
            folder = self.get_folder(current_id)
            current_id = folder['parent_folder_id'] if folder else None
        
        return False
    
    def generate_folder_id(self) -> str:
        """Generar ID único para carpeta."""
        import uuid
        return f"folder_{uuid.uuid4().hex[:12]}"
    
    def get_folder_statistics(self, user_id: str, folder_id: Optional[str] = None) -> Dict[str, int]:
        """
        Obtener estadísticas de una carpeta.
        
        Args:
            user_id: ID del usuario
            folder_id: ID de la carpeta (None para estadísticas generales)
            
        Returns:
            Diccionario con estadísticas
        """
        stats = {
            'total_folders': 0,
            'total_files': 0,
            'total_size': 0
        }
        
        # Contar subcarpetas
        folder_query = """
        SELECT COUNT(*) 
        FROM carpetas 
        WHERE usuario_id = :user_id AND eliminado = 0
        """
        folder_params = {'user_id': user_id}
        
        if folder_id:
            folder_query += " AND carpeta_padre_id = :folder_id"
            folder_params['folder_id'] = folder_id
        else:
            folder_query += " AND carpeta_padre_id IS NULL"
        
        cursor = self.db.execute(folder_query, folder_params)
        stats['total_folders'] = cursor.fetchone()[0]
        
        # Contar archivos
        file_query = """
        SELECT COUNT(*), COALESCE(SUM(tamaño), 0)
        FROM archivos 
        WHERE usuario_id = :user_id AND eliminado = 0
        """
        file_params = {'user_id': user_id}
        
        if folder_id:
            file_query += " AND carpeta_id = :folder_id"
            file_params['folder_id'] = folder_id
        else:
            file_query += " AND carpeta_id IS NULL"
        
        cursor = self.db.execute(file_query, file_params)
        result = cursor.fetchone()
        stats['total_files'] = result[0]
        stats['total_size'] = result[1]
        
        return stats