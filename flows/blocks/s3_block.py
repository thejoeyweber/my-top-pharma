"""
S3 integration for Prefect workflows.
"""

import os
import boto3
import json
from datetime import datetime

def test_s3_connection():
    """
    Test S3 connection without requiring Prefect server.
    
    This is a standalone test that doesn't depend on Prefect infrastructure.
    """
    try:
        print("Testing S3 connection...")
        
        # Create S3 client
        s3_client = boto3.client(
            's3',
            endpoint_url=os.environ.get("S3_ENDPOINT_URL", "http://localhost:9000"),
            aws_access_key_id=os.environ.get("S3_ACCESS_KEY", "minioadmin"),
            aws_secret_access_key=os.environ.get("S3_SECRET_KEY", "minioadmin")
        )
        
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
            "prefect_test": True,
            "timestamp": datetime.now().isoformat(),
            "message": "Hello from S3 test!"
        }
        
        # Upload to S3
        test_key = f"test/{datetime.now().strftime('%Y-%m-%d')}/prefect_test.json"
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=test_key,
            Body=json.dumps(test_data, indent=2)
        )
        
        print(f"✅ Successfully uploaded test file to s3://{bucket_name}/{test_key}")
        return True
    except Exception as e:
        print(f"❌ Error testing S3 connection: {e}")
        return False

if __name__ == "__main__":
    # Skip Prefect for now and just test S3 connection
    test_s3_connection()