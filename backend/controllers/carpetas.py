# controllers/carpetas.py
from fastapi import HTTPException
from datetime import datetime
from models.carpetas import CarpetaCreate
from  utils.database import get_db_connection
import oracledb

async def crear_carpeta_controller(carpeta: CarpetaCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        fecha = datetime.now()
        cursor.execute("""
            INSERT INTO Carpetas 
            (nombre, fecha_creacion, fecha_ultima_modificacion, id_usuario_propietario, id_carpeta_padre, id_color)
            VALUES (:nombre, :fecha_creacion, :fecha_ultima_modificacion, :id_usuario, :id_padre, :id_color)
        """, {
            "nombre": carpeta.nombre,
            "fecha_creacion": fecha,
            "fecha_ultima_modificacion": None,
            "id_usuario": carpeta.id_usuario_propietario,
            "id_padre": carpeta.id_carpeta_padre,
            "id_color": carpeta.id_color
        })
        conn.commit()
        return {"mensaje": "Carpeta creada correctamente"}
    except oracledb.DatabaseError as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()
