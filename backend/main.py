import uvicorn
import json
from fastapi import FastAPI, Request, Response, Query
from typing import List, Optional
from models.paises import Pais
from backend.models.crear_carpetas import CarpetaCreate
from utils.database import execute_query_json
from models.userregister import UserRegister
from models.userlogin import UserLogin
from controllers.firebase import register_user_firebase, login_user_firebase
from controllers.carpetas import crear_carpeta_controller

from contextlib import asynccontextmanager

import logging

from utils.security import validate

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
    allow_origins=["*"],  # <- En producción, pon solo tu dominio, ej: ["https://midominio.com"]
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

@app.get("/paises", response_model=List[Pais])
def get_paises():
    result = execute_query_json("SELECT id_pais, nombre FROM paises ORDER BY nombre")
    return json.loads(result)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")
