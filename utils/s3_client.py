"""
S3 Client Utility for Top Pharma

This module provides utility functions for interacting with S3/MinIO.
It uses the configuration from prefect_config.py.
"""

import os
import boto3
from botocore.exceptions import ClientError
import logging
from datetime import datetime
import sys

# Add the parent directory to sys.path to import prefect_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from prefect_config import S3_BUCKET_NAME, S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT_URL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_s3_client():
    """
    Create and return an S3 client using the configuration from prefect_config.py.
    
    Returns:
        boto3.client: An S3 client
    """
    # If S3_ENDPOINT_URL is provided, use it (for MinIO)
    # Otherwise, use AWS S3
    if S3_ENDPOINT_URL:
        s3_client = boto3.client(
            's3',
            endpoint_url=S3_ENDPOINT_URL,
            aws_access_key_id=S3_ACCESS_KEY,
            aws_secret_access_key=S3_SECRET_KEY,
            # For MinIO, we need to disable these checks
            config=boto3.session.Config(
                signature_version='s3v4',
                s3={'addressing_style': 'path'}
            )
        )
    else:
        # AWS S3
        s3_client = boto3.client(
            's3',
            aws_access_key_id=S3_ACCESS_KEY,
            aws_secret_access_key=S3_SECRET_KEY
        )
    
    return s3_client

def upload_file(file_path, object_name=None, bucket_name=None):
    """
    Upload a file to an S3 bucket
    
    Args:
        file_path (str): Path to the file to upload
        object_name (str, optional): S3 object name. If not specified, file_name is used
        bucket_name (str, optional): Bucket name. If not specified, S3_BUCKET_NAME is used
        
    Returns:
        bool: True if file was uploaded, else False
    """
    # If S3 object name was not specified, use file name
    if object_name is None:
        object_name = os.path.basename(file_path)
    
    # If bucket name was not specified, use default
    if bucket_name is None:
        bucket_name = S3_BUCKET_NAME
    
    # Get the S3 client
    s3_client = get_s3_client()
    
    try:
        s3_client.upload_file(file_path, bucket_name, object_name)
        logger.info(f"Uploaded {file_path} to {bucket_name}/{object_name}")
        return True
    except ClientError as e:
        logger.error(f"Error uploading file {file_path}: {e}")
        return False

def upload_data(data, object_name, bucket_name=None):
    """
    Upload data to an S3 bucket
    
    Args:
        data (bytes or str): Data to upload
        object_name (str): S3 object name
        bucket_name (str, optional): Bucket name. If not specified, S3_BUCKET_NAME is used
        
    Returns:
        bool: True if data was uploaded, else False
    """
    # If bucket name was not specified, use default
    if bucket_name is None:
        bucket_name = S3_BUCKET_NAME
    
    # Get the S3 client
    s3_client = get_s3_client()
    
    try:
        # Convert string to bytes if necessary
        if isinstance(data, str):
            data = data.encode('utf-8')
        
        s3_client.put_object(Body=data, Bucket=bucket_name, Key=object_name)
        logger.info(f"Uploaded data to {bucket_name}/{object_name}")
        return True
    except ClientError as e:
        logger.error(f"Error uploading data to {object_name}: {e}")
        return False

def download_file(object_name, file_path, bucket_name=None):
    """
    Download a file from an S3 bucket
    
    Args:
        object_name (str): S3 object name
        file_path (str): Path to save the file
        bucket_name (str, optional): Bucket name. If not specified, S3_BUCKET_NAME is used
        
    Returns:
        bool: True if file was downloaded, else False
    """
    # If bucket name was not specified, use default
    if bucket_name is None:
        bucket_name = S3_BUCKET_NAME
    
    # Get the S3 client
    s3_client = get_s3_client()
    
    try:
        s3_client.download_file(bucket_name, object_name, file_path)
        logger.info(f"Downloaded {bucket_name}/{object_name} to {file_path}")
        return True
    except ClientError as e:
        logger.error(f"Error downloading file {object_name}: {e}")
        return False

def list_objects(prefix='', bucket_name=None):
    """
    List objects in an S3 bucket
    
    Args:
        prefix (str, optional): Prefix to filter objects
        bucket_name (str, optional): Bucket name. If not specified, S3_BUCKET_NAME is used
        
    Returns:
        list: List of object keys
    """
    # If bucket name was not specified, use default
    if bucket_name is None:
        bucket_name = S3_BUCKET_NAME
    
    # Get the S3 client
    s3_client = get_s3_client()
    
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        
        # If there are no objects, return an empty list
        if 'Contents' not in response:
            return []
        
        # Return the list of object keys
        return [obj['Key'] for obj in response['Contents']]
    except ClientError as e:
        logger.error(f"Error listing objects with prefix {prefix}: {e}")
        return []

def get_date_prefixed_key(base_path, file_name):
    """
    Generate a key with date prefix for organizing data by date
    
    Args:
        base_path (str): Base path for the key
        file_name (str): File name
        
    Returns:
        str: Key with date prefix
    """
    # Get current date in YYYY-MM-DD format
    date_str = datetime.now().strftime('%Y-%m-%d')
    
    # Ensure base_path doesn't have trailing slash
    if base_path.endswith('/'):
        base_path = base_path[:-1]
    
    # Return key with date prefix
    return f"{base_path}/{date_str}/{file_name}" 