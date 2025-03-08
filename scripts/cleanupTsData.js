/**
 * Cleanup TS Data Files
 * 
 * This script removes the TS data files that have been converted to JSON.
 * Run this after verifying that the JSON data files work correctly with the application.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory
const dataDir = path.join(__dirname, '../src/data');

// TS files to remove
const tsFiles = [
  'companies.ts',
  'products.ts',
  'websites.ts',
  'admin.ts',
  'user.ts'
];

console.log('Starting TS data file cleanup...');

// Count of removed files
let removedCount = 0;

// Remove each TS file
for (const file of tsFiles) {
  const filePath = path.join(dataDir, file);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${filePath}`);
      removedCount++;
    } catch (error) {
      console.error(`❌ Error removing ${filePath}:`, error.message);
    }
  } else {
    console.log(`⚠️ File not found: ${filePath}`);
  }
}

console.log(`\nCleanup completed. Removed ${removedCount} TS data files.`);
console.log(`The application now uses JSON data files exclusively through dataUtils.ts.`); 