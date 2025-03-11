-- Add missing columns to staging_sec_edgar table
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS cik VARCHAR(255);
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS ticker VARCHAR(255);
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS form_type VARCHAR(50);
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS filing_date DATE;
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS reporting_date DATE;
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS fiscal_year INTEGER;
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS headquarters VARCHAR(255);
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS revenue_millions DECIMAL;
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS net_income_millions DECIMAL;
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS assets_millions DECIMAL;
ALTER TABLE staging_sec_edgar ADD COLUMN IF NOT EXISTS liabilities_millions DECIMAL; 