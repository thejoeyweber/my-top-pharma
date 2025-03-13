# Financial Modeling Prep (FMP) Integration

This document provides detailed information about the Financial Modeling Prep (FMP) API integration in the MyTopPharma project.

## Overview

The FMP API is used to fetch data about pharmaceutical and biotech companies, including:
- Company profiles
- Financial data
- Stock information
- Industry classification

## API Client

The FMP API client is implemented in `src/lib/fmp.ts` and provides a typed interface for interacting with the FMP API.

### Key Features

- **Authentication**: Handles API key authentication
- **Rate Limiting**: Implements delays to respect API rate limits
- **Error Handling**: Provides detailed error messages and retries
- **Type Safety**: Uses TypeScript interfaces for all API responses

### Available Methods

- `screenPharmaceuticalCompanies()`: Fetches pharmaceutical and biotech companies
- `getCompanyProfile(symbol)`: Fetches detailed company profile by stock symbol
- `getCompanyProfiles(symbols)`: Fetches multiple company profiles in batch

## Data Mapping

The FMP data mapper (`src/lib/fmpMapper.ts`) transforms data from the FMP API format to the internal database schema.

### Mapping Functions

- `mapProfileToCompany(profile)`: Maps an FMP company profile to a database company object
- `mapScreenerResultToCompany(result)`: Maps an FMP screener result to a database company object
- `processCompanyProfiles(profiles)`: Processes a list of company profiles into database records

### Data Transformation

The mapper handles:
- Generating URL-friendly slugs from company names
- Parsing numeric values from strings
- Extracting relevant fields from the API response
- Normalizing data formats

## Data Ingestion

The data ingestion process is implemented in `scripts/ingest-companies.js` and performs the following steps:

1. Fetch pharmaceutical and biotech companies from the FMP screener
2. Fetch detailed company profiles for each company in batches
3. Transform the data to match the database schema
4. Save a backup of the data to JSON files
5. Insert or update the data in the Supabase database

### Running the Ingestion

```bash
npm run ingest-companies
```

### Backup Files

Backup files are stored in `data/backups/` with timestamps in the filename:
- `companies_YYYY-MM-DD_HH-MM-SS.json`

## Testing

To test the FMP API connection:

```bash
npm run test-fmp
```

This script:
1. Verifies that the API key is set in the `.env` file
2. Tests the screener endpoint by fetching pharmaceutical companies
3. Tests the company profile endpoint by fetching a specific company profile
4. Displays the results in the console

## Troubleshooting

### Common Issues

1. **API Key Not Set**
   - Ensure the `PUBLIC_FMP_API_KEY` is set in the `.env` file
   - Verify the API key is valid by running `npm run test-fmp`

2. **Rate Limit Exceeded**
   - The FMP API has rate limits that vary by subscription tier
   - The client implements delays between requests to avoid rate limiting
   - If you encounter rate limit errors, increase the delay between requests

3. **No Data Returned**
   - Verify your API key has access to the required endpoints
   - Check if the industry filters in the screener are correct
   - Ensure the API is responding correctly by running `npm run test-fmp`

### Debugging

For detailed debugging:

1. Set the `DEBUG` environment variable:
   ```
   DEBUG=fmp:* npm run ingest-companies
   ```

2. Check the console output for detailed logs of:
   - API requests
   - Response data
   - Transformation steps
   - Database operations

## Future Improvements

- Implement incremental updates to only fetch new or changed data
- Add support for additional FMP endpoints (financials, news, etc.)
- Implement a scheduled job to update the data regularly
- Add more detailed error reporting and monitoring 