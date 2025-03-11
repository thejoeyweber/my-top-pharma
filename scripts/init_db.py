import os
import sys
import psycopg2

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db_client import get_db_connection

def initialize_database():
    """Initialize the database with schema"""
    conn = None
    try:
        print("Connecting to PostgreSQL...")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Read the schema SQL file
        print("Reading schema file...")
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db', 'schema.sql'), 'r') as f:
            schema_sql = f.read()
        
        # Execute the schema SQL
        print("Executing schema SQL...")
        cursor.execute(schema_sql)
        conn.commit()
        
        print("Database initialized successfully!")
        return True
    except Exception as e:
        print(f"Error initializing database: {e}")
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    initialize_database()