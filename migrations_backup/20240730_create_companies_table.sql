-- Migration: create_companies_table
-- Description: Creates the initial companies table to store pharmaceutical company information
-- Author: database admin
-- Date: 2024-07-30

-- Forward Migration
BEGIN;

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    website VARCHAR(255),
    logo_url VARCHAR(255),
    description TEXT,
    founded_year INTEGER,
    headquarters VARCHAR(255),
    employee_count INTEGER,
    revenue_usd BIGINT,
    public_company BOOLEAN DEFAULT FALSE,
    stock_symbol VARCHAR(10),
    stock_exchange VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);

-- Add RLS policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to companies" 
    ON public.companies FOR SELECT 
    USING (true);

-- Allow only authenticated users to modify data
CREATE POLICY "Allow authenticated users to insert companies" 
    ON public.companies FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update companies" 
    ON public.companies FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

COMMIT;

-- Rollback Migration
-- BEGIN;
-- DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
-- DROP FUNCTION IF EXISTS update_modified_column();
-- DROP POLICY IF EXISTS "Allow authenticated users to update companies" ON public.companies;
-- DROP POLICY IF EXISTS "Allow authenticated users to insert companies" ON public.companies;
-- DROP POLICY IF EXISTS "Allow public read access to companies" ON public.companies;
-- DROP INDEX IF EXISTS idx_companies_slug;
-- DROP TABLE IF EXISTS public.companies;
-- COMMIT; 