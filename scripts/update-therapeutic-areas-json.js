/**
 * Update Therapeutic Areas in JSON Files
 * 
 * This script updates the therapeutic area references in companies.json and products.json
 * to use the new HPTCS codes instead of slugs.
 * 
 * Usage:
 *   node scripts/update-therapeutic-areas-json.js
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

// Backup file paths
const COMPANIES_BACKUP_PATH = path.join(__dirname, '../src/data/json/companies_backup.json');
const PRODUCTS_BACKUP_PATH = path.join(__dirname, '../src/data/json/products_backup.json');

/**
 * Create mappings from old IDs and slugs to HPTCS codes
 */
function createMappings() {
  console.log('Creating mappings to HPTCS codes...');
  
  // Read therapeutic areas file
  const therapeuticAreasRaw = fs.readFileSync(THERAPEUTIC_AREAS_PATH, 'utf8');
  const therapeuticAreas = JSON.parse(therapeuticAreasRaw);
  
  // Create mappings
  const slugToIdMap = new Map();
  const oldIdToNewIdMap = new Map();
  
  // Define mapping from old IDs to new HPTCS codes
  const legacyMapping = {
    'oncology': '207RO0000X',
    'immunology': '207RI0011X',
    'neuroscience': '2084N0400X',
    'cardiovascular': '207RC0000X',
    'infectious-diseases': '207RI0200X',
    'vaccines': '2080I0204X',
    'rare-diseases': '207RS0012X',
    'metabolic-disorders': '207RE0101X',
    'respiratory': '207RP0002X',
    'hematology': '207RH0000X',
    'ophthalmology': '207W00000X',
    'inflammation': '207RI0011X', // Map inflammation to immunology
    'autoimmunity': '207RI0011X', // Map autoimmunity to immunology
    'renal': '207RN0300X', // Map renal to nephrology
    'metabolic': '207RE0101X', // Map metabolic to endocrinology
    'pain': '208VP0014X', // Map pain to pain management
    'dermatology': '208D00000X',
    'gastroenterology': '207RG0100X',
    'psychiatry': '207T00000X',
    'nephrology': '207RN0300X'
  };
  
  // Add mappings from therapeutic areas JSON
  therapeuticAreas.forEach(area => {
    slugToIdMap.set(area.slug, area.id);
    
    // If this is a known legacy ID, map it to the new HPTCS code
    if (legacyMapping[area.slug]) {
      oldIdToNewIdMap.set(area.slug, area.id);
    }
  });
  
  // Add additional legacy mappings
  Object.entries(legacyMapping).forEach(([oldId, newId]) => {
    oldIdToNewIdMap.set(oldId, newId);
  });
  
  console.log(`Created mappings for ${slugToIdMap.size} therapeutic areas and ${oldIdToNewIdMap.size} legacy IDs.`);
  return { slugToIdMap, oldIdToNewIdMap };
}

/**
 * Create backup of original JSON files
 */
function createBackups() {
  console.log('Creating backups of original JSON files...');
  
  // Copy companies.json to backup
  fs.copyFileSync(COMPANIES_PATH, COMPANIES_BACKUP_PATH);
  
  // Copy products.json to backup
  fs.copyFileSync(PRODUCTS_PATH, PRODUCTS_BACKUP_PATH);
  
  console.log('Backups created successfully.');
}

/**
 * Update companies.json with HPTCS codes
 */
function updateCompaniesJson(mappings) {
  console.log('Updating companies.json with HPTCS codes...');
  const { slugToIdMap, oldIdToNewIdMap } = mappings;
  
  // Read companies file
  const companiesRaw = fs.readFileSync(COMPANIES_PATH, 'utf8');
  const companies = JSON.parse(companiesRaw);
  
  // Keep track of missing mappings
  const missingMappings = new Set();
  
  // Update therapeutic areas in each company
  companies.forEach(company => {
    if (company.therapeuticAreas && Array.isArray(company.therapeuticAreas)) {
      // Track original and updated areas
      const originalAreas = [...company.therapeuticAreas];
      
      // Convert old IDs to HPTCS codes
      company.therapeuticAreas = company.therapeuticAreas.map(oldId => {
        // If it's already an HPTCS code (starts with a number), keep it
        if (/^\d/.test(oldId)) {
          return oldId;
        }
        
        // Try to map using the old ID to new ID mapping
        const newId = oldIdToNewIdMap.get(oldId);
        if (!newId) {
          missingMappings.add(oldId);
          return oldId; // Keep original if no mapping found
        }
        return newId;
      });
      
      // Log changes for this company
      console.log(`Updated ${company.name}: ${originalAreas.join(', ')} -> ${company.therapeuticAreas.join(', ')}`);
    }
  });
  
  // Log any missing mappings
  if (missingMappings.size > 0) {
    console.warn(`Warning: ${missingMappings.size} therapeutic areas could not be mapped:`);
    missingMappings.forEach(oldId => console.warn(`  - ${oldId}`));
  }
  
  // Write updated companies file
  fs.writeFileSync(COMPANIES_PATH, JSON.stringify(companies, null, 2));
  console.log(`Updated ${companies.length} companies in companies.json.`);
}

/**
 * Update products.json with HPTCS codes
 */
function updateProductsJson(mappings) {
  console.log('Updating products.json with HPTCS codes...');
  const { slugToIdMap, oldIdToNewIdMap } = mappings;
  
  // Read products file
  const productsRaw = fs.readFileSync(PRODUCTS_PATH, 'utf8');
  const products = JSON.parse(productsRaw);
  
  // Keep track of missing mappings
  const missingMappings = new Set();
  
  // Update therapeutic areas in each product
  products.forEach(product => {
    if (product.therapeuticAreas && Array.isArray(product.therapeuticAreas)) {
      // Track original and updated areas
      const originalAreas = [...product.therapeuticAreas];
      
      // Convert old IDs to HPTCS codes
      product.therapeuticAreas = product.therapeuticAreas.map(oldId => {
        // If it's already an HPTCS code (starts with a number), keep it
        if (/^\d/.test(oldId)) {
          return oldId;
        }
        
        // Try to map using the old ID to new ID mapping
        const newId = oldIdToNewIdMap.get(oldId);
        if (!newId) {
          missingMappings.add(oldId);
          return oldId; // Keep original if no mapping found
        }
        return newId;
      });
      
      // Log changes for this product
      console.log(`Updated ${product.name}: ${originalAreas.join(', ')} -> ${product.therapeuticAreas.join(', ')}`);
    }
  });
  
  // Log any missing mappings
  if (missingMappings.size > 0) {
    console.warn(`Warning: ${missingMappings.size} therapeutic areas could not be mapped:`);
    missingMappings.forEach(oldId => console.warn(`  - ${oldId}`));
  }
  
  // Write updated products file
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
  console.log(`Updated ${products.length} products in products.json.`);
}

/**
 * Main execution function
 */
function main() {
  try {
    // Create backups first
    createBackups();
    
    // Create mappings
    const mappings = createMappings();
    
    // Update companies.json
    updateCompaniesJson(mappings);
    
    // Update products.json
    updateProductsJson(mappings);
    
    console.log('Therapeutic area update completed successfully.');
  } catch (error) {
    console.error('Update failed:', error);
    console.log('Please restore from backups if needed.');
    process.exit(1);
  }
}

// Run the script
main(); 