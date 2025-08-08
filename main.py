import uvicorn
from fastapi import FastAPI, Request, Response, Query
from typing import List, Optional
from models.userregister import UserRegister
from models.userlogin import UserLogin
from controllers.firebase import register_user_firebase, login_user_firebase

from contextlib import asynccontextmanager

import logging

from utils.security import validate

logging.basicConfig( level=logging.INFO )
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting API...")
    yield
    logger.info("Shutting down API...")


app = FastAPI(title="Drive API", version="0.0.1",  lifespan=lifespan)



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


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")
