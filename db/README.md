# Top Pharma Database Schema

This directory contains the SQL schema definition for the Top Pharma application database. The schema is designed to store information about pharmaceutical companies, their products, and data ingestion pipeline status.

## Schema Structure

The database schema includes the following major components:

1. **Core Entity Tables**:
   - `companies` - Information about pharmaceutical companies
   - `products` - Products (drugs) offered by companies
   - `therapeutic_areas` - Categories of diseases/conditions

2. **External ID Mapping Tables**:
   - `company_external_ids` - Maps external system IDs to internal company IDs
   - `product_external_ids` - Maps external system IDs to internal product IDs

3. **Staging Tables** (for data ingestion):
   - `staging_sec_edgar` - SEC EDGAR financial filings data
   - `staging_opencorporates` - OpenCorporates corporate registry data
   - `staging_fda_drugs` - FDA Drugs@FDA approved drugs data
   - `staging_clinicaltrials` - ClinicalTrials.gov clinical trials data

4. **Pipeline Management**:
   - `pipeline_run_logs` - Logs for tracking data ingestion runs

## Setup Instructions

### Prerequisites

- PostgreSQL 14+ installed
- A database user with CREATE TABLE privileges

### Setup Steps

1. Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE toppharma;
   ```

2. Connect to the database:
   ```
   psql -U <your_user> -d toppharma
   ```

3. Run the schema creation scripts:
   ```
   \i schema.sql
   \i ddl/external_ids.sql
   ```

### Schema Updates

When modifying the schema, please follow these guidelines:

1. Create a new migration file in a `migrations` directory (future enhancement)
2. Update this README if adding new major components
3. Ensure all tables have appropriate indices and constraints
4. Add a comment in the SQL explaining the purpose of new tables

## Entity Relationship Diagram

An entity relationship diagram is available in the project documentation (`_docs` directory). 