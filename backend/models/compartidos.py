from pydantic import BaseModel, Field
from typing import Optional

class Compartidos(BaseModel):
    id_usuario_receptor: Optional[int] = Field(..., description="ID del usuario que recibe el acceso")
    id_usuario_comparte: Optional[int] = Field(..., description="ID del usuario que comparte")
    id_carpeta_compartida: Optional[int] = Field(None, description="ID de la carpeta compartida")
    id_archivo_compartido: Optional[int] = Field(None, description="ID del archivo compartido")
    id_tipo_acceso: Optional[int] = Field(..., description="ID del tipo de acceso")
