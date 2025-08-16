import json
from utils.database import execute_query_json
from models.carpetas import Carpetas
from typing import List
from datetime import datetime


def get_all_folders() -> List[Carpetas]:
    query = "SELECT * FROM carpetas ORDER BY nombre"
    
    # execute_query_json returns JSON string
    result_json = execute_query_json(query)
    
    # Convert JSON string to Python list of dicts
    result_list = json.loads(result_json)
    
    # Convert each dict to Carpetas Pydantic model
    return [Carpetas(**folder) for folder in result_list]


def create_carpeta(nombre: str, id_usuario_propietario: int) -> dict:
    """
    Crea una nueva carpeta en la base de datos con valores por defecto.
    No usa RETURNING INTO.
    """
    query = """
        INSERT INTO carpetas (
            nombre, 
            fecha_creacion, 
            fecha_ultima_modificacion, 
            id_usuario_propietario, 
            id_carpeta_padre, 
            id_color, 
            estado_papelera
        )
        VALUES (
            :nombre, 
            :fecha_creacion, 
            :fecha_ultima_modificacion, 
            :id_usuario_propietario, 
            :id_carpeta_padre, 
            :id_color, 
            :estado_papelera
        )
    """

    params = {
        "nombre": nombre,
        "fecha_creacion": datetime.now(),
        "fecha_ultima_modificacion": datetime.now(),
        "id_usuario_propietario": id_usuario_propietario,
        "id_carpeta_padre": None,
        "id_color": 1,
        "estado_papelera": 0
    }

    # Ejecuta la inserción y confirma cambios
    execute_query_json(query, params=params, needs_commit=True)

    # Devuelve solo el nombre y datos por defecto
    return {
        "nombre": nombre,
        "fecha_creacion": params["fecha_creacion"].isoformat(),
        "fecha_ultima_modificacion": params["fecha_ultima_modificacion"].isoformat(),
        "id_usuario_propietario": params["id_usuario_propietario"],
        "id_carpeta_padre": params["id_carpeta_padre"],
        "id_color": params["id_color"],
        "estado_papelera": params["estado_papelera"]
    }

def delete_carpeta(id_carpeta: int) -> dict:
    query = """
        DELETE FROM carpetas
        WHERE id_carpeta = :id_carpeta
    """

    params = {
        "id_carpeta": id_carpeta
    }

    # Ejecuta la eliminación y confirma cambios
    execute_query_json(query, params=params, needs_commit=True)

    # Devuelve un mensaje indicando éxito
    return {
        "message": f"Carpeta con id {id_carpeta} eliminada correctamente."
    }