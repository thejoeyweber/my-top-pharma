# SEC EDGAR Ingestion Flow

This document describes the SEC EDGAR ingestion flow implemented for the Top Pharma application.

## Overview

The SEC EDGAR ingestion flow retrieves 10-K filings from the SEC EDGAR database for pharmaceutical companies, extracts key information, and loads it into our database. The flow includes:

1. **Data Fetching:** Retrieve 10-K filings from SEC EDGAR API for specified tickers
2. **Data Storage:** Store raw filing data in S3 data lake
3. **Data Parsing:** Extract key company information (name, ticker, headquarters, financials)
4. **Data Loading:** Load parsed data into staging and production tables

## Component Files

- **`flows/sec_edgar_flow.py`**: Main flow implementation
- **`utils/sec_edgar_client.py`**: SEC EDGAR API client utilities
- **`scripts/test_sec_edgar_client.py`**: Test script for the SEC EDGAR client
- **`scripts/deploy_sec_edgar_flow.py`**: Script for deploying the flow with Prefect

## Database Tables

The flow interacts with the following database tables:

1. **`staging_sec_edgar`**: Temporary table for parsed SEC filing data
   - Contains ticker, company information, and financial data
   - Raw data stored in JSONB format

2. **`companies`**: Main companies table that powers the front-end
   - Updated with standardized information from SEC filings

3. **`pipeline_run_logs`**: Tracks pipeline execution statistics
   - Records success/failure counts and timestamps

## Implementation Details

### SEC EDGAR Client

The SEC EDGAR client (`utils/sec_edgar_client.py`) provides:

- Rate-limited access to SEC EDGAR API endpoints
- Retrieval of company submissions and 10-K filings
- Extraction of financial data from filing HTML
- Transformation of raw data to standardized format

### SEC EDGAR Flow

The flow (`flows/sec_edgar_flow.py`) consists of these main tasks:

1. **`fetch_filings_task`**: Retrieve 10-K filings and save to S3
2. **`parse_filings_task`**: Transform raw filing data
3. **`load_staging_task`**: Insert data into staging table
4. **`update_companies_task`**: Update main companies table
5. **`log_pipeline_run_task`**: Record pipeline statistics

## Usage

### Running Manually

```bash
# Activate virtual environment
.\venv\Scripts\activate

# Run the flow with default tickers
python flows/sec_edgar_flow.py

# Run with specific tickers
python -c "from flows.sec_edgar_flow import sec_edgar_flow; sec_edgar_flow(['PFE', 'JNJ'])"
```

### Creating a Deployment

```bash
# Create a scheduled deployment
python scripts/deploy_sec_edgar_flow.py
```

### Testing the SEC EDGAR Client

```bash
# Test the SEC EDGAR client functionality
python scripts/test_sec_edgar_client.py
```

## Configuration

The flow uses the following configuration from `prefect_config.py`:

- `SEC_EDGAR_RATE_LIMIT`: Maximum API requests per minute (default: 10)
- `S3_BUCKET_NAME`: S3 bucket for storing raw filing data
- Database connection parameters

## SEC EDGAR API Notes

- SEC EDGAR API requires a proper User-Agent header
- Rate limiting is required (max 10 requests per second according to SEC)
- The API is structured around CIK (Central Index Key) numbers
- Data is retrieved as JSON and HTML

## Future Enhancements

- Improve financial data extraction with more robust parsing
- Add extraction of additional data points (employee count, risk factors)
- Implement more comprehensive error handling
- Add full XBRL parsing for standardized financial data 