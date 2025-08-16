from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Comentarios(BaseModel):
    id_comentario: Optional[int] = Field(None)
    descripcion: Optional[str] = Field(None, max_length=300)
    fecha_comentario: Optional[datetime] = Field(None)
    id_usuario_comentador: Optional[int] = Field(None)
    id_archivo: Optional[int] = Field(None)
