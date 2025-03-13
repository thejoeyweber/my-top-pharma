-- Add records_skipped column to data_ingestion_logs table
ALTER TABLE public.data_ingestion_logs ADD COLUMN IF NOT EXISTS records_skipped INTEGER DEFAULT 0;
UPDATE public.data_ingestion_logs SET records_skipped = 0 WHERE records_skipped IS NULL; 