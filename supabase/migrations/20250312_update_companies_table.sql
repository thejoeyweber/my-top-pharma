-- Migration: Update companies table
-- Description: Fixes the discrepancy between code expectations and actual schema

-- Check if the 'active' column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'active'
    ) THEN
        ALTER TABLE companies ADD COLUMN active boolean DEFAULT true;
    END IF;
END $$;

-- Check if the 'ticker' column exists, if not add it and fill from stock_symbol
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'ticker'
    ) THEN
        ALTER TABLE companies ADD COLUMN ticker text;
        
        -- Update ticker based on stock_symbol for existing records
        UPDATE companies SET ticker = stock_symbol WHERE stock_symbol IS NOT NULL;
        
        -- Add a unique index on ticker
        CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_ticker ON companies(ticker) 
        WHERE ticker IS NOT NULL;
    END IF;
END $$; 