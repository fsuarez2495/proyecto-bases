import json
from utils.database import execute_query_json
from models.colores import Colores

def get_all_colores():
    query = "SELECT id_color, nombre, codigo_hex FROM colores"
    result = execute_query_json(query)
    return [Colores(**c) for c in json.loads(result)]
