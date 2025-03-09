"""
Hello Prefect Flow

A simple test flow to verify that Prefect is properly configured.
This flow demonstrates basic Prefect functionality including tasks, parameters, 
logging, and error handling.
"""

import os
import sys
import logging
from datetime import datetime

# Add parent directory to path to allow imports from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prefect import flow, task, get_run_logger
import prefect_config

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

@flow(name="hello_prefect")
def hello_prefect(name: str = "Top Pharma") -> None:
    """
    A simple flow that demonstrates Prefect functionality.
    
    Args:
        name: The name to include in the greeting
    """
    logger = get_run_logger()
    logger.info(f"Starting hello_prefect flow with parameter name={name}")
    
    # Run tasks
    env_info = log_environment()
    greeting = say_hello(name)
    
    logger.info(f"Completed hello_prefect flow successfully")
    print(f"Flow completed with greeting: {greeting}")
    
if __name__ == "__main__":
    # This allows the flow to be run directly from the command line
    hello_prefect() 