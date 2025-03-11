-- SEC EDGAR specific tables
CREATE TABLE IF NOT EXISTS sec_companies (
    id SERIAL PRIMARY KEY,
    cik VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sic VARCHAR(4),
    sic_description TEXT,
    ticker VARCHAR(10),
    exchange VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sec_filings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES sec_companies(id),
    accession_number VARCHAR(20) UNIQUE NOT NULL,
    filing_type VARCHAR(10) NOT NULL,
    filing_date DATE NOT NULL,
    reporting_date DATE,
    filing_url TEXT NOT NULL,
    extracted_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staging tables for ETL process
CREATE TABLE IF NOT EXISTS staging_sec_companies (
    cik VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sic VARCHAR(4),
    sic_description TEXT,
    ticker VARCHAR(10),
    exchange VARCHAR(20),
    source_data JSONB,
    etl_batch_id VARCHAR(36) NOT NULL
);

CREATE TABLE IF NOT EXISTS staging_sec_filings (
    accession_number VARCHAR(20) NOT NULL,
    cik VARCHAR(10) NOT NULL,
    filing_type VARCHAR(10) NOT NULL,
    filing_date DATE NOT NULL,
    reporting_date DATE,
    filing_url TEXT NOT NULL,
    extracted_data JSONB,
    etl_batch_id VARCHAR(36) NOT NULL
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_sec_companies_cik ON sec_companies(cik);
CREATE INDEX IF NOT EXISTS idx_sec_companies_ticker ON sec_companies(ticker);
CREATE INDEX IF NOT EXISTS idx_sec_companies_sic ON sec_companies(sic);
CREATE INDEX IF NOT EXISTS idx_sec_filings_company_id ON sec_filings(company_id);
CREATE INDEX IF NOT EXISTS idx_sec_filings_accession_number ON sec_filings(accession_number);
CREATE INDEX IF NOT EXISTS idx_sec_filings_filing_type ON sec_filings(filing_type);
CREATE INDEX IF NOT EXISTS idx_sec_filings_filing_date ON sec_filings(filing_date); 