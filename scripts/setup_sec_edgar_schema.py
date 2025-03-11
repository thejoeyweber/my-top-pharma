"""
Setup SEC EDGAR Schema

This script executes the SEC EDGAR schema SQL file to create the necessary tables.
"""

import os
import sys
import psycopg2

# Add the parent directory to the path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def setup_sec_edgar_schema():
    """Execute the SEC EDGAR schema SQL file"""
    print("Setting up SEC EDGAR schema...")
    
    # Get the path to the schema file
    schema_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                              'db', 'sec_edgar_schema.sql')
    
    print(f"Using schema file: {schema_file}")
    
    # Read the schema file
    try:
        with open(schema_file, 'r') as f:
            schema_sql = f.read()
            print(f"Successfully read schema file ({len(schema_sql)} bytes)")
    except Exception as e:
        print(f"Error reading schema file: {e}")
        return False
    
    # Connect to the database directly
    try:
        print("Connecting to database at localhost:5432...")
        conn = psycopg2.connect(
            dbname='toppharma',
            user='postgres',
            password='password',
            host='localhost',
            port=5432
        )
        print("Connected to database successfully")
        
        # Execute the schema SQL
        with conn.cursor() as cur:
            print("Executing schema SQL...")
            cur.execute(schema_sql)
            print("Schema SQL executed successfully")
        
        conn.commit()
        print("Changes committed to database")
        conn.close()
        print("Database connection closed")
        
        print("SEC EDGAR schema setup complete!")
        return True
    except Exception as e:
        print(f"Error executing schema SQL: {e}")
        return False

if __name__ == "__main__":
    setup_sec_edgar_schema() 