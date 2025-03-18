/**
 * Import Therapeutic Areas Script
 * 
 * This script imports therapeutic areas using the TherapeuticAreaImporter.
 * It downloads and processes data from the Healthcare Provider Taxonomy Code Set 
 * to create standardized therapeutic areas in the Supabase database.
 */

import { TherapeuticAreaImporter } from '../src/utils/importUtils/TherapeuticAreaImporter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

async function main() {
  console.log('Starting therapeutic areas import process...');
  
  try {
    // Create a new importer instance
    const importer = new TherapeuticAreaImporter();
    
    // Run the import process
    await importer.import();
    
    // Log import statistics
    console.log('Import complete!');
    console.log('Statistics:', importer.getStatistics());
  } catch (error: unknown) {
    console.error('Error running therapeutic areas import:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled exception:', error);
  process.exit(1);
}); 