/**
 * Migration Utility: Merge Migrations
 * 
 * This script helps merge multiple migration files into a single consolidated file.
 * It's useful for cleaning up and organizing migrations before deploying to production.
 * 
 * Usage:
 *   node scripts/migration-utils/merge-migrations.js <output-name> <file1> <file2> ...
 * 
 * Example:
 *   node scripts/migration-utils/merge-migrations.js consolidated_schema migration1.sql migration2.sql
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get proper __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const APP_ROOT = path.join(__dirname, '../..');
const SUPABASE_DIR = path.join(APP_ROOT, 'supabase');
const MIGRATIONS_DIR = path.join(SUPABASE_DIR, 'migrations');

// Helper to format date for migration filename
function getFormattedDate() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Main function
async function mergeMigrations() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Error: Not enough arguments');
    console.log('Usage: node scripts/migration-utils/merge-migrations.js <output-name> <file1> <file2> ...');
    process.exit(1);
  }
  
  const outputName = args[0];
  const inputFiles = args.slice(1);
  
  console.log(`🔄 Merging ${inputFiles.length} migration files into ${outputName}...`);
  
  try {
    // Ensure migrations directory exists
    try {
      await fs.access(MIGRATIONS_DIR);
    } catch (err) {
      console.log(`📁 Creating migrations directory: ${MIGRATIONS_DIR}`);
      await fs.mkdir(MIGRATIONS_DIR, { recursive: true });
    }
    
    // Generate timestamp for new migration
    const timestamp = getFormattedDate();
    const outputFilename = `${timestamp}_${outputName}.sql`;
    const outputPath = path.join(MIGRATIONS_DIR, outputFilename);
    
    // Create header for new migration
    let mergedContent = `-- Consolidated migration: ${outputName}\n`;
    mergedContent += `-- Created: ${new Date().toISOString()}\n`;
    mergedContent += `-- Original files: ${inputFiles.join(', ')}\n\n`;
    
    // Add transaction wrapper
    mergedContent += `BEGIN;\n\n`;
    
    // Process each input file
    for (const inputFile of inputFiles) {
      console.log(`📄 Processing: ${inputFile}`);
      
      try {
        // Try to find the file in migrations directory first
        const migrationPath = path.join(MIGRATIONS_DIR, inputFile);
        let content;
        
        try {
          content = await fs.readFile(migrationPath, 'utf8');
        } catch (err) {
          // If not found, try as a relative or absolute path
          try {
            content = await fs.readFile(inputFile, 'utf8');
          } catch (err2) {
            console.error(`❌ Error: Could not find file: ${inputFile}`);
            process.exit(1);
          }
        }
        
        // Remove any existing transaction markers
        content = content.replace(/BEGIN;|COMMIT;/g, '');
        
        // Add file as a section
        mergedContent += `-- ==========================================\n`;
        mergedContent += `-- From file: ${inputFile}\n`;
        mergedContent += `-- ==========================================\n\n`;
        mergedContent += content.trim() + '\n\n';
        
      } catch (err) {
        console.error(`❌ Error processing ${inputFile}:`, err.message);
        process.exit(1);
      }
    }
    
    // Close transaction
    mergedContent += `COMMIT;\n`;
    
    // Write the merged file
    await fs.writeFile(outputPath, mergedContent);
    
    console.log(`✅ Successfully created merged migration: ${outputFilename}`);
    console.log(`📁 Location: ${outputPath}`);
    
  } catch (err) {
    console.error('❌ Error during migration merge:', err.message);
    process.exit(1);
  }
}

// Execute the main function
mergeMigrations(); 