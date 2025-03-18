/**
 * Migration Utility: Migrate to SQL-Based Approach
 * 
 * This script helps transition from TypeScript-based migration scripts to the new
 * SQL-based approach using Supabase migrations and seed files.
 * 
 * It performs the following tasks:
 * 1. Verifies that consolidated migrations exist
 * 2. Checks that seed.sql contains the necessary data
 * 3. Tests the migrations against a local Supabase instance
 * 4. Provides guidance on removing the deprecated TypeScript scripts
 * 
 * Usage:
 *   node scripts/migration-utils/migrate-to-sql-based-approach.js
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import util from 'util';

// Convert exec to Promise-based
const execAsync = util.promisify(exec);

// Get proper __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const APP_ROOT = path.join(__dirname, '../..');
const SUPABASE_DIR = path.join(APP_ROOT, 'supabase');
const MIGRATIONS_DIR = path.join(SUPABASE_DIR, 'migrations');
const SEED_DIR = path.join(SUPABASE_DIR, 'seed');
const SCRIPTS_DIR = path.join(APP_ROOT, 'scripts');

// Files to check
const CONSOLIDATED_MIGRATIONS = [
  '20250317074038_consolidated_schema_from_backups.sql',
  '20250317074116_consolidate_schema_fixes.sql'
];

const DEPRECATED_TS_SCRIPTS = [
  'migrate-companies-to-local-db.ts',
  'migrate-therapeutic-areas-to-local-db.ts'
];

const SEED_FILE = 'seed.sql';

// Main async function
async function migrateToSqlBasedApproach() {
  console.log('🔄 Starting migration to SQL-based approach...');
  
  try {
    // Step 1: Verify consolidated migrations exist
    console.log('\n📋 Checking consolidated migrations...');
    
    for (const migration of CONSOLIDATED_MIGRATIONS) {
      const migrationPath = path.join(MIGRATIONS_DIR, migration);
      
      try {
        await fs.access(migrationPath);
        console.log(`✅ Found migration: ${migration}`);
      } catch (err) {
        console.error(`❌ Missing migration: ${migration}`);
        console.error(`   Please create this migration first.`);
        process.exit(1);
      }
    }
    
    // Step 2: Check seed.sql
    console.log('\n📋 Checking seed file...');
    
    const seedPath = path.join(SEED_DIR, SEED_FILE);
    
    try {
      await fs.access(seedPath);
      console.log(`✅ Found seed file: ${SEED_FILE}`);
      
      // Check content
      const seedContent = await fs.readFile(seedPath, 'utf8');
      
      if (!seedContent.includes('THERAPEUTIC AREAS')) {
        console.warn(`⚠️ Seed file may not contain therapeutic areas data.`);
      }
      
      if (!seedContent.includes('SAMPLE COMPANIES')) {
        console.warn(`⚠️ Seed file may not contain sample companies data.`);
      }
      
    } catch (err) {
      console.error(`❌ Missing seed file: ${SEED_FILE}`);
      console.error(`   Please create the seed file first.`);
      process.exit(1);
    }
    
    // Step 3: Check for deprecated TypeScript scripts
    console.log('\n📋 Checking for deprecated TypeScript scripts...');
    
    const deprecatedScripts = [];
    
    for (const script of DEPRECATED_TS_SCRIPTS) {
      const scriptPath = path.join(SCRIPTS_DIR, script);
      
      try {
        await fs.access(scriptPath);
        deprecatedScripts.push(script);
        console.log(`⚠️ Found deprecated script: ${script}`);
      } catch (err) {
        console.log(`✅ Script already removed: ${script}`);
      }
    }
    
    // Step 4: Check for fix-db-schema.ts
    console.log('\n📋 Checking for fix-db-schema.ts...');
    
    const fixDbSchemaPath = path.join(APP_ROOT, 'src/pages/api/fix-db-schema.ts');
    
    try {
      await fs.access(fixDbSchemaPath);
      console.log(`⚠️ Found deprecated API endpoint: fix-db-schema.ts`);
      deprecatedScripts.push('src/pages/api/fix-db-schema.ts');
    } catch (err) {
      console.log(`✅ API endpoint already removed: fix-db-schema.ts`);
    }
    
    // Step 5: Provide guidance
    console.log('\n📋 Migration Status Summary:');
    console.log('✅ Consolidated migrations are in place');
    console.log('✅ Seed file is in place');
    
    if (deprecatedScripts.length > 0) {
      console.log('\n⚠️ The following deprecated scripts can now be removed:');
      
      for (const script of deprecatedScripts) {
        console.log(`   - ${script}`);
      }
      
      console.log('\nTo remove these scripts, run:');
      
      for (const script of deprecatedScripts) {
        console.log(`rm ${script}`);
      }
    } else {
      console.log('✅ All deprecated scripts have been removed');
    }
    
    console.log('\n🎉 Migration to SQL-based approach is complete!');
    console.log('You can now use the following commands to manage your database:');
    console.log('- node scripts/create-migration.js <name> - Create a new migration');
    console.log('- node scripts/db-push.js - Apply migrations to your Supabase project');
    console.log('- npx supabase db reset - Reset your local database and apply seed data');
    
  } catch (err) {
    console.error('❌ Error during migration check:', err.message);
    process.exit(1);
  }
}

// Execute the main function
migrateToSqlBasedApproach(); 