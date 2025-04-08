/**
 * Database Type Generation Script
 * 
 * This script generates TypeScript types from the Supabase schema.
 * It uses the Supabase CLI to generate types and writes them to a file.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path for generated types (make sure path is relative to script location)
const outputPath = path.join(__dirname, '../src/types/database.ts');

try {
  console.log('Generating database types...');
  
  // Run the Supabase CLI to generate types and capture output
  // Add --local flag to connect to local Supabase instance
  const result = execSync('npx supabase gen types typescript --local', {
    encoding: 'utf8',
  });

  // Write the output to the types file
  fs.writeFileSync(outputPath, result);
  console.log(`✅ Database types generated successfully to ${outputPath}`);
  
  // Verify the output contains key tables
  const content = fs.readFileSync(outputPath, 'utf8');
  const requiredTables = ['companies', 'products', 'websites', 'therapeutic_areas'];
  
  const missingTables = requiredTables.filter(table => !content.includes(`${table}: {`));
  
  if (missingTables.length > 0) {
    console.warn(`⚠️ Warning: The following tables might be missing in the generated types: ${missingTables.join(', ')}`);
    console.warn('Please verify the generated file and ensure all schema definitions are complete.');
  } else {
    console.log('✅ All required tables appear to be included in the generated types.');
  }
} catch (error) {
  console.error('❌ Error generating database types:');
  console.error(error.message);
  process.exit(1);
} 