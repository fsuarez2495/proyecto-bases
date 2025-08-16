import os
import json
import logging
import firebase_admin
import requests
from pathlib import Path
from fastapi import HTTPException
from firebase_admin import credentials, auth as firebase_auth
from dotenv import load_dotenv

from utils.database import execute_query_json
from utils.security import create_jwt_token
from models.userregister import UserRegister
from models.userlogin import UserLogin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Detectar ruta del proyecto y del JSON de Firebase
BASE_DIR = Path(__file__).resolve().parent.parent
SERVICE_ACCOUNT_PATH = BASE_DIR / "secrets" / "credenciales.json"
print(f"Usando service account: {SERVICE_ACCOUNT_PATH}")

# Inicializar Firebase solo si no está inicializado
if not firebase_admin._apps:
    cred = credentials.Certificate(str(SERVICE_ACCOUNT_PATH))
    firebase_admin.initialize_app(cred)

# Cargar variables de entorno
load_dotenv()


async def register_user_firebase(user: UserRegister) -> dict:
    try:
        # Crear usuario en Firebase
        user_record = firebase_auth.create_user(
            email=user.correo_electronico,
            password=user.contrasena
        )
        logger.info(f"Usuario Firebase creado: {user_record.uid}")
    except Exception as e:
        logger.exception("Error creando usuario en Firebase")
        raise HTTPException(status_code=400, detail=f"Error al registrar usuario: {e}")

    # Registrar en base de datos
    query = """
        INSERT INTO usuarios2 (correo_electronico, nombre, apellido, id_pais)
        VALUES (:correo_electronico, :nombre, :apellido, :id_pais)
        RETURNING id_usuario, correo_electronico, nombre, apellido, id_pais
            INTO :id_out, :correo_out, :nombre_out, :apellido_out, :pais_out
    """

    params = {
        "correo_electronico": user.correo_electronico,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "id_pais": user.id_pais
    }

    returning_vars = {
        "id_out": int,
        "correo_out": str,
        "nombre_out": str,
        "apellido_out": str,
        "pais_out": int
    }

    try:
        result_json = execute_query_json(
            query,
            params=params,
            needs_commit=True,
            returning_vars=returning_vars
        )
        return json.loads(result_json)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al registrar usuario: {e}")




