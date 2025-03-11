# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

# Top Pharma

A comprehensive directory of pharmaceutical companies, products, and websites.

## Data Structure

The application uses JSON files for data storage, located in `src/data/json/`. SVG assets are stored in `src/data/assets/`.

### Data Files

- `companies.json`: Information about pharmaceutical companies
- `products.json`: Information about pharmaceutical products
- `websites.json`: Information about pharmaceutical websites
- `therapeuticAreas.json`: List of therapeutic areas
- `indications.json`: List of medical indications
- `websiteCategories.json`: Categories for websites
- `regions.json`: Geographic regions
- `systemStats.json`: System statistics for the admin dashboard
- `userProfile.json`: User profile information
- `userPreferences.json`: User preferences
- `followedCompanies.json`: Companies followed by the user

### Asset Files

SVG assets are stored in the following directories:

- `src/data/assets/logos/`: Company logos
- `src/data/assets/products/`: Product images
- `src/data/assets/screenshots/`: Website screenshots
- `src/data/assets/icons/`: Icons used in the application

## Data Utilities

The `src/utils/dataUtils.ts` file provides utility functions for loading data from JSON files and resolving asset paths.

### Loading Data

```typescript
// Get all companies
const companies = await getCompanies();

// Get a specific company by ID
const company = await getCompanyById('pfizer');

// Get all products for a company
const products = await getProductsByCompany('pfizer');
```

### Resolving Asset Paths

```typescript
// Get the path to a company logo
const logoPath = getAssetPath('logo', 'pfizer');

// Get the path to a product image
const productImagePath = getAssetPath('product', 'exampla');
```

## Development

### Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
# Top Pharma Data Infrastructure

This repository contains the data infrastructure for the Top Pharma application, including data ingestion pipelines, storage, and processing workflows.

## Components

- **PostgreSQL**: Primary database for structured data storage
- **MinIO**: S3-compatible object storage for raw data files (data lake)
- **Prefect**: Workflow orchestration for data processing pipelines

## Quick Start

1. **Start the services**:
   ```
   docker-compose up -d
   ```

2. **Activate the virtual environment**:
   ```
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Initialize the environment**:
   ```
   python setup.py
   ```

## Environment Variables

Required environment variables are stored in `.env`. You can modify them as needed:

- `DB_HOST`: PostgreSQL host (default: postgres)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: PostgreSQL database name (default: toppharma)
- `DB_USER`: PostgreSQL username (default: postgres)
- `DB_PASSWORD`: PostgreSQL password (default: password)
- `S3_BUCKET_NAME`: MinIO/S3 bucket name (default: top-pharma-data-lake)
- `S3_ACCESS_KEY`: MinIO/S3 access key (default: minioadmin)
- `S3_SECRET_KEY`: MinIO/S3 secret key (default: minioadmin)
- `S3_ENDPOINT_URL`: MinIO/S3 endpoint URL (default: http://minio:9000)

## SEC EDGAR Integration

The system includes comprehensive integration with the SEC EDGAR database to retrieve and process pharmaceutical company data.

### Data Flow Architecture

1. **Company Universe Flow**: Retrieves all pharmaceutical and biotech companies from SEC EDGAR by SIC codes
2. **Raw Data Storage**: Stores the raw JSON data in MinIO S3 with date-based prefixes
3. **Staging Processing**: Loads data into staging tables for validation and transformation
4. **Main Tables Update**: Upserts valid records into the main `sec_companies` and `companies` tables

### Database Schema

- **sec_companies**: Primary table for SEC company data (CIK, name, ticker, SIC code)
- **staging_sec_companies**: Staging table for new SEC company data
- **companies**: Main companies table that integrates data from multiple sources

### Running SEC EDGAR Flows

#### Command Line (PowerShell)

Run the full company universe flow:
```powershell
cd app
.\venv\Scripts\activate
python -m flows.sec_edgar.company_universe_flow
```

Run the demonstration flow:
```powershell
python scripts/run_full_demo.py
```

#### Using Prefect

Deploy and schedule the flow:
```powershell
python scripts/deploy_company_universe.py
```

Start a Prefect agent to process runs:
```powershell
python scripts/start_prefect_agent.py
```

### SEC EDGAR API Usage

The integration uses SEC EDGAR's public API with appropriate rate limiting (10 requests/second). Key API endpoints include:

- Companies by SIC code (pharmaceutical and biotech focus)
- Company facts and filings
- 10-K annual reports

SIC codes used for pharmaceutical/biotech companies:
- 2833: Medicinal Chemicals & Botanical Products
- 2834: Pharmaceutical Preparations
- 2835: In Vitro & In Vivo Diagnostic Substances
- 2836: Biological Products (No Diagnostic Substances)
- 3851: Ophthalmic Goods
- 8731: Commercial Physical & Biological Research

### Monitoring and Management

Monitor SEC EDGAR data flows using:

1. **Prefect UI**: http://localhost:4200
2. **PostgreSQL Queries**:
   ```sql
   -- Check SEC companies
   SELECT COUNT(*) FROM sec_companies;
   
   -- Check recent pipeline runs
   SELECT * FROM pipeline_run_logs ORDER BY start_time DESC LIMIT 5;
   ```
3. **MinIO Console**: http://localhost:9001 (navigate to top-pharma-data-lake/sec_edgar/)

## Directory Structure

- `db/`: Database schemas and migrations
- `flows/`: Prefect workflow definitions
  - `blocks/`: Prefect block definitions
  - `sec_edgar/`: SEC EDGAR specific flows
- `scripts/`: Utility scripts
- `utils/`: Shared utility functions
  - `s3_client.py`: S3 client utilities
  - `db_utils.py`: Database client utilities
  - `sec_edgar_client.py`: SEC EDGAR API client

## Development

### Adding a New Data Source

1. Create a staging table in `db/schema.sql`
2. Create a flow file in `flows/`
3. Implement the extraction, transformation, and loading tasks
4. Test and deploy the flow

### Using the S3 Data Lake

Use the utilities in `utils/s3_client.py` to interact with the data lake:

```python
from utils.s3_client import upload_to_s3, download_from_s3

# Upload a file
with open('data.json', 'rb') as f:
    upload_to_s3(f, 'top-pharma-data-lake', 'path/to/data.json')

# Download a file
download_from_s3('top-pharma-data-lake', 'path/to/data.json', 'local_data.json')
```

### Using the Database

Use the utilities in `utils/db_utils.py` to interact with the database:

```python
from utils.db_utils import execute_query, insert_record

# Execute a query
results = execute_query("SELECT * FROM companies WHERE ticker_symbol = %s", ['PFE'])

# Insert a record
insert_record('companies', {
    'name': 'Pfizer Inc.',
    'ticker_symbol': 'PFE',
    'headquarters': 'New York, NY'
})
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, check:
- PostgreSQL container is running: `docker ps | grep postgres`
- Connection details match your `.env` file
- Network connectivity between services

### S3/MinIO Issues

If you encounter S3/MinIO issues, check:
- MinIO container is running: `docker ps | grep minio`
- MinIO console is accessible at http://localhost:9001
- Credentials match your `.env` file

### Prefect Issues

If you encounter Prefect issues, check:
- Prefect container is running: `docker ps | grep prefect`
- Prefect UI is accessible at http://localhost:4200
- Prefect API is accessible at http://localhost:4200/api
- Agent is running: `prefect agent list`