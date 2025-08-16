from pydantic import BaseModel

class Colores(BaseModel):
    id_color: int
    nombre: str
    codigo_hex: str  
