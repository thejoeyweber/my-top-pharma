/**
 * Create Migration Script
 * 
 * This script creates a new migration file in the supabase/migrations directory with a timestamp
 * prefix and the provided name. It copies content from the template file to maintain consistency.
 * 
 * Usage:
 * node scripts/create-migration.js your_migration_name
 * 
 * Example:
 * node scripts/create-migration.js create_users_table
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get proper __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get migration name from command line arguments
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: Migration name is required');
  console.log('Usage: node scripts/create-migration.js your_migration_name');
  process.exit(1);
}

// Format the migration name
const formattedName = migrationName.toLowerCase().replace(/\s+/g, '_');

// Create timestamp (YYYYMMDD format)
const now = new Date();
const timestamp = now.getFullYear().toString() +
  (now.getMonth() + 1).toString().padStart(2, '0') +
  now.getDate().toString().padStart(2, '0');

// Define paths
const templatePath = path.join(__dirname, '../supabase/templates/migration_template.sql');
const migrationsDir = path.join(__dirname, '../supabase/migrations');
const newMigrationPath = path.join(migrationsDir, `${timestamp}_${formattedName}.sql`);

// Check if migrations directory exists, create if not
if (!fs.existsSync(migrationsDir)) {
  try {
    fs.mkdirSync(migrationsDir, { recursive: true });
    console.log(`Created migrations directory: ${migrationsDir}`);
  } catch (err) {
    console.error(`Error creating migrations directory: ${err.message}`);
    process.exit(1);
  }
}

// Check if migration file already exists
if (fs.existsSync(newMigrationPath)) {
  console.error(`Error: Migration file already exists: ${newMigrationPath}`);
  process.exit(1);
}

// Check if template exists
if (!fs.existsSync(templatePath)) {
  console.error(`Error: Template file not found at: ${templatePath}`);
  console.log('Creating a basic template instead...');
  
  // Create a basic template content
  const basicTemplate = `-- Migration: ${formattedName}
-- Created at: ${now.toISOString()}

-- Write your migration SQL here
BEGIN;

-- Add your SQL here

COMMIT;

-- Rollback SQL
-- BEGIN;
-- -- Add your rollback SQL here
-- ROLLBACK;
`;

  try {
    fs.writeFileSync(newMigrationPath, basicTemplate);
    console.log(`Created new migration file: ${newMigrationPath}`);
    process.exit(0);
  } catch (err) {
    console.error(`Error creating migration file: ${err.message}`);
    process.exit(1);
  }
}

// Read template content and replace placeholders
try {
  let templateContent = fs.readFileSync(templatePath, 'utf8');
  
  // Replace placeholders in template
  templateContent = templateContent
    .replace(/\{\{MIGRATION_NAME\}\}/g, formattedName)
    .replace(/\{\{MIGRATION_DATE\}\}/g, now.toISOString())
    .replace(/\{\{AUTHOR\}\}/g, process.env.USER || 'database admin');

  // Write the new migration file
  fs.writeFileSync(newMigrationPath, templateContent);
  console.log(`Created new migration file: ${newMigrationPath}`);
} catch (err) {
  console.error(`Error creating migration file: ${err.message}`);
  process.exit(1);
} 