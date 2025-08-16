import json
from datetime import datetime
from typing import List
from utils.database import execute_query_json
from models.comentarios import Comentarios

def get_all_comentarios() -> List[Comentarios]:
    query = "SELECT * FROM comentarios ORDER BY fecha_comentario"

    # execute_query_json returns a JSON string
    result_json = execute_query_json(query)

    # Convert JSON string to Python list of dicts
    result_list = json.loads(result_json)

    # Convert each dict to Comentarios Pydantic model
    return [Comentarios(**comentario) for comentario in result_list]

def create_comentario(descripcion: str, id_usuario_comentador: int, id_archivo: int) -> dict:
    query = """
        INSERT INTO comentarios (
            descripcion,
            fecha_comentario,
            id_usuario_comentador,
            id_archivo
        )
        VALUES (
            :descripcion,
            :fecha_comentario,
            :id_usuario_comentador,
            :id_archivo
        )
    """

    params = {
        "descripcion": descripcion,
        "fecha_comentario": datetime.now(),
        "id_usuario_comentador": id_usuario_comentador,
        "id_archivo": id_archivo
    }

    execute_query_json(query, params=params, needs_commit=True)

    return {
        "descripcion": params["descripcion"],
        "fecha_comentario": params["fecha_comentario"].isoformat(),
        "id_usuario_comentador": params["id_usuario_comentador"],
        "id_archivo": params["id_archivo"]
    }

# Controller
def delete_comentario(id_comentario: int) -> dict:
    """
    Elimina un comentario por su id_comentario.
    """
    query = "DELETE FROM comentarios WHERE id_comentario = :id_comentario"
    params = {"id_comentario": id_comentario}

    execute_query_json(query, params=params, needs_commit=True)

    return {"message": f"Comentario {id_comentario} eliminado correctamente."}
