import os
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException
from dotenv import load_dotenv
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from functools import wraps

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

# ========================
# Función para crear un JWT
# ========================
def create_jwt_token(nombre: str, apellido: str, correo_electronico: str ):
    expiration = datetime.utcnow() + timedelta(hours=1)  # El token expira en 1 hora
    token = jwt.encode(
        {
            "nombre": nombre,
            "apellido": apellido,
            "correo_electronico": correo_electronico,
        
            "exp": expiration,
            "iat": datetime.utcnow()
        },
        SECRET_KEY,
        algorithm="HS256"
    )
    return token

# ========================
# Decorador para validar token normal
# ========================
def validate(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        request = kwargs.get('request')
        if not request:
            raise HTTPException(status_code=400, detail="Objeto de la solicitud no encontrado")

        authorization: str = request.headers.get("Authorization")
        if not authorization:
            raise HTTPException(status_code=400, detail="El usuario no esta autenticado")

        # Debe ser Bearer <token>
        schema, token = authorization.split()
        if schema.lower() != "bearer":
            raise HTTPException(status_code=400, detail="Invalid auth schema")

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            correo_electronico = payload.get("correo_electronico")
            nombre = payload.get("nombre")
            apellido = payload.get("apellido")
            exp = payload.get("exp")

            if correo_electronico is None or exp is None:
                raise HTTPException(status_code=400, detail="Invalid token payload")

            if datetime.utcfromtimestamp(exp) < datetime.utcnow():
                raise HTTPException(status_code=401, detail="Expired token")


            # Guardar datos en request.state
            request.state.correo_electronico = correo_electronico
            request.state.nombre = nombre
            request.state.apellido = apellido

        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Expired token")
        except InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

        return await func(*args, **kwargs)
    return wrapper

