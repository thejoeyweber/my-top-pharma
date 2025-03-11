"""
Full SEC EDGAR Demo Flow

This script demonstrates the complete data pipeline from SEC EDGAR to 
MinIO S3 to PostgreSQL, showing the full functionality of the system.
"""

import os
import sys
import time
import logging
from datetime import datetime

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the required modules
from flows.sec_edgar.company_universe_flow import company_universe_flow
from utils.db_utils import execute_query, get_db_connection, check_table_exists
from utils.s3_client import list_objects, get_s3_client
import prefect_config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_infrastructure():
    """Check that all required infrastructure components are available"""
    logger.info("Checking infrastructure components...")
    
    # Display connection settings for debugging
    logger.info(f"Using database connection: {prefect_config.DB_HOST}:{prefect_config.DB_PORT}")
    logger.info(f"Database user: {prefect_config.DB_USER}")
    logger.info(f"Database name: {prefect_config.DB_NAME}")
    
    # Try connecting with psycopg2 directly
    import psycopg2
    try:
        logger.info("Attempting direct psycopg2 connection...")
        conn = psycopg2.connect(
            host=prefect_config.DB_HOST,
            port=prefect_config.DB_PORT,
            dbname=prefect_config.DB_NAME,
            user=prefect_config.DB_USER,
            password=prefect_config.DB_PASSWORD
        )
        with conn.cursor() as cur:
            cur.execute("SELECT version()")
            version = cur.fetchone()
            logger.info(f"✓ Direct PostgreSQL connection successful: {version[0]}")
        conn.close()
    except Exception as e:
        logger.error(f"✗ Direct PostgreSQL connection failed: {e}")
        logger.error("Troubleshooting tips:")
        logger.error("1. Verify the database container is running: docker ps | grep postgres")
        logger.error("2. Check that the password in prefect_config.py matches your docker-compose.yml")
        logger.error("3. Make sure the port is correct and not blocked")
        return False
    
    # Check PostgreSQL connection
    logger.info("Checking PostgreSQL connection using db_utils...")
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT version()")
                version = cur.fetchone()
                logger.info(f"✓ PostgreSQL connection successful: {version}")
        
        # Check required tables
        for table in ["sec_companies", "companies", "staging_sec_companies", "pipeline_run_logs"]:
            exists = check_table_exists(table)
            if exists:
                logger.info(f"✓ Table '{table}' exists")
            else:
                logger.warning(f"! Table '{table}' does not exist")
                # Only consider it a failure if sec_companies or companies don't exist
                if table in ["sec_companies", "companies"]:
                    return False
    except Exception as e:
        logger.error(f"✗ PostgreSQL connection failed: {e}")
        logger.error("Troubleshooting tips:")
        logger.error("1. Verify the database container is running: docker ps | grep postgres")
        logger.error("2. Check that the password in prefect_config.py matches your docker-compose.yml")
        logger.error("3. Make sure the port is correct and not blocked")
        return False
    
    # Check MinIO S3 connection
    logger.info("Checking MinIO S3 connection...")
    try:
        s3_client = get_s3_client()
        buckets = s3_client.list_buckets()
        logger.info(f"✓ MinIO S3 connection successful, found {len(buckets['Buckets'])} buckets")
        
        # Check for our data lake bucket
        bucket_exists = False
        for bucket in buckets['Buckets']:
            if bucket['Name'] == 'top-pharma-data-lake':
                bucket_exists = True
                logger.info("✓ Data lake bucket 'top-pharma-data-lake' exists")
                break
        
        if not bucket_exists:
            logger.warning("! Data lake bucket 'top-pharma-data-lake' not found, will be created during run")
    except Exception as e:
        logger.error(f"✗ MinIO S3 connection failed: {e}")
        logger.error("Troubleshooting tips:")
        logger.error("1. Verify the MinIO container is running: docker ps | grep minio")
        logger.error("2. Check that the MinIO connection settings in utils/s3_client.py are correct")
        logger.error("3. Make sure you can access the MinIO console at http://localhost:9001")
        return False
    
    logger.info("All infrastructure components available!")
    return True

def display_current_data_stats():
    """Display current statistics about our data"""
    logger.info("Current data statistics:")
    
    # Get counts from tables
    tables = {
        "sec_companies": "SEC companies",
        "companies": "Main companies",
        "pipeline_run_logs": "Pipeline runs"
    }
    
    for table, description in tables.items():
        try:
            results = execute_query(f"SELECT COUNT(*) as count FROM {table}")
            count = results[0]['count'] if results else 0
            logger.info(f"  - {description}: {count} records")
        except Exception as e:
            logger.error(f"Error querying {table}: {e}")
    
    # Get S3 statistics
    try:
        objects = list_objects("top-pharma-data-lake", "sec_edgar/")
        logger.info(f"  - S3 objects in sec_edgar prefix: {len(objects)}")
    except Exception as e:
        logger.error(f"Error listing S3 objects: {e}")

def run_demo():
    """Run the full demonstration of the SEC EDGAR pipeline"""
    logger.info("=" * 80)
    logger.info("Starting full SEC EDGAR pipeline demonstration")
    logger.info("=" * 80)
    
    # Step 1: Check infrastructure
    if not check_infrastructure():
        logger.error("Infrastructure check failed. Please fix the issues before continuing.")
        return False
    
    # Step 2: Display current data stats
    logger.info("\nInitial data state:")
    display_current_data_stats()
    
    # Step 3: Run the company universe flow
    logger.info("\nRunning SEC EDGAR company universe flow...")
    start_time = time.time()
    try:
        result = company_universe_flow()
        end_time = time.time()
        duration = end_time - start_time
        
        logger.info(f"Flow completed in {duration:.2f} seconds")
        logger.info(f"Results: {result}")
    except Exception as e:
        logger.error(f"Error running company universe flow: {e}")
        return False
    
    # Step 4: Display updated data stats
    logger.info("\nUpdated data state:")
    display_current_data_stats()
    
    # Step 5: Show sample data from the database
    logger.info("\nSample data from sec_companies table:")
    try:
        sample_data = execute_query("""
            SELECT id, cik, name, ticker, sic, sic_description 
            FROM sec_companies 
            LIMIT 5
        """)
        
        if sample_data:
            for row in sample_data:
                logger.info(f"  {row['name']} (CIK: {row['cik']}, Ticker: {row['ticker']}, SIC: {row['sic']})")
        else:
            logger.warning("No sample data found in sec_companies table")
    except Exception as e:
        logger.error(f"Error fetching sample data: {e}")
    
    # Step 6: Show pipeline run logs
    logger.info("\nRecent pipeline runs:")
    try:
        pipeline_runs = execute_query("""
            SELECT flow_name, run_id, start_time, end_time, status, records_processed
            FROM pipeline_run_logs
            ORDER BY start_time DESC
            LIMIT 5
        """)
        
        if pipeline_runs:
            for run in pipeline_runs:
                logger.info(f"  {run['flow_name']} - {run['start_time']} - Status: {run['status']} - Records: {run['records_processed']}")
        else:
            logger.warning("No pipeline runs found in the logs")
    except Exception as e:
        logger.error(f"Error fetching pipeline run logs: {e}")
    
    logger.info("\n" + "=" * 80)
    logger.info("Full SEC EDGAR pipeline demonstration completed")
    logger.info("=" * 80)
    return True

if __name__ == "__main__":
    run_demo() 