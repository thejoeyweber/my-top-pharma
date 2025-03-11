# SEC EDGAR Integration

This document describes the SEC EDGAR integration for the Top Pharma Data Platform.

## Overview

The SEC EDGAR integration provides company information for pharmaceutical and biotech firms by:

1. Maintaining a universe of pharmaceutical companies based on SIC codes
2. Retrieving and processing SEC filings for these companies
3. Extracting key information from filings and storing it in the database

## Implementation

The integration consists of the following components:

### Database Schema

- `sec_companies`: Companies from SEC EDGAR
  - Includes CIK, name, ticker, SIC code, and SIC description
- `sec_filings`: SEC filings for tracked companies
  - Includes filing type, date, and extracted data
- `staging_sec_companies`: Staging table for SEC company data
- `staging_sec_filings`: Staging table for SEC filing data

### Data Flows

1. **Company Universe Flow**
   - Retrieves companies with pharmaceutical SIC codes (2834, 2835, 2836)
   - Stores them in the `sec_companies` table
   - Updates the main `companies` table

2. **Company Filing Flow**
   - Retrieves the latest filings for each company
   - Stores raw filing data in MinIO
   - Extracts key information to the `sec_filings` table

### Workarounds for Database Connection Issues

Due to connection issues between the host machine and the PostgreSQL container, we've implemented the following workarounds:

1. `docker_db_query.py`: A utility script that executes SQL queries inside the Docker container
2. `docker_run_company_universe.py`: A script that runs the company universe flow using Docker commands

These scripts bypass the direct connection issues by executing commands inside the Docker container.

## Usage

### Running the Company Universe Flow

```bash
python scripts/docker_run_company_universe.py
```

### Querying SEC EDGAR Data

```python
from scripts.docker_db_query import run_query

# Get all SEC companies
companies = run_query("SELECT * FROM sec_companies;")

# Get company by ticker
pfizer = run_query("SELECT * FROM sec_companies WHERE ticker = 'PFE';")
```

## Future Enhancements

1. Implement real-time SEC EDGAR API integration
2. Add support for extracting financial data from 10-K and 10-Q filings
3. Implement change tracking for company information
4. Add support for additional filing types (8-K, DEF 14A, etc.) 