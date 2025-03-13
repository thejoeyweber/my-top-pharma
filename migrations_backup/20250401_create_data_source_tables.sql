-- Migration: create_data_source_tables
-- Description: Creates tables for managing data sources and their endpoints
-- Author: Claude 3.7 Sonnet
-- Date: 2025-04-01

-- Forward Migration
BEGIN;

-- Create data_sources table
CREATE TABLE IF NOT EXISTS public.data_sources (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    base_url TEXT,
    auth_type TEXT,
    auth_key TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create data_source_endpoints table
CREATE TABLE IF NOT EXISTS public.data_source_endpoints (
    id SERIAL PRIMARY KEY,
    data_source_id INTEGER REFERENCES public.data_sources(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    endpoint_path TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    target_table TEXT NOT NULL,
    field_mapping JSONB,
    configuration JSONB,
    last_run_at TIMESTAMP WITH TIME ZONE,
    last_success_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(data_source_id, name)
);

-- Create company_financials table
CREATE TABLE IF NOT EXISTS public.company_financials (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES public.companies(id) ON DELETE CASCADE,
    period TEXT NOT NULL, -- 'annual' or 'quarterly'
    fiscal_date DATE NOT NULL,
    revenue NUMERIC,
    gross_profit NUMERIC,
    net_income NUMERIC,
    ebitda NUMERIC,
    r_and_d_expense NUMERIC,
    eps NUMERIC,
    shares_outstanding NUMERIC,
    source TEXT NOT NULL, -- e.g., 'FMP'
    source_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, period, fiscal_date)
);

-- Create company_metrics table
CREATE TABLE IF NOT EXISTS public.company_metrics (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES public.companies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    pe_ratio NUMERIC,
    pb_ratio NUMERIC,
    price_to_sales NUMERIC,
    dividend_yield NUMERIC,
    debt_to_equity NUMERIC,
    roa NUMERIC,
    roe NUMERIC,
    current_ratio NUMERIC,
    quick_ratio NUMERIC,
    source TEXT NOT NULL, -- e.g., 'FMP'
    source_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, date)
);

-- Create company_stock_data table
CREATE TABLE IF NOT EXISTS public.company_stock_data (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES public.companies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    open NUMERIC,
    high NUMERIC,
    low NUMERIC,
    close NUMERIC,
    adjusted_close NUMERIC,
    volume NUMERIC,
    source TEXT NOT NULL, -- e.g., 'FMP'
    source_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, date)
);

-- Create data_ingestion_logs table
CREATE TABLE IF NOT EXISTS public.data_ingestion_logs (
    id SERIAL PRIMARY KEY,
    data_source_id INTEGER REFERENCES public.data_sources(id),
    endpoint_id INTEGER REFERENCES public.data_source_endpoints(id),
    records_processed INTEGER,
    records_added INTEGER,
    records_updated INTEGER,
    status TEXT NOT NULL,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(endpoint_id, started_at)
);

-- Add RLS policies
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_source_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_stock_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_ingestion_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to data tables
CREATE POLICY "Allow public read access to data_sources" 
    ON public.data_sources FOR SELECT 
    USING (true);

CREATE POLICY "Allow public read access to data_source_endpoints" 
    ON public.data_source_endpoints FOR SELECT 
    USING (true);

CREATE POLICY "Allow public read access to company_financials" 
    ON public.company_financials FOR SELECT 
    USING (true);

CREATE POLICY "Allow public read access to company_metrics" 
    ON public.company_metrics FOR SELECT 
    USING (true);

CREATE POLICY "Allow public read access to company_stock_data" 
    ON public.company_stock_data FOR SELECT 
    USING (true);

CREATE POLICY "Allow public read access to data_ingestion_logs" 
    ON public.data_ingestion_logs FOR SELECT 
    USING (true);

-- Allow only authenticated users to modify data
CREATE POLICY "Allow authenticated users to insert data_sources" 
    ON public.data_sources FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update data_sources" 
    ON public.data_sources FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Similar policies for the other tables
CREATE POLICY "Allow authenticated users to insert data_source_endpoints" 
    ON public.data_source_endpoints FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update data_source_endpoints" 
    ON public.data_source_endpoints FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Create triggers to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_data_sources_updated_at
BEFORE UPDATE ON public.data_sources
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_data_source_endpoints_updated_at
BEFORE UPDATE ON public.data_source_endpoints
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_company_financials_updated_at
BEFORE UPDATE ON public.company_financials
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_company_metrics_updated_at
BEFORE UPDATE ON public.company_metrics
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_company_stock_data_updated_at
BEFORE UPDATE ON public.company_stock_data
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_data_ingestion_logs_updated_at
BEFORE UPDATE ON public.data_ingestion_logs
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_company_financials_company_id ON public.company_financials(company_id);
CREATE INDEX IF NOT EXISTS idx_company_metrics_company_id ON public.company_metrics(company_id);
CREATE INDEX IF NOT EXISTS idx_company_stock_data_company_id ON public.company_stock_data(company_id);
CREATE INDEX IF NOT EXISTS idx_data_source_endpoints_data_source_id ON public.data_source_endpoints(data_source_id);

COMMIT;

-- Rollback Migration
-- BEGIN;
-- DROP TRIGGER IF EXISTS update_data_ingestion_logs_updated_at ON public.data_ingestion_logs;
-- DROP TRIGGER IF EXISTS update_company_stock_data_updated_at ON public.company_stock_data;
-- DROP TRIGGER IF EXISTS update_company_metrics_updated_at ON public.company_metrics;
-- DROP TRIGGER IF EXISTS update_company_financials_updated_at ON public.company_financials;
-- DROP TRIGGER IF EXISTS update_data_source_endpoints_updated_at ON public.data_source_endpoints;
-- DROP TRIGGER IF EXISTS update_data_sources_updated_at ON public.data_sources;
-- DROP FUNCTION IF EXISTS update_modified_column();
-- DROP POLICY IF EXISTS "Allow authenticated users to update data_source_endpoints" ON public.data_source_endpoints;
-- DROP POLICY IF EXISTS "Allow authenticated users to insert data_source_endpoints" ON public.data_source_endpoints;
-- DROP POLICY IF EXISTS "Allow authenticated users to update data_sources" ON public.data_sources;
-- DROP POLICY IF EXISTS "Allow authenticated users to insert data_sources" ON public.data_sources;
-- DROP POLICY IF EXISTS "Allow public read access to data_ingestion_logs" ON public.data_ingestion_logs;
-- DROP POLICY IF EXISTS "Allow public read access to company_stock_data" ON public.company_stock_data;
-- DROP POLICY IF EXISTS "Allow public read access to company_metrics" ON public.company_metrics;
-- DROP POLICY IF EXISTS "Allow public read access to company_financials" ON public.company_financials;
-- DROP POLICY IF EXISTS "Allow public read access to data_source_endpoints" ON public.data_source_endpoints;
-- DROP POLICY IF EXISTS "Allow public read access to data_sources" ON public.data_sources;
-- DROP INDEX IF EXISTS idx_data_source_endpoints_data_source_id;
-- DROP INDEX IF EXISTS idx_company_stock_data_company_id;
-- DROP INDEX IF EXISTS idx_company_metrics_company_id;
-- DROP INDEX IF EXISTS idx_company_financials_company_id;
-- DROP TABLE IF EXISTS public.data_ingestion_logs;
-- DROP TABLE IF EXISTS public.company_stock_data;
-- DROP TABLE IF EXISTS public.company_metrics;
-- DROP TABLE IF EXISTS public.company_financials;
-- DROP TABLE IF EXISTS public.data_source_endpoints;
-- DROP TABLE IF EXISTS public.data_sources;
-- COMMIT; 