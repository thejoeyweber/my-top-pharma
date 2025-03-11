import os
import sys
import json
import requests
from datetime import datetime
from io import BytesIO

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prefect import flow, task
from utils.s3_client import get_s3_client, upload_to_s3, get_date_prefixed_key
from utils.db_client import execute_query, insert_record, upsert_record

@task
def fetch_sec_filings(tickers):
    """Fetch SEC EDGAR filings for a list of tickers"""
    filings = []
    
    for ticker in tickers:
        print(f"Fetching SEC data for {ticker}")
        
        # This is a simplified example - in a real application, you would
        # use the SEC EDGAR API or a scraper to get real data
        # For this example, we'll just create dummy data
        filing = {
            "ticker": ticker,
            "company_name": f"{ticker} Corp",
            "cik": f"000{ticker}",
            "filing_date": datetime.now().strftime('%Y-%m-%d'),
            "fiscal_year_end": "2024-12-31",
            "headquarters": f"{ticker} Headquarters",
            "revenue": 1000000000,
            "net_income": 100000000
        }
        
        filings.append(filing)
    
    return filings

@task
def store_raw_filings(filings):
    """Store raw filing data in S3"""
    bucket = os.environ.get('S3_BUCKET_NAME', 'top-pharma-data-lake')
    s3_paths = []
    
    for filing in filings:
        # Generate a key with date prefix
        key = get_date_prefixed_key(f"sec_edgar/{filing['ticker']}", f"{filing['ticker']}_10K.json")
        
        # Convert to bytes for upload
        data_bytes = BytesIO(json.dumps(filing).encode('utf-8'))
        
        # Upload to S3
        s3_path = upload_to_s3(data_bytes, bucket, key)
        s3_paths.append(s3_path)
        
        # Update the filing with the S3 path
        filing['raw_data_path'] = s3_path
    
    return filings

@task
def transform_sec_edgar_data(filings):
    """Transform SEC EDGAR data"""
    for filing in filings:
        # Clean company name (remove Inc., Corp, etc.)
        if "company_name" in filing:
            filing["company_name"] = filing["company_name"].replace(" Inc.", "").replace(" Corp", "")
        
        # Convert revenue and net_income to float
        if "revenue" in filing:
            filing["revenue"] = float(filing["revenue"])
        
        if "net_income" in filing:
            filing["net_income"] = float(filing["net_income"])
    
    return filings

@task
def load_to_staging(filings):
    """Load filings into staging_sec_edgar table"""
    for filing in filings:
        # Insert into staging_sec_edgar
        insert_record('staging_sec_edgar', {
            'ticker_symbol': filing['ticker'],
            'company_name': filing['company_name'],
            'filing_date': filing['filing_date'],
            'cik': filing['cik'],
            'fiscal_year_end': filing['fiscal_year_end'],
            'headquarters': filing['headquarters'],
            'revenue': filing['revenue'],
            'net_income': filing['net_income'],
            'raw_data_path': filing['raw_data_path']
        })
    
    return filings

@task
def upsert_to_companies(filings):
    """Upsert filings into companies table"""
    successful_count = 0
    failed_count = 0
    
    for filing in filings:
        try:
            # Check if company exists by ticker
            company = execute_query(
                "SELECT company_id FROM companies WHERE ticker_symbol = %s",
                [filing['ticker']]
            )
            
            if company:
                # Update existing company
                update_record = {
                    'name': filing['company_name'],
                    'headquarters': filing['headquarters'],
                    'updated_at': datetime.now()
                }
                
                upsert_record('companies', update_record, ['ticker_symbol'])
                
                # Also update the company ID in the staging table
                execute_query(
                    "UPDATE staging_sec_edgar SET processed_at = %s WHERE ticker_symbol = %s",
                    [datetime.now(), filing['ticker']]
                )
                
                successful_count += 1
            else:
                # Insert new company
                insert_record('companies', {
                    'name': filing['company_name'],
                    'ticker_symbol': filing['ticker'],
                    'headquarters': filing['headquarters'],
                    'created_at': datetime.now(),
                    'updated_at': datetime.now()
                })
                
                # Update the staging table
                execute_query(
                    "UPDATE staging_sec_edgar SET processed_at = %s WHERE ticker_symbol = %s",
                    [datetime.now(), filing['ticker']]
                )
                
                successful_count += 1
        except Exception as e:
            print(f"Error upserting {filing['ticker']}: {e}")
            failed_count += 1
    
    return {
        'successful': successful_count,
        'failed': failed_count
    }

@task
def log_pipeline_run(flow_name, status, stats):
    """Log pipeline run to pipeline_run_logs table"""
    insert_record('pipeline_run_logs', {
        'flow_name': flow_name,
        'run_id': f"{flow_name}-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        'start_time': datetime.now(),
        'end_time': datetime.now(),
        'status': status,
        'records_processed': stats['successful'] + stats['failed'],
        'records_succeeded': stats['successful'],
        'records_failed': stats['failed']
    })

@flow
def sec_edgar_flow(tickers=None):
    """SEC EDGAR ingestion flow"""
    if tickers is None:
        # Default to some pharma tickers if none provided
        tickers = ['PFE', 'JNJ', 'MRK', 'ABBV', 'BMY']
    
    # Fetch filings from SEC EDGAR
    filings = fetch_sec_filings(tickers)
    
    # Store raw filings in S3
    filings_with_paths = store_raw_filings(filings)
    
    # Transform the data
    transformed_filings = transform_sec_edgar_data(filings_with_paths)
    
    # Load into staging table
    loaded_filings = load_to_staging(transformed_filings)
    
    # Upsert to companies table
    stats = upsert_to_companies(loaded_filings)
    
    # Log the pipeline run
    log_pipeline_run('sec_edgar_flow', 'SUCCESS', stats)
    
    print(f"SEC EDGAR ingestion complete. Processed {len(filings)} filings.")
    print(f"Successful: {stats['successful']}, Failed: {stats['failed']}")
    
    return stats

if __name__ == "__main__":
    sec_edgar_flow()