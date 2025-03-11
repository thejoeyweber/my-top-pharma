"""
Hello Prefect Flow

A simple test flow to verify that Prefect is properly configured.
This flow demonstrates basic Prefect functionality including tasks, parameters, 
logging, and error handling.
"""

import os
import sys
import json
from datetime import datetime

# Add parent directory to path to allow imports from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prefect import flow, task, get_run_logger
import prefect_config
from utils.db_client import execute_query
from utils.s3_client import get_s3_client, get_date_prefixed_key

@task(name="hello_task", log_prints=True)
def say_hello(name: str) -> str:
    """A simple task that prints and returns a greeting."""
    logger = get_run_logger()
    greeting = f"Hello, {name}! Current time is {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    logger.info(greeting)
    print(greeting)  # This will also show up in the Prefect UI with log_prints=True
    return greeting

@task(name="log_environment", log_prints=True)
def log_environment() -> dict:
    """Log information about the current environment."""
    logger = get_run_logger()
    
    env_info = {
        "prefect_api_url": prefect_config.PREFECT_API_URL,
        "max_concurrent_tasks": prefect_config.MAX_CONCURRENT_TASKS,
        "db_host": prefect_config.DB_HOST,
        "s3_bucket": prefect_config.S3_BUCKET_NAME,
        "python_version": sys.version,
    }
    
    logger.info(f"Running in environment: {env_info}")
    print(f"Environment details: {env_info}")
    return env_info

@task
def test_database_connection():
    """Test database connection and return the result"""
    try:
        print("Testing database connection from Prefect task...")
        tables = execute_query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        print(f"Found {len(tables)} tables in the database")
        return True
    except Exception as e:
        print(f"Database connection error: {e}")
        return False

@task
def test_s3_connection():
    """Test S3 connection and return the result"""
    try:
        print("Testing S3 connection from Prefect task...")
        s3_client = get_s3_client()
        buckets = s3_client.list_buckets()
        print(f"Found {len(buckets['Buckets'])} buckets in S3")
        
        # Create test data
        test_data = {
            "prefect_test": True,
            "timestamp": datetime.now().isoformat(),
            "message": "Hello from Prefect!"
        }
        
        # Upload to S3
        bucket_name = os.environ.get('S3_BUCKET_NAME', 'top-pharma-data-lake')
        test_key = get_date_prefixed_key('prefect_test', 'hello_prefect.json')
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=test_key,
            Body=json.dumps(test_data, indent=2)
        )
        
        print(f"Successfully uploaded test file to s3://{bucket_name}/{test_key}")
        return True
    except Exception as e:
        print(f"S3 connection error: {e}")
        return False

@flow(name="hello-world-flow")
def hello_world_flow():
    """A simple flow that tests all our infrastructure connections"""
    print("Hello from Prefect! 👋")
    print("Testing infrastructure connections...")
    
    db_result = test_database_connection()
    s3_result = test_s3_connection()
    
    if db_result and s3_result:
        print("✅ All infrastructure tests passed!")
        # Log a successful run to the database
        try:
            execute_query(
                """
                INSERT INTO pipeline_run_logs 
                (flow_name, run_date, status, records_processed, error_count) 
                VALUES (%s, %s, %s, %s, %s)
                """,
                params=("hello-world-flow", datetime.now(), "SUCCESS", 1, 0),
                fetch=False
            )
            print("✅ Successfully logged flow run to database")
        except Exception as e:
            print(f"Failed to log flow run: {e}")
    else:
        print("❌ Some infrastructure tests failed.")
    
    return {"db_connected": db_result, "s3_connected": s3_result}

if __name__ == "__main__":
    # This allows the flow to be run directly from the command line
    hello_world_flow() 