import os
import sys

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db_client import get_db_connection

def run_sql_file(file_path):
    """Run a SQL file against the database"""
    print(f"Running SQL file: {file_path}")
    
    # Read SQL file
    with open(file_path, 'r') as f:
        sql = f.read()
    
    # Connect to database
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Execute SQL
        cursor.execute(sql)
        conn.commit()
        print("✅ SQL executed successfully")
        return True
    except Exception as e:
        conn.rollback()
        print(f"❌ Error executing SQL: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_sql.py <sql_file>")
        sys.exit(1)
    
    sql_file = sys.argv[1]
    run_sql_file(sql_file) 