"""
Deploy Company Universe Flow

This script builds and deploys the SEC EDGAR Company Universe Flow as a Prefect deployment.
It registers the flow with the Prefect server for scheduling and management.
"""

import os
import sys
from datetime import timedelta

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prefect.server.schemas.schedules import CronSchedule
from flows.sec_edgar.company_universe_flow import company_universe_flow

print("Deploying SEC EDGAR Company Universe Flow...")

# Create a deployment using the newer flow.serve() method
deployment = company_universe_flow.serve(
    name="SEC EDGAR Company Universe",
    version="1.0.0",
    description="Retrieves all pharmaceutical companies from SEC EDGAR by SIC code",
    schedule=CronSchedule(cron="0 1 * * *", timezone="UTC"),  # Run at 1 AM UTC daily
    tags=["sec_edgar", "company_universe", "pharmaceutical"],
    work_queue_name="default",
    parameters={}
)

print("Deployment created successfully!")
print("\nTo run this deployment manually, execute:")
print("prefect deployment run 'SEC EDGAR Company Universe Flow/SEC EDGAR Company Universe'")
print("\nTo start an agent to process this deployment:")
print("prefect agent start -q default") 