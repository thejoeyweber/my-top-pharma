"""
Test SEC EDGAR Pipeline

This script tests the full SEC EDGAR pipeline, from fetching data to loading into the database.
It runs a simplified version of the flow with a single ticker.
"""

import os
import sys
import logging
from datetime import datetime

# Add the parent directory to sys.path to import flows
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.s3_client import list_objects
from utils.db_utils import execute_query

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def verify_s3_data(ticker):
    """Verify that data was stored in S3"""
    logger.info(f"Checking S3 for data related to ticker {ticker}...")
    
    try:
        # List objects with the ticker prefix
        prefix = f"sec_edgar/{ticker}"
        objects = list_objects(prefix)
        
        if objects:
            logger.info(f"✅ Found {len(objects)} objects with prefix '{prefix}':")
            for obj in objects:
                logger.info(f"  - {obj}")
            return True
        else:
            logger.error(f"❌ No objects found with prefix '{prefix}'")
            return False
    except Exception as e:
        logger.error(f"❌ Error checking S3: {str(e)}")
        return False

def verify_staging_data(ticker):
    """Verify that data was loaded into the staging table"""
    logger.info(f"Checking staging_sec_edgar table for data related to ticker {ticker}...")
    
    try:
        # Query the staging table
        result = execute_query(
            "SELECT * FROM staging_sec_edgar WHERE ticker_symbol = %s",
            (ticker,)
        )
        
        if result and len(result) > 0:
            logger.info(f"✅ Found {len(result)} records in staging_sec_edgar for ticker {ticker}")
            for record in result:
                logger.info(f"  - Record ID: {record['id']}, Filing Date: {record['filing_date']}")
            return True
        else:
            logger.error(f"❌ No records found in staging_sec_edgar for ticker {ticker}")
            return False
    except Exception as e:
        logger.error(f"❌ Error querying staging table: {str(e)}")
        return False

def verify_companies_data(ticker):
    """Verify that data was loaded into the companies table"""
    logger.info(f"Checking companies table for data related to ticker {ticker}...")
    
    try:
        # Query the companies table
        result = execute_query(
            "SELECT * FROM companies WHERE ticker_symbol = %s",
            (ticker,)
        )
        
        if result and len(result) > 0:
            logger.info(f"✅ Found {len(result)} records in companies for ticker {ticker}")
            for record in result:
                logger.info(f"  - Company ID: {record['company_id']}, Name: {record['name']}")
            return True
        else:
            logger.error(f"❌ No records found in companies for ticker {ticker}")
            return False
    except Exception as e:
        logger.error(f"❌ Error querying companies table: {str(e)}")
        return False

def verify_pipeline_logs():
    """Verify that pipeline logs were created"""
    logger.info("Checking pipeline_run_logs table for SEC EDGAR flow runs...")
    
    try:
        # Query the pipeline_run_logs table
        result = execute_query(
            "SELECT * FROM pipeline_run_logs WHERE flow_name = 'sec_edgar_flow' ORDER BY created_at DESC LIMIT 5"
        )
        
        if result and len(result) > 0:
            logger.info(f"✅ Found {len(result)} records in pipeline_run_logs for SEC EDGAR flow")
            for record in result:
                logger.info(f"  - Run ID: {record['id']}, Status: {record['status']}, Records Processed: {record['records_processed']}")
            return True
        else:
            logger.error(f"❌ No records found in pipeline_run_logs for SEC EDGAR flow")
            return False
    except Exception as e:
        logger.error(f"❌ Error querying pipeline_run_logs table: {str(e)}")
        return False

def run_pipeline_test():
    """Run the full SEC EDGAR pipeline test"""
    logger.info("===== Testing SEC EDGAR Pipeline =====")
    
    # Test ticker
    test_ticker = "PFE"  # Pfizer
    
    # First, check DB/S3 connectivity before running the flow
    logger.info("Checking infrastructure before running flow...")
    try:
        # Check S3 connectivity
        objects = list_objects("")
        logger.info(f"✅ S3 connection successful: Found {len(objects)} objects")
        
        # Check DB connectivity
        result = execute_query("SELECT 1 AS connection_test")
        if result and result[0]['connection_test'] == 1:
            logger.info("✅ Database connection successful")
        else:
            logger.error("❌ Database connection failed")
            return False
    except Exception as e:
        logger.error(f"❌ Infrastructure check failed: {str(e)}")
        logger.error("Please ensure database and S3 are properly configured and running.")
        return False
    
    # Now, run the SEC EDGAR flow
    logger.info(f"Running SEC EDGAR flow with ticker: {test_ticker}")
    try:
        # Import flow here to avoid import errors if infrastructure is not ready
        from flows.sec_edgar_flow import sec_edgar_flow
        
        # Run the flow with a single ticker
        result = sec_edgar_flow([test_ticker])
        
        # Print results
        logger.info("\n===== SEC EDGAR Flow Results =====")
        logger.info(f"Tickers processed: {result['tickers_processed']}")
        logger.info(f"Filings retrieved: {result['filings_retrieved']}")
        logger.info(f"Records parsed: {result['records_parsed']}")
        logger.info(f"Staging records: {result['staging_results']['success']} successful, {result['staging_results']['failure']} failed")
        logger.info(f"Companies table: {result['companies_results']['updated']} updated, {result['companies_results']['inserted']} inserted, {result['companies_results']['skipped']} skipped")
        
        flow_success = (
            result['filings_retrieved'] > 0 and 
            result['records_parsed'] > 0 and
            (result['staging_results']['success'] > 0 or 
             result['companies_results']['updated'] > 0 or 
             result['companies_results']['inserted'] > 0)
        )
        
        if flow_success:
            logger.info("✅ SEC EDGAR flow executed successfully")
        else:
            logger.warning("⚠️ SEC EDGAR flow execution had issues")
        
        # Verify data in S3
        s3_ok = verify_s3_data(test_ticker)
        
        # Verify data in staging table
        staging_ok = verify_staging_data(test_ticker)
        
        # Verify data in companies table
        companies_ok = verify_companies_data(test_ticker)
        
        # Verify pipeline logs
        logs_ok = verify_pipeline_logs()
        
        # Overall result
        if flow_success and s3_ok and staging_ok and companies_ok and logs_ok:
            logger.info("\n✅ Full pipeline test PASSED")
            return True
        else:
            logger.warning("\n⚠️ Some pipeline tests FAILED")
            return False
        
    except Exception as e:
        logger.error(f"❌ Error running SEC EDGAR flow: {str(e)}")
        return False

if __name__ == "__main__":
    run_pipeline_test() 