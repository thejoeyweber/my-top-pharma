"""
Run SEC EDGAR Flow

This script runs the SEC EDGAR company universe flow directly,
without requiring a running Prefect server.
"""

import os
import sys
import logging
import time

# Add parent directory to path for imports
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Make sure we can import our flow
flows_dir = os.path.join(parent_dir, "flows")
if flows_dir not in sys.path:
    sys.path.append(flows_dir)

sec_edgar_dir = os.path.join(flows_dir, "sec_edgar")
if sec_edgar_dir not in sys.path:
    sys.path.append(sec_edgar_dir)

# Now import the flow
from flows.sec_edgar.company_universe_flow import company_universe_flow

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_flow():
    """
    Run the SEC EDGAR company universe flow
    
    Returns:
        dict: Flow run results
    """
    logger.info("Running SEC EDGAR company universe flow directly")
    
    try:
        # Run the flow
        result = company_universe_flow()
        
        logger.info("Flow completed successfully")
        logger.info(f"Processed {result.get('companies_processed', 0)} companies")
        logger.info(f"SEC companies count: {result.get('sec_companies_count', 0)}")
        logger.info(f"Main companies count: {result.get('companies_count', 0)}")
        
        return result
    except Exception as e:
        logger.error(f"Flow failed: {e}")
        return {"status": "FAILED", "error": str(e)}

if __name__ == "__main__":
    # Run the flow
    start_time = time.time()
    result = run_flow()
    end_time = time.time()
    
    # Print summary
    print("\n" + "="*50)
    print("SEC EDGAR Flow Run Summary")
    print("="*50)
    print(f"Status: {result.get('status', 'UNKNOWN')}")
    print(f"Companies processed: {result.get('companies_processed', 0)}")
    print(f"SEC companies count: {result.get('sec_companies_count', 0)}")
    print(f"Main companies count: {result.get('companies_count', 0)}")
    print(f"Duration: {end_time - start_time:.2f} seconds")
    print("="*50) 