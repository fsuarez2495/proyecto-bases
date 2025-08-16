
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from utils.database import get_db_connection
from folders import FolderManager
from models.folder import FolderCreate, FolderResponse
from typing import Optional

router = APIRouter(prefix="/folders", tags=["Folders"])

@router.post("/", response_model=FolderResponse)
def create_folder(folder: FolderCreate, db=Depends(get_db_connection)):
    manager = FolderManager(db)
    try:
        return manager.create_folder(
            folder.id_usuario_propietario,
            folder.nombre,
            folder.id_carpeta_padre,
            folder.id_color
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id_usuario}", response_model=List[FolderResponse])
def list_user_folders(id_usuario: int, id_padre: Optional[int] = None, incluir_eliminadas: bool = False, db=Depends(get_db_connection)):
    manager = FolderManager(db)
    try:
        return manager.list_user_folders(id_usuario, id_padre, incluir_eliminadas)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/folder/{id_carpeta}", response_model=FolderResponse)
def get_folder(id_carpeta: int, db=Depends(get_db_connection)):
    manager = FolderManager(db)
    try:
        folder = manager.get_folder(id_carpeta)
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        return folder
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
