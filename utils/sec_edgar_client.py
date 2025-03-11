"""
SEC EDGAR Client Utility for Top Pharma

This module provides utility functions for interacting with the SEC EDGAR API.
It handles rate limiting and standard API requests.
"""

import os
import sys
import requests
import logging
import json
import time
from datetime import datetime
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# Add the parent directory to sys.path to import prefect_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from prefect_config import SEC_EDGAR_RATE_LIMIT

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants for SEC EDGAR API
SEC_EDGAR_BASE_URL = "https://www.sec.gov/Archives/edgar"
SEC_EDGAR_SUBMISSIONS_URL = "https://data.sec.gov/submissions"
SEC_EDGAR_COMPANY_FACTS_URL = "https://data.sec.gov/api/xbrl/companyfacts"
SEC_EDGAR_COMPANY_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"

# Hardcoded CIKs for major pharmaceutical companies
# This is a fallback in case the API lookup fails
PHARMA_CIKS = {
    "PFE": "0000078003",  # Pfizer
    "JNJ": "0000200406",  # Johnson & Johnson
    "MRK": "0000310158",  # Merck
    "ABBV": "0001551152", # AbbVie
    "LLY": "0000059478",  # Eli Lilly
    "BMY": "0000014272",  # Bristol-Myers Squibb
    "AMGN": "0000318154", # Amgen
    "GILD": "0000882095", # Gilead Sciences
    "NVS": "0001114448",  # Novartis
    "AZN": "0000310158",  # AstraZeneca
}

# Headers required by SEC.gov (they require a proper User-Agent)
DEFAULT_HEADERS = {
    "User-Agent": "Top Pharma Data Pipeline user@example.com", 
    "Accept-Encoding": "gzip, deflate",
    "Host": "data.sec.gov"
}

# Rate limiting
last_request_time = 0

def _rate_limit():
    """
    Enforce rate limiting for SEC EDGAR API requests.
    
    The SEC limits requests to 10 per second.
    We'll be conservative and limit to SEC_EDGAR_RATE_LIMIT per minute.
    """
    global last_request_time
    current_time = time.time()
    min_interval = 60.0 / SEC_EDGAR_RATE_LIMIT  # Interval in seconds
    
    # If less than min_interval seconds have passed since the last request, wait
    if current_time - last_request_time < min_interval:
        wait_time = min_interval - (current_time - last_request_time)
        logger.debug(f"Rate limiting: Waiting {wait_time:.2f} seconds")
        time.sleep(wait_time)
    
    # Update last request time
    last_request_time = time.time()

def get_companies_by_sic(sic_code):
    """
    Get a list of companies with the specified SIC code from SEC EDGAR.
    
    Args:
        sic_code (str): The SIC code to search for
        
    Returns:
        list: List of company dictionaries with name, CIK, ticker, etc.
    """
    logger.info(f"Fetching companies with SIC code {sic_code}")
    
    # Prepare the URL for the SEC EDGAR company search by SIC code
    url = "https://www.sec.gov/cgi-bin/browse-edgar"
    params = {
        "SIC": sic_code,
        "action": "getcompany",
        "owner": "exclude",
        "count": 100
    }
    
    # Set headers for SEC EDGAR API
    headers = {
        "User-Agent": "Top Pharma Data Pipeline user@example.com",
        "Accept-Encoding": "gzip, deflate",
        "Host": "www.sec.gov"
    }
    
    # Apply rate limiting
    _rate_limit()
    
    try:
        # Make the request
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        
        # Parse the HTML response
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Find the company table
        companies = []
        company_table = soup.find("table", class_="tableFile2")
        
        if not company_table:
            logger.warning(f"No company table found for SIC code {sic_code}")
            return companies
        
        # Get the SIC description
        sic_description = None
        sic_header = soup.find("h3", string=lambda text: text and f"SIC {sic_code}" in text)
        if sic_header:
            sic_description = sic_header.text.split("-", 1)[1].strip() if "-" in sic_header.text else None
        
        # Extract company information from the table
        rows = company_table.find_all("tr")
        for row in rows[1:]:  # Skip the header row
            cells = row.find_all("td")
            if len(cells) >= 2:
                company_name = cells[0].text.strip()
                cik_cell = cells[1].text.strip()
                
                # Extract CIK
                cik = re.search(r"(\d+)", cik_cell)
                if cik:
                    cik = cik.group(1)
                else:
                    continue
                
                # Get the ticker if available
                ticker = None
                ticker_match = re.search(r"\((.*?)\)", company_name)
                if ticker_match:
                    ticker = ticker_match.group(1)
                    # Clean up the company name
                    company_name = company_name.replace(f"({ticker})", "").strip()
                
                companies.append({
                    "name": company_name,
                    "cik": cik,
                    "ticker": ticker,
                    "sic": sic_code,
                    "sic_description": sic_description,
                    "exchange": None  # SEC doesn't provide exchange info directly
                })
        
        logger.info(f"Found {len(companies)} companies with SIC code {sic_code}")
        return companies
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching companies for SIC code {sic_code}: {e}")
        return []

def get_cik_from_ticker(ticker):
    """
    Get the CIK number for a ticker symbol.
    
    Args:
        ticker (str): Company ticker symbol
        
    Returns:
        str: CIK number as a 10-digit zero-padded string, or None if not found
    """
    ticker = ticker.upper()
    logger.info(f"Looking up CIK for ticker {ticker}")
    
    # First check our hardcoded list for common pharma companies
    if ticker in PHARMA_CIKS:
        cik = PHARMA_CIKS[ticker]
        padded_cik = cik.zfill(10)
        logger.info(f"Found CIK {padded_cik} for ticker {ticker} in hardcoded list")
        return padded_cik
    
    # If not in our list, try to search for it
    try:
        # Use the EDGAR search page to find the CIK
        search_url = f"https://www.sec.gov/cgi-bin/browse-edgar?CIK={ticker}&owner=exclude&action=getcompany&Find=Search"
        _rate_limit()
        
        response = requests.get(search_url, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        
        # Extract CIK from the response using regex
        match = re.search(r'CIK=(\d+)', response.text)
        if match:
            cik = match.group(1)
            padded_cik = cik.zfill(10)
            logger.info(f"Found CIK {padded_cik} for ticker {ticker} via search")
            return padded_cik
        
        logger.warning(f"No CIK found for ticker {ticker}")
        return None
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching CIK for ticker {ticker}: {e}")
        return None

def get_company_submissions(ticker):
    """
    Get the SEC EDGAR submissions for a company by ticker.
    
    Args:
        ticker (str): Company ticker symbol
        
    Returns:
        dict: Submissions data or None on error
    """
    cik = get_cik_from_ticker(ticker)
    if not cik:
        logger.error(f"Cannot retrieve submissions: No CIK found for ticker {ticker}")
        return None
    
    _rate_limit()
    
    url = f"{SEC_EDGAR_SUBMISSIONS_URL}/CIK{cik}.json"
    logger.info(f"Fetching SEC EDGAR submissions for {ticker} from {url}")
    
    try:
        response = requests.get(url, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching submissions for {ticker}: {e}")
        return None

def get_company_facts(ticker):
    """
    Get the SEC EDGAR company facts for a company by ticker.
    
    Args:
        ticker (str): Company ticker symbol
        
    Returns:
        dict: Company facts data or None on error
    """
    cik = get_cik_from_ticker(ticker)
    if not cik:
        logger.error(f"Cannot retrieve company facts: No CIK found for ticker {ticker}")
        return None
    
    _rate_limit()
    
    url = f"{SEC_EDGAR_COMPANY_FACTS_URL}/CIK{cik}.json"
    logger.info(f"Fetching SEC EDGAR company facts for {ticker} from {url}")
    
    try:
        response = requests.get(url, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching company facts for {ticker}: {e}")
        return None

def get_latest_10k_filing(ticker):
    """
    Get the latest 10-K filing information for a company.
    
    Args:
        ticker (str): Company ticker symbol
        
    Returns:
        dict: Filing information or None if not found
    """
    submissions = get_company_submissions(ticker)
    if not submissions:
        return None
    
    # Extract the company name
    company_name = submissions.get('name', '')
    
    # Look for the latest 10-K filing
    recent_filings = submissions.get('filings', {}).get('recent', {})
    if not recent_filings:
        logger.warning(f"No recent filings found for {ticker}")
        return None
    
    # Find indices of 10-K filings
    filing_types = recent_filings.get('form', [])
    filing_dates = recent_filings.get('filingDate', [])
    accession_numbers = recent_filings.get('accessionNumber', [])
    
    if not filing_types or not filing_dates or not accession_numbers:
        logger.warning(f"Missing filing information for {ticker}")
        return None
    
    # Find the most recent 10-K filing
    latest_10k = None
    latest_date = None
    
    for i, form_type in enumerate(filing_types):
        if form_type == '10-K':
            filing_date = filing_dates[i]
            if latest_date is None or filing_date > latest_date:
                latest_date = filing_date
                latest_10k = {
                    'accession_number': accession_numbers[i].replace('-', ''),
                    'filing_date': filing_date,
                    'form_type': form_type,
                    'company_name': company_name,
                    'ticker': ticker,
                    'cik': submissions.get('cik', '')
                }
    
    if latest_10k:
        logger.info(f"Found latest 10-K filing for {ticker} dated {latest_date}")
    else:
        logger.warning(f"No 10-K filings found for {ticker}")
    
    return latest_10k

def get_filing_html(accession_number, cik):
    """
    Get the HTML content of a filing by accession number and CIK.
    
    Args:
        accession_number (str): SEC accession number (without dashes)
        cik (str): Central Index Key (CIK)
        
    Returns:
        str: HTML content or None on error
    """
    _rate_limit()
    
    # Format the URL for the filing document
    padded_cik = str(cik).zfill(10)
    
    # Format accession number with dashes for URL
    formatted_accession = f"{accession_number[0:10]}-{accession_number[10:12]}-{accession_number[12:]}"
    
    # First try the modern URL format
    url = f"{SEC_EDGAR_BASE_URL}/data/{padded_cik}/{accession_number}/{formatted_accession}.txt"
    logger.info(f"Fetching filing document from {url}")
    
    try:
        # Get the document
        response = requests.get(url, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        logger.warning(f"Error fetching filing HTML from primary URL: {e}")
        
        # Try the alternative index URL format as fallback
        try:
            index_url = f"{SEC_EDGAR_BASE_URL}/data/{padded_cik}/{accession_number}-index.html"
            logger.info(f"Trying alternative URL: {index_url}")
            
            index_response = requests.get(index_url, headers=DEFAULT_HEADERS)
            index_response.raise_for_status()
            
            # Parse the index to find the 10-K document
            soup = BeautifulSoup(index_response.text, 'html.parser')
            for row in soup.find_all('tr'):
                cells = row.find_all('td')
                if len(cells) >= 4:
                    if '10-K' in cells[3].get_text():
                        # Get the HTML file link
                        doc_link = cells[2].find('a')['href']
                        doc_url = urljoin(index_url, doc_link)
                        
                        # Fetch the actual 10-K HTML
                        _rate_limit()
                        doc_response = requests.get(doc_url, headers=DEFAULT_HEADERS)
                        doc_response.raise_for_status()
                        return doc_response.text
            
            logger.warning(f"10-K document not found in index: {index_url}")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching filing HTML: {e}")
            return None

def extract_financials_from_html(html_content):
    """
    Extract financial information from 10-K HTML content.
    This is a simplified extraction and may need enhancement for specific data.
    
    Args:
        html_content (str): HTML content of the 10-K filing
        
    Returns:
        dict: Extracted financial information
    """
    if not html_content:
        return {}
    
    financials = {
        'revenue': None,
        'net_income': None,
        'headquarters': None
    }
    
    # Parse the HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Try to extract headquarters
    address_section = soup.find(string=re.compile('business address|principal executive office', re.IGNORECASE))
    if address_section:
        parent = address_section.parent
        for i in range(3):  # Look a few levels up
            if parent:
                address_text = parent.get_text()
                # Basic pattern for addresses
                if re.search(r'\d+[^\n,]+,[^\n,]+,[^\n,]+(,\s*[A-Z]{2}\s*)?', address_text):
                    financials['headquarters'] = re.sub(r'\s+', ' ', address_text).strip()[:255]
                    break
                parent = parent.parent
    
    # Try to extract revenue and net income by looking for tables with financial data
    # This is a simplified approach and may need refinement
    tables = soup.find_all('table')
    for table in tables:
        table_text = table.get_text()
        
        # Look for revenue indicators
        if re.search(r'revenue|sales|net sales', table_text, re.IGNORECASE):
            rows = table.find_all('tr')
            for row in rows:
                cell_text = row.get_text()
                if re.search(r'revenue|sales|net sales', cell_text, re.IGNORECASE):
                    # Try to find a dollar amount in the row
                    amount_match = re.search(r'\$[\d,]+(?:\.\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?', cell_text)
                    if amount_match and not financials['revenue']:
                        amount = amount_match.group(0).replace(',', '').replace('$', '')
                        try:
                            financials['revenue'] = float(amount)
                        except ValueError:
                            pass
        
        # Look for net income indicators
        if re.search(r'net income|net earnings|profit', table_text, re.IGNORECASE):
            rows = table.find_all('tr')
            for row in rows:
                cell_text = row.get_text()
                if re.search(r'net income|net earnings|profit', cell_text, re.IGNORECASE):
                    # Try to find a dollar amount in the row
                    amount_match = re.search(r'\$[\d,]+(?:\.\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?', cell_text)
                    if amount_match and not financials['net_income']:
                        amount = amount_match.group(0).replace(',', '').replace('$', '')
                        try:
                            financials['net_income'] = float(amount)
                        except ValueError:
                            pass
    
    return financials

def get_ticker_company_info(ticker):
    """
    Comprehensive function to get company information from SEC EDGAR for a ticker.
    
    Args:
        ticker (str): Company ticker symbol
        
    Returns:
        dict: Company information or None on error
    """
    # Get the latest 10-K filing
    filing_info = get_latest_10k_filing(ticker)
    if not filing_info:
        return None
    
    # Get the filing HTML
    html_content = get_filing_html(filing_info['accession_number'], filing_info['cik'])
    
    # Extract financial information
    financials = extract_financials_from_html(html_content)
    
    # Combine the information
    company_info = {
        'ticker_symbol': ticker,
        'company_name': filing_info['company_name'],
        'filing_date': filing_info['filing_date'],
        'filing_type': filing_info['form_type'],
        'revenue': financials.get('revenue'),
        'net_income': financials.get('net_income'),
        'headquarters': financials.get('headquarters'),
        'raw_data': {
            'filing_info': filing_info,
            'html': html_content is not None  # Just store a flag, not the full HTML
        }
    }
    
    return company_info

def transform_sec_edgar(company_info):
    """
    Transform SEC EDGAR data into standardized format.
    
    Args:
        company_info (dict): SEC EDGAR company information
        
    Returns:
        dict: Transformed company information
    """
    if not company_info:
        return None
    
    # Clean company name (remove Inc., Corp., etc.)
    company_name = company_info.get('company_name', '')
    company_name = re.sub(r'\s+(Inc|Corp|Corporation|Ltd|LLC|Limited)\.?$', '', company_name, flags=re.IGNORECASE)
    
    # Create transformed data
    transformed = {
        'ticker_symbol': company_info.get('ticker_symbol', '').upper(),
        'name': company_name.strip(),
        'headquarters': company_info.get('headquarters', ''),
        'market_cap': None,  # Not available in basic extraction
        'revenue': company_info.get('revenue'),
        'net_income': company_info.get('net_income'),
        'filing_date': company_info.get('filing_date'),
        'source': 'SEC EDGAR',
        'raw_data': company_info.get('raw_data')
    }
    
    return transformed 