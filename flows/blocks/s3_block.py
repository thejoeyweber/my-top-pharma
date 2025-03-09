"""
Prefect S3 Block for Top Pharma

This module defines a Prefect S3 block for storing flow artifacts.
"""

import os
import sys
import boto3
from prefect.blocks.system import Secret
from prefect.blocks.storage import RemoteFileSystem

# Add the parent directory to sys.path to import prefect_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from prefect_config import S3_BUCKET_NAME, S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT_URL

def create_s3_block(block_name="top-pharma-s3"):
    """
    Create and register a Prefect RemoteFileSystem block for S3
    
    Args:
        block_name (str, optional): Name of the block. Defaults to "top-pharma-s3".
        
    Returns:
        RemoteFileSystem: The created RemoteFileSystem block
    """
    # Create the access key secret block if it doesn't exist
    try:
        access_key_secret = Secret.load("s3-access-key")
    except ValueError:
        access_key_secret = Secret(value=S3_ACCESS_KEY)
        access_key_secret.save("s3-access-key", overwrite=True)
    
    # Create the secret key secret block if it doesn't exist
    try:
        secret_key_secret = Secret.load("s3-secret-key")
    except ValueError:
        secret_key_secret = Secret(value=S3_SECRET_KEY)
        secret_key_secret.save("s3-secret-key", overwrite=True)
    
    # Create the RemoteFileSystem block
    remote_fs = RemoteFileSystem(
        base_path=f"s3://{S3_BUCKET_NAME}/prefect_flows",
        credentials={
            "access_key": S3_ACCESS_KEY,
            "secret_key": S3_SECRET_KEY,
            "endpoint_url": S3_ENDPOINT_URL if S3_ENDPOINT_URL else None
        }
    )
    
    # Save the block
    remote_fs.save(block_name, overwrite=True)
    
    return remote_fs

def get_s3_block(block_name="top-pharma-s3"):
    """
    Get a Prefect RemoteFileSystem block for S3 by name
    
    Args:
        block_name (str, optional): Name of the block. Defaults to "top-pharma-s3".
        
    Returns:
        RemoteFileSystem: The RemoteFileSystem block
    """
    try:
        return RemoteFileSystem.load(block_name)
    except ValueError:
        print(f"S3 block '{block_name}' not found. Creating it...")
        return create_s3_block(block_name)

if __name__ == "__main__":
    # Create the S3 block if run directly
    s3_block = create_s3_block()
    print(f"Created S3 block with base path: {s3_block.base_path}") 