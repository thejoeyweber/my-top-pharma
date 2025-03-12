-- Migration: Create companies table
-- Description: Establishes the initial schema for storing company data from FMP and other sources

-- Create the companies table
CREATE TABLE IF NOT EXISTS companies (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  ticker        text NOT NULL,
  sector        text,
  industry      text,
  market_cap    numeric,
  cik           text,
  isin          text,
  active        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE(ticker)
);

-- Create an index on ticker for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_ticker ON companies(ticker);

-- Create an index on sector and industry for filtering
CREATE INDEX IF NOT EXISTS idx_companies_sector_industry ON companies(sector, industry);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 