import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Returns a connection to the PostgreSQL database."""
    return psycopg2.connect(
        dbname=os.environ.get('DB_NAME', 'toppharma'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASSWORD', 'password'),
        host=os.environ.get('DB_HOST', 'localhost'),
        port=os.environ.get('DB_PORT', 5432)
    )

def execute_query(query, params=None, fetch=True):
    """Execute a query and optionally return results."""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(query, params or ())
        if fetch:
            results = cursor.fetchall()
        else:
            results = None
        conn.commit()
        return results
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def insert_record(table, data):
    """Insert a record into a table."""
    columns = ', '.join(data.keys())
    placeholders = ', '.join(['%s'] * len(data))
    query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
    return execute_query(query, list(data.values()), fetch=False)

def update_record(table, data, condition):
    """Update a record in a table."""
    set_clause = ', '.join([f"{k} = %s" for k in data.keys()])
    where_clause = ' AND '.join([f"{k} = %s" for k in condition.keys()])
    query = f"UPDATE {table} SET {set_clause} WHERE {where_clause}"
    params = list(data.values()) + list(condition.values())
    return execute_query(query, params, fetch=False)

def upsert_record(table, data, unique_columns):
    """Insert a record or update if it exists (upsert)."""
    columns = ', '.join(data.keys())
    placeholders = ', '.join(['%s'] * len(data))
    
    conflict_targets = ', '.join(unique_columns)
    update_clause = ', '.join([f"{k} = EXCLUDED.{k}" for k in data.keys() if k not in unique_columns])
    
    query = f"""
    INSERT INTO {table} ({columns}) 
    VALUES ({placeholders})
    ON CONFLICT ({conflict_targets}) 
    DO UPDATE SET {update_clause}
    """
    return execute_query(query, list(data.values()), fetch=False)