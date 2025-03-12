-- Migration: {{MIGRATION_NAME}}
-- Description: [DETAILED DESCRIPTION OF WHAT THIS MIGRATION DOES]
-- Author: {{AUTHOR}}
-- Date: {{MIGRATION_DATE}}

-- Forward Migration
BEGIN;

-- Your SQL statements here
-- Examples:
-- CREATE TABLE IF NOT EXISTS table_name (...);
-- ALTER TABLE table_name ADD COLUMN column_name data_type;
-- CREATE INDEX IF NOT EXISTS idx_name ON table_name(column_name);
-- CREATE OR REPLACE FUNCTION function_name(...) ... ;

COMMIT;

-- Rollback Migration
-- BEGIN;
-- Uncomment and use this section for rolling back the migration
-- DROP TABLE IF EXISTS table_name;
-- COMMIT; 