/**
 * Database Push Script
 * 
 * This script uses the Supabase CLI to push database changes from local migrations
 * to your Supabase project. It handles authenticating with Supabase if needed
 * and displays helpful error messages.
 * 
 * Usage:
 * node scripts/db-push.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get proper __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_DIR = path.join(__dirname, '../supabase');
const MIGRATIONS_DIR = path.join(SUPABASE_DIR, 'migrations');

console.log('Working directory:', process.cwd());
console.log('SUPABASE_DIR:', SUPABASE_DIR);
console.log('MIGRATIONS_DIR:', MIGRATIONS_DIR);

// Verify migrations directory exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  console.error(`Error: Migrations directory not found at: ${MIGRATIONS_DIR}`);
  process.exit(1);
}

// Count migrations
const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).filter(file => file.endsWith('.sql'));
if (migrationFiles.length === 0) {
  console.error('No migration files found. Create migrations first with:');
  console.error('npm run create-migration <migration-name>');
  process.exit(1);
}

console.log(`Found ${migrationFiles.length} migration files to apply:`);
migrationFiles.forEach(file => console.log(`- ${file}`));

try {
  // Check if Supabase CLI is installed
  try {
    const versionOutput = execSync('npx supabase --version', { stdio: 'pipe', encoding: 'utf8' });
    console.log('Supabase CLI version:', versionOutput.trim());
  } catch (error) {
    console.log('Supabase CLI not found. Installing...');
    execSync('npm install -g supabase', { stdio: 'inherit' });
  }

  // Check if the project is linked
  try {
    console.log('Checking if project is linked...');
    execSync('npx supabase status', { stdio: 'pipe' });
    console.log('Project is linked to Supabase.');
  } catch (error) {
    console.log('Project is not linked to Supabase, attempting to link...');
    
    // Get the project ID from environment variable or use default
    const projectId = process.env.SUPABASE_PROJECT_ID || 'teycvirevxhmuaurroxm';
    
    try {
      console.log(`Linking to project ${projectId}...`);
      execSync(`npx supabase link --project-ref ${projectId}`, { 
        stdio: 'inherit',
        cwd: process.cwd() 
      });
    } catch (linkError) {
      console.error('Failed to link project:');
      console.error(linkError.message);
      process.exit(1);
    }
  }

  // Apply migrations with --include-all flag
  console.log('Pushing migrations to Supabase...');
  try {
    // Use include-all flag to apply migrations regardless of timestamp
    execSync('npx supabase db push --include-all', { 
      stdio: 'inherit',
      cwd: process.cwd() 
    });
    
    console.log('✅ Database migrations successfully applied!');
  } catch (error) {
    console.error('Error pushing migrations:');
    console.error(error.message);
    
    console.log('\nPlease try running the command manually:');
    console.log('npx supabase db push --include-all');
    process.exit(1);
  }
} catch (error) {
  console.error('Unexpected error:');
  console.error(error.message);
  process.exit(1);
} 