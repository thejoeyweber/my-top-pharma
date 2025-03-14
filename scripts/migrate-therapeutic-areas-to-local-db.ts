/**
 * Migration Script: Import Therapeutic Areas from JSON to Local Supabase
 * 
 * This script reads the static JSON therapeutic area data and imports it into
 * the local Supabase database. It handles transformation from the JSON
 * format to the database schema.
 * 
 * Usage:
 *   npm run migrate:therapeutic-areas
 * 
 * Prerequisites:
 *   - Local Supabase instance must be running
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Create Supabase client using service role key (bypasses RLS)
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Service role key

console.log('🔐 Using Supabase URL:', supabaseUrl);
console.log('🔑 Using Supabase key type:', supabaseKey.includes('service_role') ? 'Service Role Key' : 'Anon Key');

const supabase = createClient(supabaseUrl, supabaseKey);

// Path to the static JSON file
const therapeuticAreasJsonPath = path.join(
  process.cwd(),
  'src',
  'data',
  'json',
  'therapeuticAreas.json'
);

/**
 * Main migration function
 */
async function migrateTherapeuticAreas() {
  console.log('🚀 Starting therapeutic areas migration...');
  
  try {
    // Read therapeutic areas from JSON
    console.log('📄 Reading therapeutic areas from JSON file...');
    const jsonData = fs.readFileSync(therapeuticAreasJsonPath, 'utf-8');
    const therapeuticAreas = JSON.parse(jsonData);
    
    console.log(`📊 Found ${therapeuticAreas.length} therapeutic areas in JSON file`);
    
    // Check if the table exists
    console.log('🔍 Checking if therapeutic_areas table exists...');
    try {
      const { error } = await supabase
        .from('therapeutic_areas')
        .select('id')
        .limit(1);
      
      if (error) {
        if (error.message.includes('relation "therapeutic_areas" does not exist')) {
          console.error('❌ Therapeutic areas table does not exist. Please run database migrations first.');
          process.exit(1);
        } else {
          throw error;
        }
      }
      
      console.log('✅ Therapeutic areas table exists');
    } catch (error: any) {
      console.error('❌ Error accessing database:', error.message);
      console.error('Please ensure your local Supabase instance is running and .env.local is configured correctly');
      process.exit(1);
    }
    
    // Transform and insert therapeutic areas
    console.log('🔄 Transforming and inserting therapeutic areas...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const [index, area] of therapeuticAreas.entries()) {
      const transformedArea = {
        id: parseInt(area.id, 10),
        name: area.name,
        slug: createSlug(area.name),
        description: area.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log(`⏳ Inserting area (${index + 1}/${therapeuticAreas.length}): ${area.name}`);
      
      try {
        const { data, error } = await supabase
          .from('therapeutic_areas')
          .upsert(transformedArea, { onConflict: 'id' });
        
        if (error) {
          console.error(`❌ Error inserting ${area.name}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Inserted: ${area.name}`);
          successCount++;
        }
      } catch (err: any) {
        console.error(`❌ Unexpected error for ${area.name}: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`
    ✅ Migration completed:
    - Total therapeutic areas: ${therapeuticAreas.length}
    - Successfully migrated: ${successCount}
    - Errors: ${errorCount}
    `);
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

/**
 * Create a URL-friendly slug from a name
 */
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with a single one
    .trim();
}

// Execute the migration
migrateTherapeuticAreas().then(() => {
  console.log('👋 Migration script completed');
}); 