-- Core tables
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ticker_symbol VARCHAR(10),
    description TEXT,
    headquarters VARCHAR(255),
    ownership_type VARCHAR(50),
    founded_date DATE,
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS therapeutic_areas (
    ta_id SERIAL PRIMARY KEY,
    ta_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id),
    ta_id INTEGER REFERENCES therapeutic_areas(ta_id),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    approval_status VARCHAR(50),
    approval_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- External identifiers
CREATE TABLE IF NOT EXISTS company_external_ids (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id),
    source VARCHAR(50) NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source, external_id)
);

CREATE TABLE IF NOT EXISTS product_external_ids (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    source VARCHAR(50) NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source, external_id)
);

-- Staging tables
CREATE TABLE IF NOT EXISTS staging_sec_edgar (
    id SERIAL PRIMARY KEY,
    ticker_symbol VARCHAR(10) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    filing_date DATE NOT NULL,
    cik VARCHAR(20),
    fiscal_year_end DATE,
    headquarters VARCHAR(255),
    revenue NUMERIC,
    net_income NUMERIC,
    raw_data_path VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staging_opencorporates (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    jurisdiction VARCHAR(50),
    registration_number VARCHAR(100),
    incorporation_date DATE,
    company_type VARCHAR(100),
    headquarters VARCHAR(255),
    raw_data_path VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staging_fda_drugs (
    id SERIAL PRIMARY KEY,
    application_number VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    active_ingredient VARCHAR(255),
    applicant VARCHAR(255),
    approval_date DATE,
    raw_data_path VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staging_clinicaltrials (
    id SERIAL PRIMARY KEY,
    nct_id VARCHAR(20) NOT NULL,
    title VARCHAR(500) NOT NULL,
    sponsor VARCHAR(255),
    phase VARCHAR(50),
    intervention_name VARCHAR(255),
    condition VARCHAR(255),
    status VARCHAR(50),
    start_date DATE,
    completion_date DATE,
    raw_data_path VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pipeline run logs
CREATE TABLE IF NOT EXISTS pipeline_run_logs (
    id SERIAL PRIMARY KEY,
    flow_name VARCHAR(100) NOT NULL,
    run_id VARCHAR(100),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL,
    records_processed INTEGER DEFAULT 0,
    records_succeeded INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_company_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_company_ticker ON companies(ticker_symbol);
CREATE INDEX IF NOT EXISTS idx_product_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_staging_sec_edgar_ticker ON staging_sec_edgar(ticker_symbol);
CREATE INDEX IF NOT EXISTS idx_company_external_ids_source_id ON company_external_ids(source, external_id);