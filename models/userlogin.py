from pydantic import BaseModel


class UserLogin(BaseModel):
    correo_electronico: str
    contrasena: str
