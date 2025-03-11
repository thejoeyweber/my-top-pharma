"""
SEC EDGAR Filing Enrichment Flow

This flow enriches pharmaceutical company data by fetching and processing their
SEC EDGAR filings, particularly 10-K and 10-Q reports.
"""

import os
import sys
import uuid
import json
import time
from datetime import datetime
from io import BytesIO

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from prefect import flow, task
from utils.s3_client import upload_to_s3, get_date_prefixed_key
from utils.db_utils import execute_query, get_db_cursor, get_db_connection
from utils.sec_edgar_client import (
    get_company_submissions, 
    get_latest_10k_filing,
    get_filing_html,
    extract_financials_from_html
)

@task
def get_target_companies():
    """Get list of companies to fetch filings for"""
    print("Getting target companies for filing enrichment")
    query = """
    SELECT id, cik, name, ticker
    FROM sec_companies
    WHERE ticker IS NOT NULL AND ticker != ''
    ORDER BY updated_at
    LIMIT 20;  -- Process in batches to respect SEC rate limits
    """
    results = execute_query(query)
    companies = []
    for row in results:
        companies.append({
            "id": row['id'],
            "cik": row['cik'],
            "name": row['name'],
            "ticker": row['ticker']
        })
    
    print(f"Found {len(companies)} companies to process")
    return companies

@task
def fetch_latest_filings(company):
    """Fetch the latest filings for a company"""
    print(f"Fetching latest filings for {company['name']} ({company['ticker']})")
    
    # Get the latest 10-K filing
    filing = get_latest_10k_filing(company['ticker'])
    
    if not filing:
        print(f"No 10-K filing found for {company['ticker']}")
        return {"company": company, "filings": []}
    
    # Add company ID to the filing
    filing['company_id'] = company['id']
    
    # Add delay to respect SEC rate limits
    time.sleep(1)
    
    return {"company": company, "filings": [filing]}

@task
def extract_and_enrich_filings(company_filings):
    """Extract relevant data from filings"""
    company = company_filings["company"]
    filings = company_filings["filings"]
    
    if not filings:
        return company_filings
    
    print(f"Extracting data from {len(filings)} filings for {company['name']}")
    
    enriched_filings = []
    for filing in filings:
        # Extract HTML content
        try:
            html_content = get_filing_html(filing['accession_number'], filing['cik'])
            
            if html_content:
                # Extract financial information
                financials = extract_financials_from_html(html_content)
                filing['extracted_data'] = financials
                
                # Format the filing URL for display
                filing['filing_url'] = f"https://www.sec.gov/Archives/edgar/data/{filing['cik']}/{filing['accession_number']}/{filing['accession_number']}-index.html"
                
                enriched_filings.append(filing)
            else:
                print(f"Could not get HTML content for filing {filing['accession_number']}")
            
            # Add delay between filing extraction
            time.sleep(2)
        except Exception as e:
            print(f"Error extracting data from filing {filing['accession_number']}: {str(e)}")
    
    return {"company": company, "filings": enriched_filings}

@task
def save_filings_to_s3(company_filings, batch_id):
    """Save filing data to S3 data lake"""
    company = company_filings["company"]
    filings = company_filings["filings"]
    
    if not filings:
        return None
    
    print(f"Saving {len(filings)} filings for {company['name']} to S3")
    
    key = get_date_prefixed_key(f"sec_edgar/filings/{company['ticker']}/{batch_id}.json")
    
    # Convert to bytes for upload
    data_bytes = BytesIO(json.dumps(company_filings).encode('utf-8'))
    
    # Upload to S3
    s3_path = upload_to_s3(data_bytes, "top-pharma-data-lake", key)
    print(f"Saved filing data to S3: {s3_path}")
    return s3_path

@task
def load_filings_to_staging(company_filings, batch_id, s3_path):
    """Load filings to staging table"""
    company = company_filings["company"]
    filings = company_filings["filings"]
    
    if not filings:
        return 0
    
    print(f"Loading {len(filings)} filings for {company['name']} to staging")
    
    inserted_count = 0
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            for filing in filings:
                try:
                    cur.execute("""
                        INSERT INTO staging_sec_filings 
                        (accession_number, cik, filing_type, filing_date, 
                         filing_url, extracted_data, etl_batch_id)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (accession_number) DO NOTHING
                    """, (
                        filing['accession_number'],
                        filing['cik'],
                        filing['form_type'],
                        filing['filing_date'],
                        filing['filing_url'],
                        json.dumps(filing.get('extracted_data', {})),
                        batch_id
                    ))
                    inserted_count += 1
                except Exception as e:
                    print(f"Error inserting filing: {e}")
                    continue
        conn.commit()
    
    print(f"Loaded {inserted_count} filings to staging")
    return inserted_count

@task
def merge_into_filings():
    """Upsert from staging to main sec_filings table"""
    print("Merging staging data into sec_filings table")
    query = """
    INSERT INTO sec_filings (
        company_id, accession_number, filing_type, filing_date, 
        filing_url, extracted_data
    )
    SELECT 
        sc.id,
        sf.accession_number, 
        sf.filing_type, 
        sf.filing_date::date, 
        sf.filing_url, 
        sf.extracted_data::jsonb
    FROM staging_sec_filings sf
    JOIN sec_companies sc ON sf.cik = sc.cik
    ON CONFLICT (accession_number) 
    DO UPDATE SET
        filing_type = EXCLUDED.filing_type,
        filing_date = EXCLUDED.filing_date,
        filing_url = EXCLUDED.filing_url,
        extracted_data = EXCLUDED.extracted_data,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id;
    """
    results = execute_query(query)
    print(f"Merged {len(results) if results else 0} filings into sec_filings table")
    return len(results) if results else 0

@task
def update_companies_from_filings():
    """Update company information based on the latest filings"""
    print("Updating company information from filings")
    query = """
    WITH latest_filings AS (
        SELECT DISTINCT ON (company_id) 
            company_id,
            extracted_data
        FROM sec_filings
        ORDER BY company_id, filing_date DESC
    )
    UPDATE companies c
    SET 
        description = CASE 
            WHEN lf.extracted_data->>'business_description' IS NOT NULL 
            THEN lf.extracted_data->>'business_description' 
            ELSE c.description 
        END,
        headquarters_location = CASE 
            WHEN lf.extracted_data->>'headquarters' IS NOT NULL 
            THEN lf.extracted_data->>'headquarters' 
            ELSE c.headquarters_location 
        END,
        updated_at = CURRENT_TIMESTAMP
    FROM latest_filings lf
    JOIN sec_companies sc ON lf.company_id = sc.id
    WHERE c.ticker_symbol = sc.ticker
    AND (lf.extracted_data->>'business_description' IS NOT NULL OR lf.extracted_data->>'headquarters' IS NOT NULL)
    RETURNING c.company_id;
    """
    results = execute_query(query)
    print(f"Updated {len(results) if results else 0} companies with filing data")
    return len(results) if results else 0

@task
def log_pipeline_run(batch_id, companies_count, filings_count, status):
    """Log details of pipeline run to pipeline_run_logs table"""
    print(f"Logging pipeline run {batch_id}")
    query = """
    INSERT INTO pipeline_run_logs
    (flow_name, run_id, start_time, end_time, status, records_processed, metadata)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    execute_query(
        query,
        (
            "sec_edgar_filing_enrichment",
            batch_id,
            datetime.now() - datetime.timedelta(minutes=20),  # Approximate start time
            datetime.now(),
            status,
            filings_count,
            json.dumps({"companies_processed": companies_count})
        ),
        fetch=False
    )
    print("Pipeline run logged successfully")

@flow(name="SEC EDGAR Filing Enrichment Flow")
def filing_enrichment_flow():
    """Main flow to enrich companies with SEC EDGAR filing data"""
    batch_id = str(uuid.uuid4())
    print(f"Starting SEC EDGAR Filing Enrichment Flow with batch ID: {batch_id}")
    
    # Get companies to process
    companies = get_target_companies()
    
    all_filings_count = 0
    
    # Process each company
    for company in companies:
        # Fetch latest filings
        company_filings = fetch_latest_filings(company)
        filings_count = len(company_filings["filings"])
        
        if filings_count > 0:
            # Extract and enrich filings
            enriched_data = extract_and_enrich_filings(company_filings)
            
            # Save to S3
            s3_path = save_filings_to_s3(enriched_data, batch_id)
            
            if s3_path:
                # Load to staging
                staged_count = load_filings_to_staging(enriched_data, batch_id, s3_path)
                all_filings_count += staged_count
    
    # Merge into filing tables
    filings_count = merge_into_filings()
    print(f"Merged {filings_count} records into sec_filings table")
    
    # Update company information
    updated_companies = update_companies_from_filings()
    print(f"Updated {updated_companies} companies with filing data")
    
    # Log the pipeline run
    log_pipeline_run(batch_id, len(companies), all_filings_count, "SUCCESS")
    
    print(f"SEC EDGAR Filing Enrichment Flow complete")
    print(f"Companies processed: {len(companies)}")
    print(f"Filings found: {all_filings_count}")
    print(f"Filings processed: {filings_count}")
    print(f"Companies updated: {updated_companies}")
    
    return {
        "batch_id": batch_id,
        "companies_processed": len(companies),
        "filings_found": all_filings_count,
        "filings_processed": filings_count,
        "companies_updated": updated_companies
    }

if __name__ == "__main__":
    # Make sure required tables exist
    try:
        execute_query("""
            SELECT 1 FROM sec_filings LIMIT 1;
        """)
    except Exception as e:
        print("Error checking for sec_filings table. Make sure to run the sec_edgar_schema.sql file first.")
        print(f"Error: {e}")
        sys.exit(1)
    
    # Run the flow
    filing_enrichment_flow() 