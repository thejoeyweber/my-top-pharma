-- Add unique constraint on ticker_symbol in companies table
ALTER TABLE companies ADD CONSTRAINT unique_ticker_symbol UNIQUE (ticker_symbol); 