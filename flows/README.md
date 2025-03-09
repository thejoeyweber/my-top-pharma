# Top Pharma Prefect Flows

This directory contains Prefect workflow definitions for Top Pharma's data ingestion pipelines. These workflows orchestrate the extraction, transformation, and loading of data from various sources into the Top Pharma database.

## Flows Overview

The following main flows are implemented (or planned):

1. **Hello Prefect (`hello_prefect.py`)** - A test flow to verify Prefect setup
2. **SEC EDGAR (`sec_edgar_flow.py`)** - (Planned) Ingest financial data from SEC filings
3. **OpenCorporates (`opencorporates_flow.py`)** - (Planned) Ingest company registration data
4. **FDA Drugs (`fda_drugs_flow.py`)** - (Planned) Ingest FDA drug approval data
5. **ClinicalTrials.gov (`clinicaltrials_flow.py`)** - (Planned) Ingest clinical trial data

## Setup Instructions

### Prerequisites

- Python 3.9+
- Prefect 3.0+ installed
- PostgreSQL database configured according to the project schema
- Environment variables set (or `.env` file created)

### Installation

1. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```

2. Configure environment variables:
   - Create a `.env` file in the app directory with the following variables:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=toppharma
     DB_USER=postgres
     DB_PASSWORD=your_password
     
     # Optional: S3/MinIO configuration
     S3_BUCKET_NAME=top-pharma-data-lake
     S3_ACCESS_KEY=your_access_key
     S3_SECRET_KEY=your_secret_key
     S3_ENDPOINT_URL=http://localhost:9000
     ```

### Running Flows

#### Local Execution

You can run any flow directly using Python:

```bash
python hello_prefect.py
```

#### Using Prefect CLI

To run flows using the Prefect CLI:

1. Start the Prefect server (if not using Prefect Cloud):
   ```bash
   prefect server start
   ```

2. Build and apply a deployment:
   ```bash
   prefect deployment build hello_prefect.py:hello_prefect -n "Test Deployment" -t test
   prefect deployment apply hello_prefect-deployment.yaml
   ```

3. Start a worker:
   ```bash
   prefect worker start -p default-agent-pool
   ```

4. Run the deployment:
   ```bash
   prefect deployment run "hello_prefect/Test Deployment"
   ```

### Scheduling Flows

To schedule a flow to run automatically:

```bash
prefect deployment build hello_prefect.py:hello_prefect -n "Scheduled Test" --cron "0 0 * * *"
prefect deployment apply hello_prefect-deployment.yaml
```

This will run the flow every day at midnight.

## Development Guidelines

When creating new flows:

1. Follow the pattern established in existing flows
2. Use the `@task` decorator for each discrete unit of work
3. Use the `@flow` decorator for the main orchestration function
4. Log progress at key points using `get_run_logger()`
5. Add proper exception handling and retries
6. Update this README when adding new flows 