from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Archivos(BaseModel):
    id_archivo: Optional[int] = None
    nombre: Optional[str] = None
    fecha_creacion: Optional[datetime] = None
    fecha_visto: Optional[datetime] = None
    tamano_archivo: Optional[int] = None
    id_tipo_archivo: Optional[int] = None
    id_usuario_propietario: Optional[int] = None
    id_carpeta_ubicacion: Optional[int] = None
    estado_papelera: Optional[int] = None

