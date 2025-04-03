-- Create staging schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS staging;

-- Create table for raw SEC EDGAR company data
CREATE TABLE IF NOT EXISTS staging.sec_edgar_companies (
    id BIGSERIAL PRIMARY KEY,
    cik TEXT NOT NULL,
    entity_name TEXT,
    ticker TEXT,
    sic TEXT,
    sic_description TEXT,
    category TEXT,
    exchange TEXT,
    state_of_incorporation TEXT,
    fiscal_year_end TEXT,
    filing_date TIMESTAMPTZ,
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_sec_edgar_companies_cik ON staging.sec_edgar_companies(cik);
CREATE INDEX IF NOT EXISTS idx_sec_edgar_companies_ticker ON staging.sec_edgar_companies(ticker);
CREATE INDEX IF NOT EXISTS idx_sec_edgar_companies_sic ON staging.sec_edgar_companies(sic);
CREATE INDEX IF NOT EXISTS idx_sec_edgar_companies_filing_date ON staging.sec_edgar_companies(filing_date);

-- Create a view for biotech/pharma companies (SIC codes 2834 and 2836)
CREATE OR REPLACE VIEW staging.sec_edgar_biotech_pharma_companies AS
SELECT *
FROM staging.sec_edgar_companies
WHERE sic IN ('2834', '2836');

-- Grant permissions to authenticated users (for web application access)
GRANT USAGE ON SCHEMA staging TO authenticated;
GRANT SELECT ON staging.sec_edgar_biotech_pharma_companies TO authenticated;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION staging.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to keep updated_at current
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON staging.sec_edgar_companies
FOR EACH ROW
EXECUTE FUNCTION staging.set_updated_at();

-- Comment on tables and columns for documentation
COMMENT ON TABLE staging.sec_edgar_companies IS 'Staging table for SEC EDGAR company data ingested via Airbyte';
COMMENT ON COLUMN staging.sec_edgar_companies.cik IS 'SEC Central Index Key (CIK) - unique identifier for companies';
COMMENT ON COLUMN staging.sec_edgar_companies.sic IS 'Standard Industrial Classification (SIC) code';
COMMENT ON COLUMN staging.sec_edgar_companies.raw_data IS 'Complete JSON data from SEC API response';
COMMENT ON VIEW staging.sec_edgar_biotech_pharma_companies IS 'Filtered view of biotech/pharma companies (SIC codes 2834 and 2836)';
