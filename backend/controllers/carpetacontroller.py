import json
from utils.database import execute_query_json
from models.carpetas import Carpetas
from typing import List
from datetime import datetime

def get_all_folders() -> List[Carpetas]:
    query = """
        SELECT 
            *
        FROM carpetas
        ORDER BY nombre
    """
    result = execute_query_json(query)
    folders_list = json.loads(result)
    return [Carpetas(**folder) for folder in folders_list]


def create_carpeta(nombre: str) -> dict:
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
        "id_usuario_propietario": 10,
        "id_carpeta_padre": None,
        "id_color": 9,
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
