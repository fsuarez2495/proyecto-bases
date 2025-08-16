import json
from utils.database import execute_query_json
from models.archivos import Archivos
from typing import List
from datetime import datetime


def get_all_archivos() -> List[Archivos]:
    query = "SELECT * FROM archivos ORDER BY nombre"
    
    # execute_query_json returns JSON string
    result_json = execute_query_json(query)
    
    # Convert JSON string to Python list of dicts
    result_list = json.loads(result_json)
    
    # Convert each dict to Carpetas Pydantic model
    return [Archivos(**folder) for folder in result_list]

def create_archivo(nombre: str,id_usuario_propietario: int, id_tipo_archivo: int) -> dict:
    
    query = """
        INSERT INTO archivos (
            nombre,
            fecha_creacion,
            fecha_visto,
            tamano_archivo,
            id_tipo_archivo,
            id_usuario_propietario,
            id_carpeta_ubicacion,
            estado_papelera
        )

        VALUES (
            :nombre, 
            :fecha_creacion, 
            :fecha_visto, 
            :tamano_archivo,
            :id_tipo_archivo, 
            :id_usuario_propietario, 
            :id_carpeta_ubicacion, 
            :estado_papelera
        )
    """



    params = {
        "nombre": nombre,
        "fecha_creacion": datetime.now(),
        "fecha_visto": datetime.now(),
        "tamano_archivo": 1024,  # ejemplo en bytes
        "id_tipo_archivo": 1,  # referencia a Tipos_archivos
        "id_usuario_propietario": id_usuario_propietario,  # usuario existente
        "id_carpeta_ubicacion": None,  # puede ser NULL si no está en carpeta
        "estado_papelera": 0
        }

    
        
    execute_query_json(query, params=params, needs_commit=True)

        # Devuelve solo el nombre y datos por defecto
    return {
            "nombre": nombre,
            "fecha_creacion": params["fecha_creacion"].isoformat(),
            "fecha_visto": params["fecha_visto"].isoformat(),
            "tamano_archivo":params["tamano_archivo"],
            "id_tipo_archivo":params["id_tipo_archivo"],
            "id_usuario_propietario": params["id_usuario_propietario"],
            "id_carpeta_ubicacion": params["id_carpeta_ubicacion"],
            "estado_papelera": params["estado_papelera"]
        }


def delete_archivo(id_archivo: int) -> dict:
    query = """
        DELETE FROM archivos
        WHERE id_archivo = :id_archivo
    """
    
    params = {
        "id_archivo": id_archivo
    }

    # Ejecuta la eliminación y confirma cambios
    execute_query_json(query, params=params, needs_commit=True)

    # Devuelve un mensaje indicando éxito
    return {
        "message": f"Archivo con id {id_archivo} eliminado correctamente."
    }

