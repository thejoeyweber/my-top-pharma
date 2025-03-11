"""
Test SEC EDGAR Flow

This script runs the SEC EDGAR flow with a limited set of tickers for testing.
"""

import os
import sys
import logging
import json
from datetime import datetime

# Add the parent directory to sys.path to import flows
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.sec_edgar_client import get_ticker_company_info, transform_sec_edgar

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_sec_edgar_client_only():
    """
    Test just the SEC EDGAR client functionality without the full flow.
    Useful when database or S3 is not available.
    """
    # Use just one ticker for fast testing
    test_ticker = "PFE"  # Pfizer only
    
    logger.info(f"Testing SEC EDGAR client with ticker: {test_ticker}")
    
    # Get company information
    company_info = get_ticker_company_info(test_ticker)
    
    if company_info:
        logger.info("✅ Successfully retrieved company information")
        logger.info(f"Company name: {company_info.get('company_name')}")
        logger.info(f"Filing date: {company_info.get('filing_date')}")
        
        # Transform data
        transformed = transform_sec_edgar(company_info)
        if transformed:
            logger.info("✅ Successfully transformed company data")
            
            # Save to output file for inspection
            output_file = os.path.join(os.path.dirname(__file__), f"{test_ticker}_transformed.json")
            with open(output_file, 'w') as f:
                json.dump(transformed, f, indent=2, default=str)
            logger.info(f"Saved transformed data to {output_file}")
            
            return True
    else:
        logger.error("❌ Failed to retrieve company information")
    
    return False

def test_sec_edgar_flow():
    """
    Test the SEC EDGAR flow with a single ticker for quick testing.
    This requires database and S3 to be available.
    """
    try:
        # Test if we can import the flow (which will fail if database is not set up)
        from flows.sec_edgar_flow import sec_edgar_flow
        
        # Use just one ticker for fast testing
        test_tickers = ["PFE"]  # Pfizer only
        
        logger.info(f"Testing SEC EDGAR flow with tickers: {test_tickers}")
        
        # Run the flow with the test ticker
        result = sec_edgar_flow(test_tickers)
        
        # Print the results
        logger.info("\n===== SEC EDGAR Flow Test Results =====")
        logger.info(f"Tickers processed: {result['tickers_processed']}")
        logger.info(f"Filings retrieved: {result['filings_retrieved']}")
        logger.info(f"Records parsed: {result['records_parsed']}")
        
        if result['staging_results']['success'] > 0:
            logger.info("✅ Successfully loaded data to staging table")
        else:
            logger.warning("❌ Failed to load data to staging table")
        
        if result['companies_results']['updated'] > 0 or result['companies_results']['inserted'] > 0:
            logger.info("✅ Successfully updated companies table")
        else:
            logger.warning("❌ Failed to update companies table")
        
        return result
    except Exception as e:
        logger.error(f"Error running SEC EDGAR flow: {e}")
        logger.info("Falling back to client-only test...")
        return test_sec_edgar_client_only()

if __name__ == "__main__":
    test_sec_edgar_client_only() 