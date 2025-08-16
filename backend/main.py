from http.client import HTTPException
import uvicorn
import json
from fastapi import FastAPI, Request, Response, Query, Body
from typing import List, Optional
from models.paises import Pais
from utils.database import execute_query_json
from models.userregister import UserRegister
from models.userlogin import UserLogin, Usuario
from controllers.firebase import get_usuario_por_correo, register_user_firebase, login_user_firebase
from models.colores import Colores
from controllers.colores_controller import get_all_colores
from models.carpetas import Carpetas
from models.compartidos import Compartidos
from models.archivos import Archivos
from models.comentarios import Comentarios
from controllers.comentarioscontrollers import get_all_comentarios,create_comentario, delete_comentario
from controllers.archivoscontroller import get_all_archivos,create_archivo, delete_archivo
from controllers.compartidoscontroller import get_all_compartidos, create_compartido
from controllers.carpetacontroller import get_all_folders, create_carpeta,delete_carpeta


from contextlib import asynccontextmanager

import logging

from utils.security import validate

from fastapi.middleware.cors import CORSMiddleware

from fastapi.middleware.cors import CORSMiddleware



logging.basicConfig( level=logging.INFO )
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting API...")
    yield
    logger.info("Shutting down API...")


app = FastAPI(title="Drive API", version="0.0.1",  lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@validate
async def health_check(request: Request):
    return {"status": "healthy", "version": "0.0.1"}

@app.get("/")
async def read_root():
    return {"hello": "world"}

@app.post("/signup")
async def signup(user: UserRegister):
    return await register_user_firebase(user)

@app.post("/login")
async def login(user: UserLogin):
    return await login_user_firebase(user)

@app.get("/usuarios", response_model=Usuario)
async def obtener_usuario(correo: str):
    usuario = get_usuario_por_correo(correo)
    if usuario:
        return usuario
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

@app.get("/paises", response_model=List[Pais])
def get_paises():
    result = execute_query_json("SELECT id_pais, nombre FROM paises ORDER BY nombre")
    return json.loads(result)

@app.get("/carpetas", response_model=List[Carpetas])
async def list_carpetas():
    return get_all_folders()

@app.post("/carpetas", response_model=Carpetas)
async def add_carpeta(carpeta: Carpetas):
    return create_carpeta(nombre = carpeta.nombre, id_usuario_propietario = carpeta.id_usuario_propietario )

@app.get("/colores", response_model=List[Colores])
async def list_colores():
    return get_all_colores()

@app.delete("/carpetas/{id_carpeta}")
async def remove_carpeta(id_carpeta: int):
    return delete_carpeta(id_carpeta)

@app.get("/compartidos", response_model=List[Compartidos])
async def list_compartidos():
    return get_all_compartidos()


@app.post("/compartidos", response_model=Compartidos)
async def add_compartido(compartido:Compartidos):
    return create_compartido( id_usuario_comparte=compartido.id_usuario_comparte,
                            id_archivo_compartido=compartido.id_archivo_compartido,
                            id_usuario_receptor=compartido.id_usuario_receptor
                            )


@app.get("/archivos", response_model=List[Archivos])
async def list_archivos():
    return get_all_archivos()


@app.post("/archivos", response_model=Archivos)
async def add_archivo(archivo:Archivos):
    return create_archivo( nombre = archivo.nombre,
                           id_usuario_propietario=archivo.id_usuario_propietario,
                            id_tipo_archivo=archivo.id_tipo_archivo
                        )

@app.delete("/archivos/{id_archivo}")
async def remove_archivo(id_archivo: int):
    return delete_archivo(id_archivo)

@app.get("/comentarios", response_model=List[Comentarios])
async def list_comentarios():
    return get_all_comentarios()

@app.post("/comentarios", response_model=Comentarios)
async def add_comentario(comentario: Comentarios):
    return create_comentario(
        descripcion=comentario.descripcion,
        id_usuario_comentador=comentario.id_usuario_comentador,
        id_archivo=comentario.id_archivo
    )

@app.delete("/comentarios/{id_comentario}")
async def remove_comentario(id_comentario: int):
    return delete_comentario(id_comentario)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")
