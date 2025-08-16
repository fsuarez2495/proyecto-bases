from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Carpetas(BaseModel):
    id_carpeta: Optional[int] = None 
    nombre: str
    fecha_creacion: Optional[datetime] = None
    fecha_ultima_modificacion: Optional[datetime] = None
    id_usuario_propietario: Optional[int] = None
    id_carpeta_padre: Optional[int] = None
    id_color: Optional[int] = None
    estado_papelera: Optional[int] = None
