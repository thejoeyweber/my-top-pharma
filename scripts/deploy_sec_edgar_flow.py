"""
Deploy SEC EDGAR Flow

This script creates a deployment for the SEC EDGAR ingestion flow.
"""

import os
import sys
from prefect.server.schemas.schedules import CronSchedule

# Add the parent directory to sys.path to import flows
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from flows.sec_edgar_flow import sec_edgar_flow

def create_deployment():
    """Create a deployment for the SEC EDGAR flow using the Prefect 3.0 API"""
    print("Creating deployment for SEC EDGAR flow...")
    
    # Create the deployment using flow.serve() for Prefect 3.0
    deployment = sec_edgar_flow.serve(
        name="sec-edgar-daily",
        version="1",
        tags=["sec", "edgar", "pharma"],
        description="Daily SEC EDGAR ingestion for pharmaceutical companies",
        schedule=CronSchedule(cron="0 1 * * *"),
        parameters={
            "tickers": ["PFE", "JNJ", "MRK", "ABBV", "LLY"]  # Start with a subset
        }
    )
    
    print(f"Deployment 'sec-edgar-daily' created successfully")
    return deployment

if __name__ == "__main__":
    create_deployment() 