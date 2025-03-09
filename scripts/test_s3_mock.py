"""
Test S3 Connectivity with Mock S3

This script tests the S3 client utility using a mock S3 implementation,
which is useful when Docker/MinIO is not available.
"""

import os
import sys
import json
import logging
import tempfile
from datetime import datetime
from unittest.mock import MagicMock, patch

# Add the parent directory to sys.path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a mock storage for our "S3" objects
mock_s3_storage = {}

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

def mock_upload_data(data, object_key, bucket_name=None):
    """Mock implementation of upload_data"""
    logger.info(f"[MOCK] Uploading data to {bucket_name}/{object_key}")
    
    # Store the data in our mock storage
    mock_s3_storage[object_key] = data
    
    return True

def mock_list_objects(prefix='', bucket_name=None):
    """Mock implementation of list_objects"""
    logger.info(f"[MOCK] Listing objects with prefix {prefix}")
    
    # Return keys that match the prefix
    return [key for key in mock_s3_storage.keys() if key.startswith(prefix)]

def mock_download_file(object_key, file_path, bucket_name=None):
    """Mock implementation of download_file"""
    logger.info(f"[MOCK] Downloading {bucket_name}/{object_key} to {file_path}")
    
    # Check if the key exists
    if object_key not in mock_s3_storage:
        logger.error(f"[MOCK] Object {object_key} not found")
        return False
    
    # Write the data to the file
    with open(file_path, 'wb') as f:
        if isinstance(mock_s3_storage[object_key], str):
            f.write(mock_s3_storage[object_key].encode('utf-8'))
        else:
            f.write(mock_s3_storage[object_key])
    
    return True

def test_s3_connectivity_mock():
    """Test S3 connectivity using mock functions"""
    
    # Create a sample data dictionary
    sample_data = {
        "name": "Test Data",
        "timestamp": datetime.now().isoformat(),
        "values": [1, 2, 3, 4, 5]
    }
    
    # Convert to JSON string
    json_data = json.dumps(sample_data, indent=2)
    
    # Generate a key with date prefix
    object_key = get_date_prefixed_key("test", "sample_data.json")
    
    logger.info(f"Testing S3 connectivity with mock implementation")
    
    # Upload the data
    upload_success = mock_upload_data(json_data, object_key)
    if not upload_success:
        logger.error("Failed to upload test data")
        return False
    
    # List objects with the test prefix
    objects = mock_list_objects("test/")
    logger.info(f"Objects in mock storage with prefix 'test/': {objects}")
    
    # Check if our object is in the list
    if object_key not in objects:
        logger.error(f"Uploaded object {object_key} not found in mock storage")
        return False
    
    # Create a temporary file for download
    with tempfile.NamedTemporaryFile(delete=False, suffix='.json') as tmp:
        download_path = tmp.name
    
    # Download the file
    download_success = mock_download_file(object_key, download_path)
    if not download_success:
        logger.error("Failed to download test data")
        return False
    
    # Verify the downloaded file
    try:
        with open(download_path, 'r') as f:
            downloaded_data = json.load(f)
        
        logger.info(f"Downloaded data: {downloaded_data}")
        
        # Clean up
        os.remove(download_path)
        logger.info(f"Removed temporary file: {download_path}")
        
        return True
    except Exception as e:
        logger.error(f"Error verifying downloaded file: {e}")
        return False

if __name__ == "__main__":
    success = test_s3_connectivity_mock()
    if success:
        logger.info("Mock S3 connectivity test passed!")
        sys.exit(0)
    else:
        logger.error("Mock S3 connectivity test failed!")
        sys.exit(1) 