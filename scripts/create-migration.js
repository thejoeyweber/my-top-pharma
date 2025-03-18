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

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get proper __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main async function
async function createMigration() {
  try {
    // Get migration name from command line arguments
    const migrationName = process.argv[2];

    if (!migrationName) {
      console.error('Error: Migration name is required');
      console.log('Usage: node scripts/create-migration.js your_migration_name');
      process.exit(1);
    }

    // Format the migration name
    const formattedName = migrationName.toLowerCase().replace(/\s+/g, '_');

    // Create timestamp (YYYYMMDDHHMMSS format)
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    // Define paths
    const templatePath = path.join(__dirname, '../supabase/templates/migration_template.sql');
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const newMigrationPath = path.join(migrationsDir, `${timestamp}_${formattedName}.sql`);

    // Check if migrations directory exists, create if not
    try {
      await fs.mkdir(migrationsDir, { recursive: true });
      console.log(`Ensured migrations directory exists: ${migrationsDir}`);
    } catch (err) {
      console.error(`Error creating migrations directory: ${err.message}`);
      process.exit(1);
    }

    // Check if migration file already exists
    try {
      await fs.access(newMigrationPath);
      console.error(`Error: Migration file already exists: ${newMigrationPath}`);
      process.exit(1);
    } catch (err) {
      // File doesn't exist, which is what we want
    }

    // Check if template exists - required, no fallback
    try {
      await fs.access(templatePath);
    } catch (err) {
      console.error(`Error: Template file not found at: ${templatePath}`);
      console.error(`Please create a template file at ${templatePath} before creating migrations.`);
      process.exit(1);
    }

    // Read template content and replace placeholders
    let templateContent = await fs.readFile(templatePath, 'utf8');
    
    // Replace placeholders in template
    templateContent = templateContent
      .replace(/\{\{MIGRATION_NAME\}\}/g, formattedName)
      .replace(/\{\{MIGRATION_DATE\}\}/g, now.toISOString())
      .replace(/\{\{AUTHOR\}\}/g, process.env.USER || 'database admin');

    // Write the new migration file
    await fs.writeFile(newMigrationPath, templateContent);
    console.log(`✅ Created new migration file: ${newMigrationPath}`);
  } catch (err) {
    console.error(`Error creating migration file: ${err.message}`);
    process.exit(1);
  }
}

// Execute the main function
createMigration(); 