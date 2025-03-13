-- Migration: Add records_skipped column to data_ingestion_logs table
-- Purpose: Track how many records were skipped during data imports due to already existing or not needing updates
-- Date: 2025-05-01

-- Add records_skipped column to data_ingestion_logs if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'data_ingestion_logs' AND column_name = 'records_skipped'
  ) THEN
    ALTER TABLE public.data_ingestion_logs ADD COLUMN records_skipped INTEGER DEFAULT 0;
    UPDATE public.data_ingestion_logs SET records_skipped = 0 WHERE records_skipped IS NULL;
    COMMENT ON COLUMN public.data_ingestion_logs.records_skipped IS 'Number of records skipped during import because they already exist or do not need updates';
  END IF;
END
$$; 