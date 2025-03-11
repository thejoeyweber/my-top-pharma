"""
S3 Client Utilities for Top Pharma

This module provides utility functions for interacting with the MinIO S3 data lake.
"""

import os
import sys
import json
import logging
import datetime
import boto3
from botocore.exceptions import ClientError

# Add parent directory to path to allow imports from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import prefect_config

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_s3_client():
    """
    Get a boto3 S3 client configured for MinIO
    
    Returns:
        boto3.client: An S3 client for MinIO
    """
    return boto3.client(
        's3',
        endpoint_url=prefect_config.S3_ENDPOINT_URL,
        aws_access_key_id=prefect_config.S3_ACCESS_KEY,
        aws_secret_access_key=prefect_config.S3_SECRET_KEY,
        region_name='us-east-1',  # Placeholder region (MinIO doesn't require specific regions)
        config=boto3.session.Config(signature_version='s3v4')
    )

def ensure_bucket_exists(bucket_name=prefect_config.S3_BUCKET_NAME):
    """
    Ensure that the specified S3 bucket exists, creating it if necessary
    
    Args:
        bucket_name: Name of the S3 bucket
    
    Returns:
        bool: True if bucket exists or was created, False on error
    """
    s3_client = get_s3_client()
    
    try:
        # Check if bucket exists
        s3_client.head_bucket(Bucket=bucket_name)
        logger.info(f"Bucket {bucket_name} already exists")
        return True
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        
        # If bucket doesn't exist, create it
        if error_code == '404':
            try:
                s3_client.create_bucket(Bucket=bucket_name)
                logger.info(f"Created bucket {bucket_name}")
                return True
            except ClientError as create_error:
                logger.error(f"Failed to create bucket {bucket_name}: {create_error}")
                return False
        else:
            logger.error(f"Error checking bucket {bucket_name}: {e}")
            return False

def get_date_prefixed_key(base_path, file_name=None):
    """
    Generate a date-prefixed key for S3 objects
    
    Args:
        base_path: Base path for the object
        file_name: Optional file name to append
    
    Returns:
        str: S3 key with date prefix
    """
    today = datetime.datetime.now().strftime('%Y-%m-%d')
    key = f"{base_path}/{today}"
    
    if file_name:
        key = f"{key}/{file_name}"
    
    return key

def upload_json_to_s3(data, base_path, file_name, bucket_name=prefect_config.S3_BUCKET_NAME):
    """
    Upload JSON data to S3
    
    Args:
        data: Data to upload (dict or list)
        base_path: Base path in the bucket
        file_name: Name of the file
        bucket_name: Name of the S3 bucket
    
    Returns:
        str: S3 key where data was uploaded, or None on error
    """
    ensure_bucket_exists(bucket_name)
    s3_client = get_s3_client()
    
    # Generate key with date prefix
    key = get_date_prefixed_key(base_path, file_name)
    
    try:
        # Convert data to JSON
        json_data = json.dumps(data, default=str)
        
        # Upload to S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=key,
            Body=json_data,
            ContentType='application/json'
        )
        
        logger.info(f"Successfully uploaded data to s3://{bucket_name}/{key}")
        return key
    except Exception as e:
        logger.error(f"Error uploading to S3: {e}")
        return None

def download_json_from_s3(key, bucket_name=prefect_config.S3_BUCKET_NAME):
    """
    Download JSON data from S3
    
    Args:
        key: S3 key of the object
        bucket_name: Name of the S3 bucket
    
    Returns:
        dict or list: Parsed JSON data, or None on error
    """
    s3_client = get_s3_client()
    
    try:
        # Download from S3
        response = s3_client.get_object(Bucket=bucket_name, Key=key)
        json_data = response['Body'].read().decode('utf-8')
        
        # Parse JSON
        data = json.loads(json_data)
        
        logger.info(f"Successfully downloaded data from s3://{bucket_name}/{key}")
        return data
    except Exception as e:
        logger.error(f"Error downloading from S3: {e}")
        return None

def list_objects(prefix, bucket_name=prefect_config.S3_BUCKET_NAME):
    """
    List objects in an S3 bucket with the given prefix
    
    Args:
        prefix: Prefix to filter objects
        bucket_name: Name of the S3 bucket
    
    Returns:
        list: List of object keys
    """
    s3_client = get_s3_client()
    
    try:
        # List objects
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        
        # Extract keys
        keys = [obj['Key'] for obj in response.get('Contents', [])]
        
        logger.info(f"Found {len(keys)} objects with prefix {prefix} in bucket {bucket_name}")
        return keys
    except Exception as e:
        logger.error(f"Error listing objects in S3: {e}")
        return []

if __name__ == "__main__":
    # Test the S3 client
    test_data = {"test": "data", "timestamp": datetime.datetime.now().isoformat()}
    upload_json_to_s3(test_data, "test", "test_data.json")
    keys = list_objects("test")
    
    if keys:
        data = download_json_from_s3(keys[0])
        print(f"Downloaded data: {data}")