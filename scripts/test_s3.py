import os
import sys
import json
from io import BytesIO

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.s3_client import get_s3_client, upload_to_s3, download_from_s3, list_objects, get_date_prefixed_key

def test_s3_connectivity():
    """Test S3 connectivity and basic operations"""
    bucket_name = os.environ.get('S3_BUCKET_NAME', 'top-pharma-data-lake')
    
    try:
        print(f"Testing S3 connectivity with bucket: {bucket_name}")
        
        # Generate test data
        test_data = {
            "test": True,
            "message": "Hello from S3 test",
            "timestamp": "2025-03-09T12:00:00Z"
        }
        
        # Convert to bytes for upload
        data_bytes = BytesIO(json.dumps(test_data).encode('utf-8'))
        
        # Generate a key with date prefix
        key = get_date_prefixed_key('test', 'sample_data.json')
        
        # Upload test data
        print(f"Uploading test data to {bucket_name}/{key}")
        upload_to_s3(data_bytes, bucket_name, key)
        
        # List objects to verify upload
        print(f"Listing objects in {bucket_name} with prefix 'test/'")
        objects = list_objects(bucket_name, 'test/')
        print(f"Found objects: {objects}")
        
        # Download the uploaded file
        download_path = os.path.join(os.path.dirname(__file__), 'downloaded_sample.json')
        print(f"Downloading {key} to {download_path}")
        download_from_s3(bucket_name, key, download_path)
        
        # Verify the downloaded content
        with open(download_path, 'r') as f:
            downloaded_data = json.load(f)
        
        assert downloaded_data == test_data, "Downloaded data doesn't match uploaded data"
        
        # Clean up
        print(f"Removing temporary downloaded file: {download_path}")
        os.remove(download_path)
        
        print("S3 connectivity test passed!")
        return True
    except Exception as e:
        print(f"S3 connectivity test failed: {e}")
        return False

if __name__ == "__main__":
    test_s3_connectivity()