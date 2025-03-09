"""
Test S3 Connectivity

This script tests the S3 client utility by uploading a sample file,
listing objects in the bucket, and downloading the file.
"""

import os
import sys
import json
import logging
from datetime import datetime

# Add the parent directory to sys.path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.s3_client import upload_data, list_objects, download_file, get_date_prefixed_key
from prefect_config import S3_BUCKET_NAME

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_s3_connectivity():
    """Test S3 connectivity by uploading, listing, and downloading a sample file"""
    
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
    
    logger.info(f"Testing S3 connectivity with bucket: {S3_BUCKET_NAME}")
    
    # Upload the data
    upload_success = upload_data(json_data, object_key)
    if not upload_success:
        logger.error("Failed to upload test data")
        return False
    
    # List objects with the test prefix
    objects = list_objects("test/")
    logger.info(f"Objects in bucket with prefix 'test/': {objects}")
    
    # Check if our object is in the list
    if object_key not in objects:
        logger.error(f"Uploaded object {object_key} not found in bucket")
        return False
    
    # Download the file
    download_path = os.path.join(os.path.dirname(__file__), "downloaded_sample.json")
    download_success = download_file(object_key, download_path)
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
    success = test_s3_connectivity()
    if success:
        logger.info("S3 connectivity test passed!")
        sys.exit(0)
    else:
        logger.error("S3 connectivity test failed!")
        sys.exit(1) 