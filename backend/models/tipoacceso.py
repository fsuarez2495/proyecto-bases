from pydantic import BaseModel, Field

class TiposAccesos(BaseModel):
    id_tipo_acceso: int = Field(..., description="ID del tipo de acceso, clave primaria")
    tipo_acceso: str = Field(..., max_length=50, description="Nombre del tipo de acceso, único y no nulo")
    enlace: str = Field(..., max_length=250, description="Enlace asociado al acceso, único y no nulo")
    rol: str = Field(..., max_length=50, description="Rol asociado al acceso, único y no nulo")
