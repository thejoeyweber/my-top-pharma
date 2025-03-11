"""
Test S3 Connection

This script tests the connection to the MinIO S3 server using the correct endpoint URL.
"""

import os
import sys
import boto3
import logging

# Add parent directory to path to allow imports from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import prefect_config

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_s3_connection():
    """Test connection to MinIO S3 server"""
    
    # Print the endpoint URL for verification
    print(f"Using S3 endpoint URL: {prefect_config.S3_ENDPOINT_URL}")
    
    # Create a direct boto3 client with the endpoint URL from prefect_config
    s3_client = boto3.client(
        's3',
        endpoint_url=prefect_config.S3_ENDPOINT_URL,
        aws_access_key_id=prefect_config.S3_ACCESS_KEY,
        aws_secret_access_key=prefect_config.S3_SECRET_KEY,
        region_name='us-east-1',  # Placeholder region (MinIO doesn't require specific regions)
        config=boto3.session.Config(signature_version='s3v4')
    )
    
    try:
        # List buckets to test connection
        response = s3_client.list_buckets()
        buckets = [bucket['Name'] for bucket in response['Buckets']]
        print(f"Successfully connected to S3. Buckets: {buckets}")
        
        # Try to ensure our bucket exists
        bucket_name = prefect_config.S3_BUCKET_NAME
        if bucket_name not in buckets:
            print(f"Creating bucket: {bucket_name}")
            s3_client.create_bucket(Bucket=bucket_name)
            print(f"Bucket {bucket_name} created successfully")
        else:
            print(f"Bucket {bucket_name} already exists")
            
        return True
    except Exception as e:
        print(f"Error connecting to S3: {e}")
        return False

if __name__ == "__main__":
    test_s3_connection() 