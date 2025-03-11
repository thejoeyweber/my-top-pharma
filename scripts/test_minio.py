import os
import sys
import json
from datetime import datetime

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.s3_client import get_s3_client, get_date_prefixed_key

def test_minio_connection():
    """Test MinIO/S3 connection and basic operations"""
    try:
        print("Testing MinIO/S3 connection...")
        
        # Create S3 client
        s3_client = get_s3_client()
        
        # Get or create bucket
        bucket_name = os.environ.get('S3_BUCKET_NAME', 'top-pharma-data-lake')
        
        # List buckets
        buckets = s3_client.list_buckets()
        bucket_exists = False
        
        print("Existing buckets:")
        for bucket in buckets['Buckets']:
            print(f"- {bucket['Name']}")
            if bucket['Name'] == bucket_name:
                bucket_exists = True
        
        # Create bucket if it doesn't exist
        if not bucket_exists:
            print(f"Creating bucket: {bucket_name}")
            s3_client.create_bucket(Bucket=bucket_name)
            print(f"✅ Bucket {bucket_name} created")
        else:
            print(f"✅ Bucket {bucket_name} already exists")
        
        # Create test file
        test_data = {
            "test": True,
            "timestamp": datetime.now().isoformat(),
            "message": "Hello from MinIO test!"
        }
        
        # Upload test file
        test_key = get_date_prefixed_key('test', 'test_file.json')
        print(f"Uploading test file to s3://{bucket_name}/{test_key}")
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=test_key,
            Body=json.dumps(test_data, indent=2)
        )
        print(f"✅ Successfully uploaded test file")
        
        # Download test file
        print(f"Downloading test file from s3://{bucket_name}/{test_key}")
        response = s3_client.get_object(Bucket=bucket_name, Key=test_key)
        downloaded_data = json.loads(response['Body'].read().decode('utf-8'))
        
        print(f"✅ Successfully downloaded test file")
        print(f"Test file contents: {downloaded_data}")
        
        return True
    except Exception as e:
        print(f"Error testing MinIO connection: {e}")
        return False

if __name__ == "__main__":
    test_minio_connection() 