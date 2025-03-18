/**
 * Import FMP Companies Script
 * 
 * A TypeScript script that uses the FMPCompanyImporter to fetch and import
 * company data from Financial Modeling Prep (FMP) into the database.
 * 
 * Usage:
 * npx tsx scripts/import-fmp-companies.ts
 */

import 'dotenv/config';
import { FMPCompanyImporter } from '../src/utils/importUtils/FMPCompanyImporter';
import type { ImportResult } from '../src/utils/importUtils/BaseImporter';
import type { Company } from '../src/interfaces/entities/Company';

async function main() {
  try {
    console.log('Starting FMP company import process...');
    
    // Create and run the importer
    const importer = new FMPCompanyImporter();
    const result = await importer.import<Company[]>();
    
    if (!result.success) {
      console.error('Import failed:', result.error?.message);
      if (result.error?.originalError) {
        console.error('Original error:', result.error.originalError);
      }
      process.exit(1);
    }
    
    const { statistics } = result;
    
    console.log('Import completed with the following results:');
    console.log(`- ${statistics.processed} companies processed`);
    console.log(`- ${statistics.inserted} companies inserted`);
    console.log(`- ${statistics.updated} companies updated`);
    console.log(`- ${statistics.errors} errors encountered`);
    
    if (statistics.totalInDatabase) {
      console.log(`- ${statistics.totalInDatabase} total companies in database`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Import failed with uncaught exception:', error);
    process.exit(1);
  }
}

// Execute the main function
main(); 