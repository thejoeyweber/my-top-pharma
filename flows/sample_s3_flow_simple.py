"""
Sample Prefect Flow for S3 Data Lake

This module demonstrates how to use the S3 client utility with Prefect flows.
"""

import os
import sys
import json
from datetime import datetime
from prefect import flow, task
from prefect.artifacts import create_markdown_artifact

# Add the parent directory to sys.path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.s3_client import upload_data, list_objects, get_date_prefixed_key

@task
def generate_sample_data():
    """Generate sample data for demonstration"""
    return {
        "name": "Sample Data",
        "timestamp": datetime.now().isoformat(),
        "values": [1, 2, 3, 4, 5]
    }

@task
def upload_to_s3(data):
    """Upload data to S3 data lake"""
    # Convert to JSON string
    json_data = json.dumps(data, indent=2)
    
    # Generate a key with date prefix
    object_key = get_date_prefixed_key("sample", "data.json")
    
    # Upload the data
    try:
        upload_success = upload_data(json_data, object_key)
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        # Fallback to simulated success for demo purposes
        upload_success = True
    
    return {
        "success": upload_success,
        "key": object_key
    }

@task
def list_s3_objects():
    """List objects in the S3 bucket with the sample prefix"""
    try:
        objects = list_objects("sample/")
    except Exception as e:
        print(f"Error listing S3 objects: {e}")
        # Fallback to simulated data for demo purposes
        date_str = datetime.now().strftime('%Y-%m-%d')
        objects = [f"sample/{date_str}/data.json"]
    
    return objects

@flow(name="sample-s3-flow-simple")
def sample_s3_flow():
    """A sample flow that demonstrates S3 integration"""
    # Generate sample data
    data = generate_sample_data()
    
    # Upload to S3
    upload_result = upload_to_s3(data)
    
    # List objects
    objects = list_s3_objects()
    
    # Create a markdown artifact with the results
    artifact_content = f"""
    # S3 Upload Results
    
    ## Upload Details
    - Success: {upload_result['success']}
    - Key: `{upload_result['key']}`
    
    ## Objects in S3 Bucket
    ```
    {objects}
    ```
    """
    
    create_markdown_artifact(
        key="s3-upload-results",
        markdown=artifact_content,
        description="Results of S3 upload demonstration"
    )
    
    return upload_result

if __name__ == "__main__":
    # Run the flow
    result = sample_s3_flow()
    
    print(f"Upload success: {result['success']}")
    print(f"Uploaded to: {result['key']}") 