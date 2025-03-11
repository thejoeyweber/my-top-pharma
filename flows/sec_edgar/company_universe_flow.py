"""
SEC EDGAR Company Universe Flow

This module defines a Prefect flow to maintain a universe of pharmaceutical
and biotech companies by querying the SEC EDGAR API.
"""

import os
import sys
import datetime
import json
import logging
from typing import List, Dict, Any
import traceback

# Add parent directory to path for imports
parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(parent_dir)

try:
    from prefect import flow, task
    from prefect.task_runners import SequentialTaskRunner
except ImportError:
    # Mock Prefect decorators for testing without Prefect
    def flow(func=None, **kwargs):
        if func is None:
            return lambda f: f
        return func
    
    def task(func=None, **kwargs):
        if func is None:
            return lambda f: f
        return func
    
    class SequentialTaskRunner:
        pass

# Import project modules
from api_clients.sec_edgar_client import get_companies_by_sic, PHARMA_SIC_CODES
from utils.s3_client import upload_json_to_s3, get_date_prefixed_key
from utils.db_utils import execute_query, get_db_connection, check_table_exists

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@task(name="fetch_pharma_companies", retries=3, retry_delay_seconds=60)
def fetch_pharma_companies() -> List[Dict[str, Any]]:
    """
    Fetch pharmaceutical and biotech companies from SEC EDGAR
    
    Returns:
        List of dictionaries containing company data
    """
    logger.info("Fetching pharmaceutical companies from SEC EDGAR")
    
    # Get companies from SEC EDGAR API
    companies = get_companies_by_sic(PHARMA_SIC_CODES)
    
    logger.info(f"Retrieved {len(companies)} pharmaceutical companies")
    return companies

@task(name="store_in_data_lake")
def store_in_data_lake(companies: List[Dict[str, Any]]) -> str:
    """
    Store company data in the S3 data lake
    
    Args:
        companies: List of company data dictionaries
    
    Returns:
        S3 key where data was stored
    """
    logger.info("Storing company data in S3 data lake")
    
    # Generate a filename with timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"pharma_companies_{timestamp}.json"
    
    # Upload to S3
    s3_key = upload_json_to_s3(
        data=companies,
        base_path="sec_edgar/companies",
        file_name=filename
    )
    
    logger.info(f"Stored company data at S3 key: {s3_key}")
    return s3_key

@task(name="load_to_staging")
def load_to_staging(companies: List[Dict[str, Any]]) -> int:
    """
    Load company data to the staging table
    
    Args:
        companies: List of company data dictionaries
    
    Returns:
        Number of companies inserted
    """
    logger.info("Loading company data to staging table")
    
    # Ensure staging table exists
    create_staging_table_query = """
    CREATE TABLE IF NOT EXISTS staging_sec_companies (
        id SERIAL PRIMARY KEY,
        cik VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        ticker VARCHAR(10),
        sic VARCHAR(10),
        sic_description TEXT,
        exchange VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        processed BOOLEAN DEFAULT FALSE
    );
    """
    execute_query(create_staging_table_query, commit=True, fetch=False)
    
    # Clear staging table first
    execute_query("TRUNCATE TABLE staging_sec_companies;", commit=True, fetch=False)
    
    # Insert companies into staging table
    count = 0
    for company in companies:
        insert_query = """
        INSERT INTO staging_sec_companies (cik, name, ticker, sic, sic_description, exchange)
        VALUES (%(cik)s, %(name)s, %(ticker)s, %(sic)s, %(sic_description)s, %(exchange)s)
        """
        
        try:
            execute_query(insert_query, params=company, commit=True, fetch=False)
            count += 1
        except Exception as e:
            logger.error(f"Error inserting company {company.get('name')}: {e}")
    
    logger.info(f"Loaded {count} companies to staging table")
    return count

@task(name="upsert_to_sec_companies")
def upsert_to_sec_companies() -> int:
    """
    Upsert from staging table to sec_companies
    
    Returns:
        Number of companies upserted
    """
    logger.info("Upserting from staging to sec_companies table")
    
    # Ensure sec_companies table exists
    create_table_query = """
    CREATE TABLE IF NOT EXISTS sec_companies (
        id SERIAL PRIMARY KEY,
        cik VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        sic VARCHAR(10),
        sic_description TEXT,
        ticker VARCHAR(10),
        exchange VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    execute_query(create_table_query, commit=True, fetch=False)
    
    # Upsert from staging to sec_companies
    upsert_query = """
    INSERT INTO sec_companies (cik, name, sic, sic_description, ticker, exchange, updated_at)
    SELECT cik, name, sic, sic_description, ticker, exchange, NOW()
    FROM staging_sec_companies
    ON CONFLICT (cik) DO UPDATE SET
        name = EXCLUDED.name,
        sic = EXCLUDED.sic,
        sic_description = EXCLUDED.sic_description,
        ticker = EXCLUDED.ticker,
        exchange = EXCLUDED.exchange,
        updated_at = NOW();
    """
    execute_query(upsert_query, commit=True, fetch=False)
    
    # Get count of companies
    count_result = execute_query("SELECT COUNT(*) FROM sec_companies;")
    count = count_result[0]['count'] if count_result else 0
    
    # Mark staging records as processed
    execute_query("UPDATE staging_sec_companies SET processed = TRUE;", commit=True, fetch=False)
    
    logger.info(f"Upserted data to sec_companies table, now contains {count} companies")
    return count

@task(name="upsert_to_main_companies")
def upsert_to_main_companies() -> int:
    """
    Upsert from sec_companies to main companies table
    
    Returns:
        Number of companies upserted
    """
    logger.info("Upserting from sec_companies to main companies table")
    
    # Ensure companies table exists
    create_table_query = """
    CREATE TABLE IF NOT EXISTS companies (
        company_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        ticker_symbol VARCHAR(10),
        headquarters VARCHAR(255),
        description TEXT,
        website_url VARCHAR(255),
        logo_url VARCHAR(255),
        ownership_type VARCHAR(50),
        founded_year INTEGER,
        employee_count INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    execute_query(create_table_query, commit=True, fetch=False)
    
    # Create index on ticker_symbol if it doesn't exist
    create_index_query = """
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'companies' AND indexname = 'idx_companies_ticker_symbol'
        ) THEN
            CREATE INDEX idx_companies_ticker_symbol ON companies(ticker_symbol);
        END IF;
    END
    $$;
    """
    execute_query(create_index_query, commit=True, fetch=False)
    
    # Upsert from sec_companies to companies
    upsert_query = """
    INSERT INTO companies (name, ticker_symbol, updated_at)
    SELECT name, ticker, NOW()
    FROM sec_companies
    WHERE ticker IS NOT NULL
    ON CONFLICT (company_id) DO NOTHING;
    """
    
    # First check if the ticker_symbol column has a unique constraint
    cursor_query = """
    SELECT c.conname, c.contype
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    JOIN pg_class cl ON cl.oid = c.conrelid
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
    WHERE n.nspname = 'public'
    AND cl.relname = 'companies'
    AND a.attname = 'ticker_symbol'
    AND c.contype = 'u';
    """
    
    constraints = execute_query(cursor_query)
    
    if constraints:
        # If ticker_symbol has a unique constraint, use that for upserting
        upsert_query = """
        INSERT INTO companies (name, ticker_symbol, updated_at)
        SELECT name, ticker, NOW()
        FROM sec_companies
        WHERE ticker IS NOT NULL
        ON CONFLICT (ticker_symbol) DO UPDATE SET
            name = EXCLUDED.name,
            updated_at = NOW();
        """
    else:
        # Otherwise, use a more complex upsert based on ticker matching
        upsert_query = """
        WITH to_update AS (
            SELECT c.company_id, s.name, s.ticker
            FROM companies c
            JOIN sec_companies s ON c.ticker_symbol = s.ticker
            WHERE s.ticker IS NOT NULL
        )
        UPDATE companies c
        SET name = u.name, 
            updated_at = NOW()
        FROM to_update u
        WHERE c.company_id = u.company_id;
        
        INSERT INTO companies (name, ticker_symbol)
        SELECT s.name, s.ticker
        FROM sec_companies s
        LEFT JOIN companies c ON c.ticker_symbol = s.ticker
        WHERE s.ticker IS NOT NULL AND c.company_id IS NULL;
        """
    
    execute_query(upsert_query, commit=True, fetch=False)
    
    # Get count of companies
    count_result = execute_query("SELECT COUNT(*) FROM companies;")
    count = count_result[0]['count'] if count_result else 0
    
    logger.info(f"Upserted data to companies table, now contains {count} companies")
    return count

@task(name="log_pipeline_run")
def log_pipeline_run(companies_count: int, success: bool = True, error_message: str = None) -> None:
    """
    Log the pipeline run in the pipeline_run_logs table
    
    Args:
        companies_count: Number of companies processed
        success: Whether the pipeline run was successful
        error_message: Error message if the pipeline run failed
    """
    logger.info("Logging pipeline run")
    
    # Ensure pipeline_run_logs table exists
    create_table_query = """
    CREATE TABLE IF NOT EXISTS pipeline_run_logs (
        id SERIAL PRIMARY KEY,
        pipeline_name VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL,
        start_time TIMESTAMP WITH TIME ZONE,
        end_time TIMESTAMP WITH TIME ZONE,
        records_processed INTEGER,
        records_succeeded INTEGER,
        records_failed INTEGER,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    execute_query(create_table_query, commit=True, fetch=False)
    
    # Insert log entry
    log_query = """
    INSERT INTO pipeline_run_logs (
        pipeline_name, status, start_time, end_time, 
        records_processed, records_succeeded, records_failed, details
    ) VALUES (
        'sec_edgar_company_universe',
        %(status)s,
        %(start_time)s,
        %(end_time)s,
        %(records_processed)s,
        %(records_succeeded)s,
        %(records_failed)s,
        %(details)s
    );
    """
    
    start_time = datetime.datetime.now() - datetime.timedelta(minutes=5)  # Approximate start time
    end_time = datetime.datetime.now()
    
    params = {
        'status': 'SUCCESS' if success else 'FAILED',
        'start_time': start_time,
        'end_time': end_time,
        'records_processed': companies_count,
        'records_succeeded': companies_count if success else 0,
        'records_failed': 0 if success else companies_count,
        'details': json.dumps({
            'message': 'Successfully updated company universe from SEC EDGAR' if success else error_message,
            'duration_seconds': (end_time - start_time).total_seconds()
        })
    }
    
    execute_query(log_query, params=params, commit=True, fetch=False)
    logger.info("Pipeline run logged")

@flow(name="SEC EDGAR Company Universe", task_runner=SequentialTaskRunner())
def company_universe_flow():
    """
    Prefect flow to maintain a universe of pharmaceutical companies
    """
    try:
        # Step 1: Fetch pharma companies from SEC EDGAR
        companies = fetch_pharma_companies()
        
        # Step 2: Store raw data in S3 data lake
        s3_key = store_in_data_lake(companies)
        
        # Step 3: Load to staging table
        staging_count = load_to_staging(companies)
        
        # Step 4: Upsert to sec_companies table
        sec_companies_count = upsert_to_sec_companies()
        
        # Step 5: Upsert to main companies table
        companies_count = upsert_to_main_companies()
        
        # Step 6: Log successful pipeline run
        log_pipeline_run(companies_count)
        
        logger.info(f"Company universe flow completed successfully")
        logger.info(f"Processed {len(companies)} companies")
        logger.info(f"Raw data stored at {s3_key}")
        logger.info(f"Updated sec_companies table with {sec_companies_count} companies")
        logger.info(f"Updated main companies table with {companies_count} companies")
        
        return {
            "companies_processed": len(companies),
            "s3_key": s3_key,
            "sec_companies_count": sec_companies_count,
            "companies_count": companies_count,
            "status": "SUCCESS"
        }
        
    except Exception as e:
        # Log failed pipeline run
        logger.error(f"Company universe flow failed: {str(e)}")
        logger.error(traceback.format_exc())
        log_pipeline_run(0, success=False, error_message=str(e))
        
        # Re-raise the exception to mark the flow as failed
        raise

if __name__ == "__main__":
    # Run the flow
    result = company_universe_flow() 