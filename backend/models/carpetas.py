from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CarpetaCreate(BaseModel):
    nombre: str
    id_usuario_propietario: int
    id_color: int
    id_carpeta_padre: Optional[int] = None
