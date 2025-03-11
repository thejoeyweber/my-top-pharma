import os
import sys

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db_client import get_db_connection, execute_query

def test_database_connection():
    """Test the database connection and display schema information"""
    try:
        print("Testing PostgreSQL connection...")
        conn = get_db_connection()
        
        # Print connection info
        print(f"Connected to PostgreSQL at {conn.info.host}:{conn.info.port}")
        print(f"Database: {conn.info.dbname}, User: {conn.info.user}")
        
        # List tables
        print("\nListing tables:")
        tables = execute_query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        if tables:
            for table in tables:
                print(f"- {table['table_name']}")
            
            # Check for specific tables we expect
            expected_tables = [
                'companies', 'products', 'therapeutic_areas', 
                'company_external_ids', 'product_external_ids', 
                'pipeline_run_logs'
            ]
            found_tables = [table['table_name'] for table in tables]
            
            for table in expected_tables:
                if table in found_tables:
                    print(f"✅ Found expected table: {table}")
                else:
                    print(f"❌ Missing expected table: {table}")
        else:
            print("No tables found in the database.")
        
        conn.close()
        return True
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return False

if __name__ == "__main__":
    test_database_connection() 