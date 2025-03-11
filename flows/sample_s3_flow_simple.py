"""
Sample S3 Flow - Simple demonstration of S3 and database integration.

This flow demonstrates how to use S3 and the PostgreSQL database 
in a Prefect flow without requiring a running Prefect server.
"""

import os
import sys
import json
from datetime import datetime

# Add parent directory to Python path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db_client import execute_query, get_db_connection
from utils.s3_client import get_s3_client, get_date_prefixed_key

def fetch_sample_sec_edgar_data():
    """
    Simulates fetching data from SEC EDGAR API.
    
    In a real implementation, this would make API calls to fetch actual SEC filings.
    For demonstration, we'll return a simulated dataset.
    """
    print("Fetching sample SEC EDGAR data...")
    
    # Simulate data from SEC EDGAR
    return [
        {
            "cik": "0000078003",
            "ticker": "PFE",
            "company_name": "PFIZER INC",
            "form_type": "10-K",
            "filing_date": "2025-02-20",
            "reporting_date": "2024-12-31",
            "fiscal_year": 2024,
            "headquarters": "New York, NY",
            "revenue_millions": 43162.0,
            "net_income_millions": 5978.0,
            "assets_millions": 181465.0,
            "liabilities_millions": 114460.0
        },
        {
            "cik": "0001800132",
            "ticker": "MRNA",
            "company_name": "Moderna, Inc.",
            "form_type": "10-K",
            "filing_date": "2025-02-12",
            "reporting_date": "2024-12-31",
            "fiscal_year": 2024,
            "headquarters": "Cambridge, MA",
            "revenue_millions": 7211.0,
            "net_income_millions": 1346.0,
            "assets_millions": 21867.0,
            "liabilities_millions": 6473.0
        },
        {
            "cik": "0000014272",
            "ticker": "BMY",
            "company_name": "BRISTOL-MYERS SQUIBB CO",
            "form_type": "10-K",
            "filing_date": "2025-02-10",
            "reporting_date": "2024-12-31",
            "fiscal_year": 2024,
            "headquarters": "New York, NY",
            "revenue_millions": 45216.0,
            "net_income_millions": 5070.0,
            "assets_millions": 108920.0,
            "liabilities_millions": 62489.0
        }
    ]

def save_to_s3(data):
    """
    Saves SEC EDGAR data to S3.
    """
    print("Saving data to S3...")
    
    s3_client = get_s3_client()
    bucket_name = os.environ.get('S3_BUCKET_NAME', 'top-pharma-data-lake')
    
    # Create JSON file with data
    json_data = json.dumps(data, indent=2)
    
    # Create a key with date prefix
    key = get_date_prefixed_key('sec_edgar', 'sample_filings.json')
    
    # Upload to S3
    s3_client.put_object(
        Bucket=bucket_name,
        Key=key,
        Body=json_data
    )
    
    print(f"✅ Data saved to s3://{bucket_name}/{key}")
    return key

def load_to_staging_table(data):
    """
    Loads SEC EDGAR data to staging table.
    """
    print("Loading data to staging_sec_edgar table...")
    
    # Clear the staging table first (in production you might not want to do this)
    execute_query("TRUNCATE TABLE staging_sec_edgar", fetch=False)
    
    # Insert each record
    for record in data:
        execute_query(
            """
            INSERT INTO staging_sec_edgar (
                cik, ticker_symbol, company_name, form_type, filing_date, reporting_date,
                fiscal_year, headquarters, revenue, net_income,
                assets_millions, liabilities_millions
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            params=(
                record["cik"],
                record["ticker"],
                record["company_name"],
                record["form_type"],
                record["filing_date"],
                record["reporting_date"],
                record["fiscal_year"],
                record["headquarters"],
                record["revenue_millions"],
                record["net_income_millions"],
                record["assets_millions"],
                record["liabilities_millions"]
            ),
            fetch=False
        )
    
    print(f"✅ Loaded {len(data)} records to staging_sec_edgar table")
    
    # Count the records to verify
    count = execute_query("SELECT COUNT(*) as count FROM staging_sec_edgar")[0]['count']
    print(f"✅ Verified {count} records in staging_sec_edgar")
    
    return len(data)

def upsert_to_companies(data):
    """
    Upserts data from staging to companies table.
    """
    print("Upserting data from staging_sec_edgar to companies table...")
    
    # First, let's update ticker_symbol in the staging table to match ticker
    execute_query(
        """
        UPDATE staging_sec_edgar 
        SET ticker_symbol = ticker 
        WHERE ticker_symbol IS NULL AND ticker IS NOT NULL
        """,
        fetch=False
    )
    
    # Now upsert data from staging to companies
    execute_query(
        """
        INSERT INTO companies (
            name, ticker_symbol, description, headquarters
        )
        SELECT 
            company_name, 
            ticker_symbol, 
            'Data from SEC EDGAR ' || form_type || ' filing for fiscal year ' || fiscal_year,
            headquarters
        FROM staging_sec_edgar
        WHERE ticker_symbol IS NOT NULL
        ON CONFLICT (ticker_symbol) 
        DO UPDATE SET
            name = EXCLUDED.name,
            headquarters = EXCLUDED.headquarters,
            description = EXCLUDED.description
        """,
        fetch=False
    )
    
    # Count the inserted/updated records
    count = execute_query("SELECT COUNT(*) as count FROM companies")[0]['count']
    print(f"✅ Now have {count} records in companies table")
    
    return count

def log_pipeline_run(success, record_count, error_count=0):
    """
    Logs the pipeline run (simplified to avoid schema issues).
    """
    print("Logging pipeline run...")
    
    try:
        # Just print the log info for now
        print(f"Pipeline run: flow_name=sample_sec_edgar_flow, status={'SUCCESS' if success else 'FAILED'}, records={record_count}, errors={error_count}")
        print("✅ Pipeline run logged (to console only)")
        return True
    except Exception as e:
        print(f"❌ Failed to log pipeline run: {e}")
        return False

def sample_sec_edgar_flow():
    """
    Simple flow to demonstrate S3 and database integration.
    """
    try:
        print("Starting sample SEC EDGAR flow...")
        
        # Fetch data
        data = fetch_sample_sec_edgar_data()
        
        # Save to S3
        s3_key = save_to_s3(data)
        
        # Load to staging table
        record_count = load_to_staging_table(data)
        
        # Upsert to companies table
        company_count = upsert_to_companies(data)
        
        # Log the pipeline run
        log_pipeline_run(True, record_count)
        
        print("\n✅ Sample SEC EDGAR flow completed successfully!")
        print(f"Processed {record_count} SEC filings")
        print(f"Saved to S3: {s3_key}")
        print(f"Final companies table count: {company_count}")
        
        return True
    except Exception as e:
        print(f"❌ Flow failed: {e}")
        
        # Log the failure
        try:
            log_pipeline_run(False, 0, 1)
        except Exception as log_error:
            print(f"❌ Failed to log pipeline run: {log_error}")
        
        return False

if __name__ == "__main__":
    """Run the flow when script is executed directly."""
    sample_sec_edgar_flow()