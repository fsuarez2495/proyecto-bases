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

async def login_user_firebase(user: UserLogin):
    api_key = os.getenv("FIREBASE_API_KEY")
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"

    payload = {"email": user.correo_electronico, "password": user.contrasena, "returnSecureToken": True}
    response = requests.post(url, json=payload)
    response_data = response.json()

    if "error" in response_data:
        logger.warning(f"Firebase login failed: {response_data['error']}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al autenticar usuario: {response_data['error']['message']}"
        )

    query = """
        SELECT correo_electronico, nombre, apellido
        FROM usuarios2
        WHERE correo_electronico = :correo_electronico

    """

    try:
        result_json =  execute_query_json(query, (user.correo_electronico,), needs_commit=False)
        result_dict = json.loads(result_json)

        if not result_dict:
            raise HTTPException(status_code=404, detail="Usuario no encontrado en la base de datos")

        user_db = result_dict[0]

        return {
            "message": "Usuario autenticado exitosamente",
            "idToken": create_jwt_token(
                user_db["nombre"],
                user_db["apellido"],
                user.correo_electronico,
            )
        }
    except Exception as e:
        logger.exception("Error obteniendo datos del usuario en Oracle")
        raise HTTPException(status_code=500, detail="Error obteniendo datos del usuario")



