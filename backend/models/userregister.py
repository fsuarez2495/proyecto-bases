from pydantic import BaseModel, Field, validator
import re

class UserRegister(BaseModel):
    nombre: str = Field(..., max_length=50)
    apellido: str = Field(..., max_length=50)
    correo_electronico: str = Field(..., max_length=50)
    contrasena: str = Field(..., min_length=8, max_length=64)
    id_pais: int = Field(..., ge=1) 


    @validator('correo_electronico')
    def validar_email(cls, v):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', v):
            raise ValueError('Correo electrónico inválido')
        return v

    @validator('contrasena')
    def validar_contrasena(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Debe contener al menos una mayúscula')
        if not re.search(r'\d', v):
            raise ValueError('Debe contener al menos un número')
        if not re.search(r'[@$!%*?&]', v):
            raise ValueError('Debe contener al menos un carácter especial')
        return v
