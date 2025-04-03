-- Create staging schemas for priority data sources
CREATE SCHEMA IF NOT EXISTS staging_fmp;
CREATE SCHEMA IF NOT EXISTS staging_openfda;
CREATE SCHEMA IF NOT EXISTS staging_mesh;
CREATE SCHEMA IF NOT EXISTS staging_rxnorm;

-- Create service role for Airbyte
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'airbyte_service_role') THEN
    CREATE ROLE airbyte_service_role;
  END IF;
END
$$;

-- Grant appropriate permissions to the service role
GRANT USAGE ON SCHEMA staging_fmp TO airbyte_service_role;
GRANT USAGE ON SCHEMA staging_openfda TO airbyte_service_role;
GRANT USAGE ON SCHEMA staging_mesh TO airbyte_service_role;
GRANT USAGE ON SCHEMA staging_rxnorm TO airbyte_service_role;

-- Grant ability to create tables, write and read data in staging schemas
GRANT CREATE, USAGE ON SCHEMA staging_fmp TO airbyte_service_role;
GRANT CREATE, USAGE ON SCHEMA staging_openfda TO airbyte_service_role;
GRANT CREATE, USAGE ON SCHEMA staging_mesh TO airbyte_service_role;
GRANT CREATE, USAGE ON SCHEMA staging_rxnorm TO airbyte_service_role;

-- Set up default permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA staging_fmp GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO airbyte_service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging_openfda GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO airbyte_service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging_mesh GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO airbyte_service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging_rxnorm GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO airbyte_service_role;

-- Restrict access to the staging schemas from other roles
REVOKE ALL ON SCHEMA staging_fmp FROM PUBLIC;
REVOKE ALL ON SCHEMA staging_openfda FROM PUBLIC;
REVOKE ALL ON SCHEMA staging_mesh FROM PUBLIC;
REVOKE ALL ON SCHEMA staging_rxnorm FROM PUBLIC;

-- Enable Row Level Security on all tables in these schemas
ALTER DEFAULT PRIVILEGES IN SCHEMA staging_fmp GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging_openfda GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging_mesh GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging_rxnorm GRANT SELECT ON TABLES TO anon, authenticated;

-- Comment on schemas to document their purpose
COMMENT ON SCHEMA staging_fmp IS 'Staging schema for Financial Modeling Prep data';
COMMENT ON SCHEMA staging_openfda IS 'Staging schema for OpenFDA/Drugs@FDA data';
COMMENT ON SCHEMA staging_mesh IS 'Staging schema for MeSH (NIH) medical ontology data';
COMMENT ON SCHEMA staging_rxnorm IS 'Staging schema for RxNorm (NIH/NLM) terminology data';