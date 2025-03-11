import os
import sys

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db_client import execute_query

def check_table_structure(table_name):
    """Check the structure of a table"""
    print(f"Checking structure of {table_name}...")
    
    # Query to get column information
    query = """
    SELECT column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_name = %s
    ORDER BY ordinal_position
    """
    
    columns = execute_query(query, params=(table_name,))
    
    if not columns:
        print(f"Table {table_name} not found or has no columns!")
        return
    
    print(f"\nStructure of {table_name}:")
    print("-" * 50)
    for col in columns:
        col_type = col['data_type']
        if col['character_maximum_length']:
            col_type += f"({col['character_maximum_length']})"
        print(f"{col['column_name']}: {col_type}")
    print("-" * 50)

def list_all_tables():
    """List all tables in the database"""
    print("Listing all tables in the database...")
    
    query = """
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
    """
    
    tables = execute_query(query)
    
    if not tables:
        print("No tables found in the database!")
        return []
    
    table_names = [t['table_name'] for t in tables]
    
    print("\nTables in the database:")
    print("-" * 30)
    for table in table_names:
        print(table)
    print("-" * 30)
    
    return table_names

if __name__ == "__main__":
    tables = list_all_tables()
    
    if len(sys.argv) > 1:
        # Check structure of specified table
        check_table_structure(sys.argv[1])
    else:
        # Check pipeline_run_logs by default
        check_table_structure("pipeline_run_logs") 