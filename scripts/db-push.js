/**
 * Database Push Script
 * 
 * This script uses the Supabase CLI to push database changes from local migrations
 * to your Supabase project. It handles authenticating with Supabase if needed
 * and displays helpful error messages.
 * 
 * Usage:
 * node scripts/db-push.js [--no-include-all]
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import util from 'util';

// Convert exec to Promise-based
const execAsync = util.promisify(exec);

// Get proper __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_DIR = path.join(__dirname, '../supabase');
const MIGRATIONS_DIR = path.join(SUPABASE_DIR, 'migrations');

// Parse command line arguments
const args = process.argv.slice(2);
const noIncludeAll = args.includes('--no-include-all');

// Main async function
async function pushMigrations() {
  try {
    console.log('Working directory:', process.cwd());
    console.log('SUPABASE_DIR:', SUPABASE_DIR);
    console.log('MIGRATIONS_DIR:', MIGRATIONS_DIR);

    // Verify migrations directory exists
    try {
      await fs.access(MIGRATIONS_DIR);
    } catch (err) {
      console.error(`Error: Migrations directory not found at: ${MIGRATIONS_DIR}`);
      process.exit(1);
    }

    // Count migrations
    const migrationFiles = (await fs.readdir(MIGRATIONS_DIR)).filter(file => file.endsWith('.sql'));
    if (migrationFiles.length === 0) {
      console.error('No migration files found. Create migrations first with:');
      console.error('npm run create-migration <migration-name>');
      process.exit(1);
    }

    console.log(`Found ${migrationFiles.length} migration files to apply:`);
    migrationFiles.forEach(file => console.log(`- ${file}`));

    // Check if Supabase CLI is installed
    try {
      const { stdout: versionOutput } = await execAsync('npx supabase --version');
      console.log('Supabase CLI version:', versionOutput.trim());
    } catch (error) {
      console.log('Supabase CLI not found. Installing...');
      try {
        await execAsync('npm install -g supabase');
        console.log('Supabase CLI installed successfully.');
      } catch (installError) {
        console.error('Failed to install Supabase CLI:');
        console.error(installError.message);
        process.exit(1);
      }
    }

    // Check if the project is linked
    let isLinked = false;
    try {
      console.log('Checking if project is linked...');
      await execAsync('npx supabase status');
      console.log('Project is linked to Supabase.');
      isLinked = true;
    } catch (error) {
      console.log('Project is not linked to Supabase, will attempt to link...');
    }

    // Link the project if needed
    if (!isLinked) {
      // Get the project ID from environment variable
      const projectId = process.env.SUPABASE_PROJECT_ID;
      
      if (!projectId) {
        console.error('Error: SUPABASE_PROJECT_ID environment variable is required.');
        console.error('Please set this variable in your .env file and try again.');
        process.exit(1);
      }
      
      try {
        console.log(`Linking to project ${projectId}...`);
        const { stdout, stderr } = await execAsync(`npx supabase link --project-ref ${projectId}`, { 
          cwd: process.cwd() 
        });
        
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
      } catch (linkError) {
        console.error('Failed to link project:');
        console.error(linkError.message);
        process.exit(1);
      }
    }

    // Apply migrations 
    console.log('Pushing migrations to Supabase...');
    
    // Check environment for safety
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && !noIncludeAll) {
      console.warn('⚠️ WARNING: Running with --include-all in production!');
      console.warn('This will push ALL migrations, including those already applied.');
      console.warn('This could cause data loss in a production environment.');
      console.warn('If you want to proceed, run again with the --no-include-all flag.');
      console.warn('Aborting for safety.');
      process.exit(1);
    }
    
    try {
      // Determine whether to use --include-all flag
      const useIncludeAll = !isProduction && !noIncludeAll;
      const dbPushCommand = useIncludeAll
        ? 'npx supabase db push --include-all'
        : 'npx supabase db push';
        
      console.log(`Executing: ${dbPushCommand}`);
      
      const { stdout, stderr } = await execAsync(dbPushCommand, { 
        cwd: process.cwd() 
      });
      
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      console.log('✅ Database migrations successfully applied!');
    } catch (error) {
      console.error('Error pushing migrations:');
      console.error(error.message);
      
      console.log('\nPlease try running the command manually:');
      console.log('npx supabase db push');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:');
    console.error(error.message);
    process.exit(1);
  }
}

// Execute the main function
pushMigrations(); 