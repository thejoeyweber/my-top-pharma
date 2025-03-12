import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Initialize Supabase client
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    const migrationFile = path.join(process.cwd(), 'supabase', 'migrations', '20250312_update_companies_table.sql');
    console.log(`Reading migration file: ${migrationFile}`);
    
    if (!fs.existsSync(migrationFile)) {
      console.error(`Migration file not found: ${migrationFile}`);
      process.exit(1);
    }
    
    const sql = fs.readFileSync(migrationFile, 'utf8');
    console.log('Migration SQL:');
    console.log(sql);
    
    console.log('Running migration...');
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error running migration:', error);
      
      // Try alternative approach if RPC fails
      console.log('Trying alternative approach with direct SQL...');
      const { error: directError } = await supabase.rpc('pg_query', { query: sql });
      
      if (directError) {
        console.error('Direct SQL approach failed:', directError);
        process.exit(1);
      } else {
        console.log('Migration completed successfully using direct SQL!');
      }
    } else {
      console.log('Migration completed successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

runMigration().catch(console.error); 