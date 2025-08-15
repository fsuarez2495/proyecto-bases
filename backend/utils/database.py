import os
import json
import logging
import asyncio
import oracledb
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Variables de entorno
ora_user = os.getenv("ORA_USERNAME")
ora_password = os.getenv("ORA_PASSWORD")
ora_host = os.getenv("ORA_HOST")
ora_port = os.getenv("ORA_PORT", "1521")
ora_service = os.getenv("ORA_SERVICE_NAME")

# Activar modo async
dsn = f"{ora_host}:{ora_port}/{ora_service}"



# Conexión a Oracle (modo async)
def get_db_connection():
    try:
        logger.info("Intentando conectar a Oracle...")
        conn = oracledb.connect(
            user=ora_user,
            password=ora_password,
            dsn=dsn
        )
        logger.info("✅ Conexión exitosa a Oracle.")
        return conn
    except Exception as e:
        logger.error(f"❌ Error de conexión a Oracle: {str(e)}")
        raise

# Ejecutar consulta y devolver lista de diccionarios
def execute_query(query: str, params=None):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, params or {})
        if cursor.description:
            columns = [col[0].lower() for col in cursor.description]
            rows = cursor.fetchall()
            return [dict(zip(columns, row)) for row in rows]
        return []
    finally:
        conn.close()

def insert_user(user: dict):
    """
    Inserta un usuario en la tabla usuarios de la base de datos.
    user = {
        "nombre": ...,
        "apellido": ...,
        "correo_electronico": ...,
        "id_pais": ...
    }
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO usuarios (nombre, apellido, correo_electronico, id_pais)
        VALUES (:nombre, :apellido, :correo_electronico, :id_pais)
        """
        cursor.execute(query, user)
        conn.commit()
        return True
    except Exception as e:
        print("Error insertando usuario:", e)
        return False
    finally:
        conn.close()

# Ejecutar consulta y devolver JSON
def execute_query_json(query: str, params=None, needs_commit=False, returning_vars=None):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        # Setup output variables if RETURNING INTO is needed
        if returning_vars:
            for key, var_type in returning_vars.items():
                params[key] = cursor.var(var_type)

        cursor.execute(query, params or {})

        if needs_commit:
            conn.commit()

        # Handle RETURNING INTO
        if returning_vars:
            result = {key: params[key].getvalue() for key in returning_vars.keys()}
            return json.dumps(result)

        # Handle SELECT queries
        if cursor.description:
            columns = [col[0].lower() for col in cursor.description]
            rows = cursor.fetchall()
            result = [dict(zip(columns, row)) for row in rows]
            return json.dumps(result)

        return json.dumps({"message": "Query executed successfully."})

    except Exception as e:
        logger.error(f"❌ Error ejecutando la consulta: {e}", exc_info=True)
        raise e
    finally:
        conn.close()
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        param_info = "(sin parámetros)" if not params else f"(con {len(params)} parámetros)"
        logger.info(f"Ejecutando consulta {param_info}: {sql_template}")

        cursor.execute(sql_template, params or [])

        if needs_commit:
            conn.commit()

        try:
            rows = cursor.fetchall()
            columns = [col[0].lower() for col in cursor.description]
            result = [dict(zip(columns, row)) for row in rows]
        except oracledb.InterfaceError:
            # No results to fetch (e.g., INSERT or UPDATE)
            result = []

        logger.info(f"Filas obtenidas: {len(result)}")
        return json.dumps(result, default=str)

    except Exception as e:
        logger.error(f"❌ Error ejecutando la consulta: {str(e)}")
        raise
    finally:
        if conn:
            conn.close()
            logger.info("Conexión cerrada.")

# Ejemplo de uso
def main():
    query = "SELECT * FROM paises"
    result = execute_query_json(query)
    print(result)


# Ejecutar solo si es el script principal
if __name__ == "__main__":
    main()
