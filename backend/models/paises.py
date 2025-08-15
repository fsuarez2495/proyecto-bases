from pydantic import BaseModel
from typing import List
class Pais(BaseModel):
    id_pais: int
    nombre: str
