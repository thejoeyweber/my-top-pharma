"""
Check Database Connection

This script tests database connectivity in multiple ways to help diagnose issues.
It will attempt to connect using psycopg2 directly and our utility functions.
"""

import os
import sys
import psycopg2
import logging
import subprocess

# Add parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import prefect_config
from utils.db_utils import get_db_connection, execute_query, check_table_exists

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_docker_container():
    """Check if the PostgreSQL Docker container is running"""
    logger.info("Checking if PostgreSQL Docker container is running...")
    
    try:
        # Run docker ps command to check for postgres container
        result = subprocess.run(
            ["docker", "ps", "--filter", "name=mytoppharma-postgres", "--format", "{{.Names}} ({{.Status}})"],
            capture_output=True,
            text=True,
            check=True
        )
        
        if result.stdout.strip():
            logger.info(f"✓ PostgreSQL container found: {result.stdout.strip()}")
            return True
        else:
            logger.error("✗ PostgreSQL container not found")
            logger.error("Please start the containers with: docker-compose up -d")
            return False
    except subprocess.CalledProcessError as e:
        logger.error(f"✗ Error checking Docker containers: {e}")
        logger.error(f"Command output: {e.stderr}")
        return False
    except Exception as e:
        logger.error(f"✗ Unexpected error checking Docker containers: {e}")
        return False

def test_docker_exec_psql():
    """Test connecting to PostgreSQL using docker exec"""
    logger.info("Testing connection via docker exec...")
    
    try:
        # Try to connect to PostgreSQL using docker exec
        cmd = [
            "docker", "exec", 
            "mytoppharma-postgres-1", 
            "psql", 
            "-U", prefect_config.DB_USER, 
            "-d", prefect_config.DB_NAME, 
            "-c", "SELECT version()"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        if "PostgreSQL" in result.stdout:
            logger.info(f"✓ Successfully connected via docker exec")
            logger.info(f"  {result.stdout.splitlines()[2].strip()}")
            return True
        else:
            logger.error("✗ Connection via docker exec failed")
            logger.error(f"Output: {result.stdout}")
            return False
    except subprocess.CalledProcessError as e:
        logger.error(f"✗ Error connecting via docker exec: {e}")
        logger.error(f"Command output: {e.stderr}")
        return False
    except Exception as e:
        logger.error(f"✗ Unexpected error with docker exec: {e}")
        return False

def test_direct_psycopg2():
    """Test connecting to PostgreSQL using psycopg2 directly"""
    logger.info(f"Testing direct psycopg2 connection to {prefect_config.DB_HOST}:{prefect_config.DB_PORT}...")
    
    try:
        # Connect directly with psycopg2
        conn = psycopg2.connect(
            host=prefect_config.DB_HOST,
            port=prefect_config.DB_PORT,
            dbname=prefect_config.DB_NAME,
            user=prefect_config.DB_USER,
            password=prefect_config.DB_PASSWORD
        )
        
        # Get PostgreSQL version
        with conn.cursor() as cur:
            cur.execute("SELECT version()")
            version = cur.fetchone()[0]
        
        conn.close()
        
        logger.info(f"✓ Successfully connected directly with psycopg2")
        logger.info(f"  {version.split(',')[0]}")
        return True
    except Exception as e:
        logger.error(f"✗ Direct psycopg2 connection failed: {e}")
        return False

def test_utility_functions():
    """Test connecting to PostgreSQL using our utility functions"""
    logger.info("Testing connection using utility functions...")
    
    try:
        # Test get_db_connection
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT version()")
                version = cur.fetchone()
                logger.info(f"✓ get_db_connection successful")
        
        # Test execute_query
        results = execute_query("SELECT version()")
        if results and results[0]:
            logger.info(f"✓ execute_query successful")
        
        # Test check_table_exists
        for table in ["companies", "sec_companies"]:
            exists = check_table_exists(table)
            logger.info(f"✓ Table '{table}' exists: {exists}")
        
        return True
    except Exception as e:
        logger.error(f"✗ Utility functions connection failed: {e}")
        return False

def run_all_checks():
    """Run all connection checks"""
    logger.info("=" * 60)
    logger.info("Running PostgreSQL connection diagnostics")
    logger.info("=" * 60)
    
    logger.info(f"Database settings:")
    logger.info(f"  Host: {prefect_config.DB_HOST}")
    logger.info(f"  Port: {prefect_config.DB_PORT}")
    logger.info(f"  Database: {prefect_config.DB_NAME}")
    logger.info(f"  User: {prefect_config.DB_USER}")
    logger.info(f"  Password: {'*' * len(prefect_config.DB_PASSWORD)}")
    logger.info("-" * 60)
    
    # Run all checks
    checks = [
        ("Docker container check", check_docker_container),
        ("Docker exec psql check", test_docker_exec_psql),
        ("Direct psycopg2 check", test_direct_psycopg2),
        ("Utility functions check", test_utility_functions)
    ]
    
    results = []
    for name, check_func in checks:
        logger.info("\n" + "-" * 60)
        logger.info(f"Running check: {name}")
        try:
            success = check_func()
            results.append((name, success))
        except Exception as e:
            logger.error(f"Check failed with unexpected error: {e}")
            results.append((name, False))
    
    # Summary
    logger.info("\n" + "=" * 60)
    logger.info("Connection Check Results:")
    logger.info("-" * 60)
    
    all_passed = True
    for name, success in results:
        status = "✓ PASS" if success else "✗ FAIL"
        logger.info(f"{status} | {name}")
        if not success:
            all_passed = False
    
    logger.info("=" * 60)
    if all_passed:
        logger.info("✅ All connection checks passed!")
        logger.info("You should be able to run scripts that access the database.")
    else:
        logger.info("❌ Some connection checks failed.")
        logger.info("Review the logs above for specific errors and troubleshooting steps.")
    logger.info("=" * 60)
    
    return all_passed

if __name__ == "__main__":
    success = run_all_checks()
    sys.exit(0 if success else 1) 