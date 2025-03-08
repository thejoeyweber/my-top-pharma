/**
 * Convert All Data
 * 
 * This script runs all conversion scripts to convert TS data files to JSON
 * and extract SVGs to separate files.
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptsToRun = [
  'convertCompanies.js',
  'convertProducts.js',
  'convertWebsites.js',
  'convertAdmin.js',
  'convertUser.js'
];

console.log('Starting data conversion process...');

// Run scripts sequentially to avoid potential conflicts
(async function runScripts() {
  for (const script of scriptsToRun) {
    const scriptPath = path.join(__dirname, script);
    console.log(`\nRunning ${script}...`);
    
    try {
      await new Promise((resolve, reject) => {
        // Use exec to run the script
        exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing ${script}:`, error.message);
            reject(error);
            return;
          }
          
          if (stderr) {
            console.error(`${script} stderr:`, stderr);
          }
          
          console.log(stdout);
          resolve();
        });
      });
      
      console.log(`${script} completed successfully.`);
    } catch (error) {
      console.error(`Failed to run ${script}:`, error);
      process.exit(1);
    }
  }
  
  console.log('\nAll data conversion completed successfully!');
  console.log('Data files are now in JSON format in src/data/json/');
  console.log('SVGs have been extracted to src/data/assets/');
})(); 