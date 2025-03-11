"""
Check and Setup Schema

This script checks if the required database tables exist and creates them if they don't.
It's a helpful utility for ensuring the database is properly set up.
"""

import os
import sys
import psycopg2
import logging

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import prefect_config for database settings
import prefect_config
from utils.db_utils import check_table_exists, execute_query

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def read_sql_file(file_path):
    """Read the contents of a SQL file"""
    try:
        with open(file_path, 'r') as f:
            return f.read()
    except Exception as e:
        logger.error(f"Error reading SQL file {file_path}: {e}")
        return None

def check_and_setup_schema():
    """Check if required tables exist and create them if needed"""
    logger.info("Checking if required database tables exist...")
    
    # Check database connection
    try:
        logger.info(f"Connecting to PostgreSQL at {prefect_config.DB_HOST}:{prefect_config.DB_PORT} as {prefect_config.DB_USER}...")
        conn = psycopg2.connect(
            host=prefect_config.DB_HOST,
            port=prefect_config.DB_PORT,
            dbname=prefect_config.DB_NAME,
            user=prefect_config.DB_USER,
            password=prefect_config.DB_PASSWORD
        )
        logger.info("✓ Database connection successful")
        conn.close()
    except Exception as e:
        logger.error(f"✗ Database connection failed: {e}")
        logger.error("\nTroubleshooting PostgreSQL connection issues:")
        logger.error("1. Verify Docker containers are running:")
        logger.error("   docker ps | findstr postgres")
        logger.error("2. Make sure prefect_config.py has host='localhost', not 'postgres'")
        logger.error("3. Verify the database port mapping in docker-compose.yml (should be 5432:5432)")
        logger.error("4. Check the database name and credentials in prefect_config.py")
        logger.error("\nConnection attempted with:")
        logger.error(f"  Host: {prefect_config.DB_HOST}")
        logger.error(f"  Port: {prefect_config.DB_PORT}")
        logger.error(f"  Database: {prefect_config.DB_NAME}")
        logger.error(f"  User: {prefect_config.DB_USER}")
        logger.error(f"  Password: {'*' * len(prefect_config.DB_PASSWORD)}")
        logger.error("\nTry connecting manually with:")
        logger.error(f"  docker exec -it mytoppharma-postgres-1 psql -U {prefect_config.DB_USER} -d {prefect_config.DB_NAME}")
        return False
    
    # Check if required tables exist
    required_tables = [
        "companies",
        "sec_companies",
        "staging_sec_companies",
        "sec_filings",
        "staging_sec_filings",
        "pipeline_run_logs"
    ]
    
    missing_tables = []
    for table in required_tables:
        if not check_table_exists(table):
            logger.warning(f"! Table '{table}' does not exist")
            missing_tables.append(table)
        else:
            logger.info(f"✓ Table '{table}' exists")
    
    # If any tables are missing, run the schema creation scripts
    if missing_tables:
        logger.info(f"Found {len(missing_tables)} missing tables. Setting up schema...")
        
        # Path to SQL schema files
        schema_files = [
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'db', 'schema.sql'),
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'db', 'sec_edgar_schema.sql')
        ]
        
        # Execute each schema file
        for file_path in schema_files:
            logger.info(f"Running schema file: {file_path}")
            
            if not os.path.exists(file_path):
                logger.error(f"✗ Schema file not found: {file_path}")
                logger.error(f"Check if file exists at {file_path}")
                continue
                
            sql = read_sql_file(file_path)
            if not sql:
                continue
                
            try:
                # Connect directly to run the schema (which might contain multiple statements)
                conn = psycopg2.connect(
                    host=prefect_config.DB_HOST,
                    port=prefect_config.DB_PORT,
                    dbname=prefect_config.DB_NAME,
                    user=prefect_config.DB_USER,
                    password=prefect_config.DB_PASSWORD
                )
                conn.autocommit = True
                with conn.cursor() as cur:
                    cur.execute(sql)
                conn.close()
                logger.info(f"✓ Successfully executed schema file: {file_path}")
            except Exception as e:
                logger.error(f"✗ Error executing schema file: {e}")
                return False
        
        # Verify tables were created
        still_missing = []
        for table in missing_tables:
            if not check_table_exists(table):
                logger.error(f"✗ Table '{table}' still does not exist after schema creation")
                still_missing.append(table)
            else:
                logger.info(f"✓ Table '{table}' was created successfully")
        
        if still_missing:
            logger.error(f"❌ Failed to create {len(still_missing)} tables: {', '.join(still_missing)}")
            return False
        else:
            logger.info("✅ All required tables have been created successfully")
    else:
        logger.info("✅ All required tables already exist")
    
    return True

if __name__ == "__main__":
    success = check_and_setup_schema()
    if success:
        logger.info("Schema check and setup completed successfully")
        sys.exit(0)
    else:
        logger.error("Schema check and setup failed")
        logger.error("Try running this command to check if the Docker PostgreSQL container can be accessed:")
        logger.error("docker exec -it mytoppharma-postgres-1 psql -U postgres -d toppharma -c '\\dt'")
        sys.exit(1) 