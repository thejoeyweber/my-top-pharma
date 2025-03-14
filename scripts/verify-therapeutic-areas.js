/**
 * Verify Therapeutic Areas in JSON files
 * 
 * This script checks if all therapeutic area IDs referenced in companies.json and
 * products.json have corresponding entries in therapeuticAreas.json
 * 
 * Usage:
 *   node scripts/verify-therapeutic-areas.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const THERAPEUTIC_AREAS_PATH = path.join(__dirname, '../src/data/json/therapeuticAreas.json');
const COMPANIES_PATH = path.join(__dirname, '../src/data/json/companies.json');
const PRODUCTS_PATH = path.join(__dirname, '../src/data/json/products.json');

/**
 * Verify that therapeutic area IDs have corresponding entries
 */
function verifyTherapeuticAreas() {
  console.log('Verifying therapeutic area IDs...');
  
  // Read files
  const therapeuticAreasRaw = fs.readFileSync(THERAPEUTIC_AREAS_PATH, 'utf8');
  const companiesRaw = fs.readFileSync(COMPANIES_PATH, 'utf8');
  const productsRaw = fs.readFileSync(PRODUCTS_PATH, 'utf8');
  
  const therapeuticAreas = JSON.parse(therapeuticAreasRaw);
  const companies = JSON.parse(companiesRaw);
  const products = JSON.parse(productsRaw);
  
  // Get all valid IDs
  const validIds = new Set(therapeuticAreas.map(area => area.id));
  console.log(`Found ${validIds.size} valid therapeutic area IDs`);
  
  // Check companies
  const companyMissingIds = new Set();
  companies.forEach(company => {
    if (company.therapeuticAreas && Array.isArray(company.therapeuticAreas)) {
      company.therapeuticAreas.forEach(id => {
        if (!validIds.has(id)) {
          companyMissingIds.add(id);
          console.warn(`Warning: Company "${company.name}" has invalid therapeutic area ID: ${id}`);
        }
      });
    }
  });
  
  // Check products
  const productMissingIds = new Set();
  products.forEach(product => {
    if (product.therapeuticAreas && Array.isArray(product.therapeuticAreas)) {
      product.therapeuticAreas.forEach(id => {
        if (!validIds.has(id)) {
          productMissingIds.add(id);
          console.warn(`Warning: Product "${product.name}" has invalid therapeutic area ID: ${id}`);
        }
      });
    }
  });
  
  // Report results
  console.log(`\nVerification complete.`);
  console.log(`Found ${companyMissingIds.size} unique invalid IDs in companies.json`);
  console.log(`Found ${productMissingIds.size} unique invalid IDs in products.json`);
  
  if (companyMissingIds.size > 0 || productMissingIds.size > 0) {
    console.log('\nMissing IDs that need to be added to therapeuticAreas.json:');
    [...new Set([...companyMissingIds, ...productMissingIds])].forEach(id => {
      console.log(`  - ${id}`);
    });
  } else {
    console.log('\nAll therapeutic area IDs are valid!');
  }
}

// Run the verification
verifyTherapeuticAreas(); 