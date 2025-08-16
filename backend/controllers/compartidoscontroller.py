import json
from utils.database import execute_query_json
from models.compartidos import Compartidos
from typing import List
from datetime import datetime


def get_all_compartidos() -> List[Compartidos]:
    query = "SELECT * FROM compartidos"
    
    # execute_query_json returns JSON string
    result_json = execute_query_json(query)
    
    # Convert JSON string to Python list of dicts
    result_list = json.loads(result_json)
    
    # Convert each dict to Carpetas Pydantic model
    return [Compartidos(**folder) for folder in result_list]


def create_compartido(id_usuario_comparte: int,id_archivo_compartido:int, id_usuario_receptor:int) -> dict:
    
    query = """
        INSERT INTO compartidos (
            id_usuario_receptor,
            id_usuario_comparte,
            id_archivo_compartido,
            id_tipo_acceso
        )
        VALUES (
            :id_usuario_receptor, 
            :id_usuario_comparte, 
            :id_archivo_compartido, 
            :id_tipo_acceso
        )
    """

    params = {
        "id_usuario_receptor": id_usuario_receptor,
        "id_usuario_comparte": id_usuario_comparte,
        "id_archivo_compartido": id_archivo_compartido,
        "id_tipo_acceso": 1,
    }

    # Ejecuta la inserción y confirma cambios
    execute_query_json(query, params=params, needs_commit=True)

    # Devuelve solo el nombre y datos por defecto
    return {

         "id_usuario_receptor": params["id_usuario_receptor"],
        "id_usuario_comparte": params["id_usuario_comparte"],
        "id_archivo_compartido": params ["id_archivo_compartido"],
        "id_tipo_acceso": params["id_tipo_acceso"],

    }
