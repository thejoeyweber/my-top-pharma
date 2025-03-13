-- Migration: rename_ticker_to_stock_symbol
-- Description: Renames the ticker column to stock_symbol for consistency
-- Author: Claude 3.7 Sonnet
-- Date: 2025-05-02

-- Forward Migration
BEGIN;

-- Check if the ticker column exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'ticker'
    ) THEN
        -- Check if stock_symbol column already exists
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'companies' AND column_name = 'stock_symbol'
        ) THEN
            -- If both columns exist, copy data from ticker to stock_symbol where stock_symbol is null
            UPDATE public.companies 
            SET stock_symbol = ticker 
            WHERE stock_symbol IS NULL AND ticker IS NOT NULL;
            
            -- Then drop the ticker column
            ALTER TABLE public.companies DROP COLUMN ticker;
        ELSE
            -- If only ticker exists, rename it to stock_symbol
            ALTER TABLE public.companies RENAME COLUMN ticker TO stock_symbol;
        END IF;
    END IF;
END $$;

-- Update any indexes that might reference the old column name
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM pg_indexes 
        WHERE tablename = 'companies' AND indexname = 'idx_companies_ticker'
    ) THEN
        DROP INDEX IF EXISTS idx_companies_ticker;
        
        -- Create a new index on stock_symbol if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM pg_indexes 
            WHERE tablename = 'companies' AND indexname = 'idx_companies_stock_symbol'
        ) THEN
            CREATE INDEX idx_companies_stock_symbol ON public.companies(stock_symbol);
        END IF;
    END IF;
END $$;

-- Update data_source_endpoints table to use stock_symbol instead of ticker
UPDATE public.data_source_endpoints
SET configuration = jsonb_set(configuration, '{company_id_field}', '"stock_symbol"')
WHERE configuration->>'company_id_field' = 'ticker';

COMMIT;

-- Rollback Migration (if needed)
-- BEGIN;
-- ALTER TABLE public.companies RENAME COLUMN stock_symbol TO ticker;
-- UPDATE public.data_source_endpoints
-- SET configuration = jsonb_set(configuration, '{company_id_field}', '"ticker"')
-- WHERE configuration->>'company_id_field' = 'stock_symbol';
-- COMMIT; 