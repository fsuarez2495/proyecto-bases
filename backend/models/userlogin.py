from pydantic import BaseModel

class UserLogin(BaseModel):
    correo_electronico: str
    contrasena: str

class Usuario(BaseModel):
    id: int
    nombre: str
    apellido: str
    correo_electronico: str
    id_pais: int
    id_almacenamiento: int | None = None 