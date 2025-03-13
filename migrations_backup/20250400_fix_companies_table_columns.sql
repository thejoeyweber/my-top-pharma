-- Migration: fix_companies_table_columns
-- Description: Ensures consistent column naming between ticker and stock_symbol
-- Author: Claude 3.7 Sonnet
-- Date: 2025-04-00

-- Forward Migration
BEGIN;

-- Check if the stock_symbol column exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'stock_symbol'
    ) THEN
        -- Check if ticker column doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'companies' AND column_name = 'ticker'
        ) THEN
            -- Add ticker column if it doesn't exist
            ALTER TABLE public.companies ADD COLUMN ticker VARCHAR(10);
            
            -- Copy data from stock_symbol to ticker
            UPDATE public.companies SET ticker = stock_symbol WHERE stock_symbol IS NOT NULL;
        END IF;
    END IF;
END $$;

-- Create conditional index on ticker column if it doesn't exist
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'ticker'
    ) AND NOT EXISTS (
        SELECT FROM pg_indexes 
        WHERE tablename = 'companies' AND indexname = 'idx_companies_ticker'
    ) THEN
        -- Create index on ticker for faster lookups
        CREATE INDEX idx_companies_ticker ON public.companies(ticker);
    END IF;
END $$;

-- Ensure the companies table has the active column required by FMP migrations
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'active'
    ) THEN
        ALTER TABLE public.companies ADD COLUMN active BOOLEAN DEFAULT true;
    END IF;
END $$;

COMMIT;

-- Rollback Migration
-- BEGIN;
-- No direct rollback needed as we're just adding a column and ensuring compatibility
-- COMMIT; 