-- schema.sql: Initial database schema for Top Pharma

-- Run with: psql -U your_username -d mytoppharma -f schema.sql

-- Core tables
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    headquarters VARCHAR(255),
    ownership_type VARCHAR(50),
    ticker_symbol VARCHAR(10),
    market_cap DECIMAL(20, 2),
    founded_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    description TEXT,
    approval_status VARCHAR(50),
    stage VARCHAR(50),
    therapeutic_area_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS therapeutic_areas (
    therapeutic_area_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- External ID tables
CREATE TABLE IF NOT EXISTS company_external_ids (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id),
    source VARCHAR(50) NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source, external_id)
);

CREATE TABLE IF NOT EXISTS product_external_ids (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    source VARCHAR(50) NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source, external_id)
);

-- Staging tables
CREATE TABLE IF NOT EXISTS staging_sec_edgar (
    id SERIAL PRIMARY KEY,
    ticker_symbol VARCHAR(10),
    company_name VARCHAR(255),
    filing_date DATE,
    filing_type VARCHAR(10),
    headquarters VARCHAR(255),
    revenue DECIMAL(20, 2),
    net_income DECIMAL(20, 2),
    raw_data JSONB,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staging_opencorporates (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    registration_number VARCHAR(100),
    jurisdiction VARCHAR(100),
    address TEXT,
    incorporation_date DATE,
    company_type VARCHAR(100),
    raw_data JSONB,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staging_fda_drugs (
    id SERIAL PRIMARY KEY,
    application_number VARCHAR(50),
    brand_name VARCHAR(255),
    generic_name VARCHAR(255),
    applicant VARCHAR(255),
    approval_date DATE,
    raw_data JSONB,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staging_clinicaltrials (
    id SERIAL PRIMARY KEY,
    nct_id VARCHAR(20),
    study_title TEXT,
    sponsor VARCHAR(255),
    phase VARCHAR(50),
    intervention_name VARCHAR(255),
    status VARCHAR(50),
    condition TEXT,
    raw_data JSONB,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pipeline logging table
CREATE TABLE IF NOT EXISTS pipeline_run_logs (
    id SERIAL PRIMARY KEY,
    flow_name VARCHAR(100) NOT NULL,
    run_id VARCHAR(100),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(50),
    records_processed INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_ticker ON companies(ticker_symbol);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_ta_id ON products(therapeutic_area_id);
CREATE INDEX IF NOT EXISTS idx_company_external_ids_company_id ON company_external_ids(company_id);
CREATE INDEX IF NOT EXISTS idx_product_external_ids_product_id ON product_external_ids(product_id); 