# SEC EDGAR Integration

This package implements a data pipeline for integrating SEC EDGAR data into our pharmaceutical company database. It includes:

1. The ability to build a universe of pharmaceutical and biotech companies based on SIC codes
2. The capability to fetch and process SEC filings (10-K reports) for these companies
3. Extraction of key information from filings to enrich our company database

## Setup

Before running any flows, you need to set up the database schema:

```bash
# Run the SQL schema directly in the PostgreSQL container
cat app/db/sec_edgar_schema.sql | docker exec -i mytoppharma-postgres-1 psql -U postgres -d toppharma
```

## Flows

### Company Universe Flow

This flow builds and maintains a universe of pharmaceutical companies by querying the SEC EDGAR database for companies with specific SIC codes:

```bash
python scripts/docker_run_company_universe.py
```

**Target SIC Codes:**
- 2834: Pharmaceutical Preparations
- 2836: Biological Products (No Diagnostic Substances)
- 2833: Medicinal Chemicals & Botanical Products
- 2835: In Vitro & In Vivo Diagnostic Substances
- 8731: Commercial Physical & Biological Research

The flow will:
1. Fetch companies for each target SIC code
2. Save raw data to the S3 data lake
3. Load companies into staging tables
4. Upsert into the `sec_companies` table
5. Update the main `companies` table with new companies

### Update Companies from SEC

This script updates the main companies table with data from the SEC companies table:

```bash
python scripts/update_companies_from_sec.py
```

The script will:
1. Insert companies from the `sec_companies` table into the `companies` table
2. Set the description to include the SIC code description
3. Show the updated companies in the table

### Filing Enrichment Flow

This flow enriches pharmaceutical company data by fetching and processing their SEC EDGAR filings, particularly 10-K reports:

```bash
python flows/sec_edgar/filing_enrichment_flow.py
```

The flow will:
1. Get a list of companies to process from the `sec_companies` table
2. Fetch the latest 10-K filing for each company
3. Extract relevant data from the filings (business description, headquarters, etc.)
4. Save filing data to the S3 data lake
5. Load filings into staging tables
6. Upsert into the `sec_filings` table
7. Update the main `companies` table with enriched information

## Database Schema

The SEC EDGAR integration uses the following tables:

1. `sec_companies`: Stores information about companies from SEC EDGAR
2. `sec_filings`: Stores information about SEC filings
3. `staging_sec_companies`: Staging table for loading company data
4. `staging_sec_filings`: Staging table for loading filing data

## Rate Limiting

The SEC EDGAR API has rate limits in place. The client implementation respects these limits by:
- Adding delays between requests (2 seconds between SIC code queries)
- Adding delays between filing extraction (2 seconds between filings)
- Processing companies in batches (20 at a time)

## Prefect Integration

Both flows are implemented as Prefect flows and can be registered with a Prefect server:

```bash
prefect deployment build flows/sec_edgar/company_universe_flow.py:company_universe_flow -n "Company Universe" -q default
prefect deployment build flows/sec_edgar/filing_enrichment_flow.py:filing_enrichment_flow -n "Filing Enrichment" -q default
```

Recommended schedules:
- Company Universe Flow: Weekly
- Filing Enrichment Flow: Daily 