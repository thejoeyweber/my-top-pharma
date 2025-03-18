-- Rename columns for frontend consistency
BEGIN;

-- Rename stock_symbol to ticker_symbol in companies table
ALTER TABLE companies 
  RENAME COLUMN stock_symbol TO ticker_symbol;

COMMIT; 