/**
 * Direct Database Type Generation Script
 * 
 * This script uses the Supabase CLI directly to generate TypeScript types
 * from the database schema.
 * 
 * It addresses issues with path resolution and ES modules in the original script.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Define paths
const TYPES_DIR = path.join(process.cwd(), 'src', 'types');
const OUTPUT_FILE = path.join(TYPES_DIR, 'database.ts');

// Ensure the types directory exists
if (!fs.existsSync(TYPES_DIR)) {
  fs.mkdirSync(TYPES_DIR, { recursive: true });
}

// Generate the database types using Supabase CLI
try {
  console.log('Generating database types...');
  
  // Execute the Supabase CLI command to generate types
  const output = execSync('npx supabase gen types typescript --local', { encoding: 'utf-8' });
  
  // Write the generated types to the output file
  fs.writeFileSync(OUTPUT_FILE, output);
  
  console.log(`Database types generated successfully at ${OUTPUT_FILE}`);
} catch (error) {
  console.error('Error generating database types:');
  console.error(error);
  process.exit(1);
} 