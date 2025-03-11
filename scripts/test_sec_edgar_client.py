"""
Test SEC EDGAR API Client

This script tests the SEC EDGAR API client with the updated company tickers URL.
"""

import os
import sys
import json
import logging

# Add parent directory to path to allow imports from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the SEC EDGAR client
from api_clients.sec_edgar_client import get_companies_by_sic, PHARMA_SIC_CODES

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_get_companies():
    """Test retrieving companies from SEC EDGAR API"""
    logger.info("Testing SEC EDGAR API client...")
    
    # Get pharmaceutical companies
    pharma_companies = get_companies_by_sic(PHARMA_SIC_CODES)
    
    # Print results
    if pharma_companies:
        logger.info(f"Successfully retrieved {len(pharma_companies)} pharmaceutical companies")
        logger.info("Sample companies:")
        for i, company in enumerate(pharma_companies[:5]):
            logger.info(f"  {i+1}. {company['name']} ({company['ticker']}) - SIC: {company['sic']}")
    else:
        logger.error("Failed to retrieve pharmaceutical companies")
    
    return len(pharma_companies) > 0

if __name__ == "__main__":
    success = test_get_companies()
    sys.exit(0 if success else 1) 