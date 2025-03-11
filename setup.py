import os
import sys
import time
import subprocess

def run_command(command):
    """Run a shell command and return the output"""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return False
    print(result.stdout)
    return True

def wait_for_service(service_name, check_command, max_retries=10, retry_delay=2):
    """Wait for a service to be ready"""
    print(f"Waiting for {service_name} to be ready...")
    for i in range(max_retries):
        if run_command(check_command):
            print(f"{service_name} is ready!")
            return True
        print(f"Attempt {i+1}/{max_retries} - {service_name} not ready yet. Retrying in {retry_delay}s...")
        time.sleep(retry_delay)
    print(f"Timed out waiting for {service_name}")
    return False

def setup_environment():
    """Set up the development environment"""
    # Install required packages
    print("Installing required packages...")
    run_command("pip install prefect boto3 psycopg2-binary")
    
    # Wait for PostgreSQL to be ready
    wait_for_service(
        "PostgreSQL", 
        "python -c \"import psycopg2; conn = psycopg2.connect(dbname='toppharma', user='postgres', password='password', host='postgres', port=5432); print('Connected!'); conn.close()\""
    )
    
    # Wait for MinIO to be ready
    wait_for_service(
        "MinIO",
        "python -c \"import boto3; s3 = boto3.client('s3', endpoint_url='http://minio:9000', aws_access_key_id='minioadmin', aws_secret_access_key='minioadmin'); print(s3.list_buckets())\""
    )
    
    # Initialize the database
    print("Initializing database...")
    run_command("python scripts/init_db.py")
    
    # Test S3 connectivity
    print("Testing S3 connectivity...")
    run_command("python scripts/test_s3.py")
    
    # Register Prefect blocks
    print("Registering Prefect blocks...")
    run_command("python flows/blocks/s3_block.py")
    
    # Run sample flow
    print("Running sample flow...")
    run_command("python flows/sample_s3_flow_simple.py")
    
    print("\n=== Setup Complete ===")
    print("Your data infrastructure is ready to use.")
    print("Next steps:")
    print("1. Create your SEC EDGAR ingestion flow")
    print("2. Run and test the flow")
    print("3. Implement additional data source flows")

if __name__ == "__main__":
    setup_environment()