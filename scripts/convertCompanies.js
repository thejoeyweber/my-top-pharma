/**
 * Convert Companies Data
 * 
 * This script converts companies.ts to companies.json and extracts SVGs
 * to separate files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const jsonDir = path.join(__dirname, '../src/data/json');
const logosDir = path.join(__dirname, '../src/data/assets/logos');

if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir, { recursive: true });
}

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Read the companies.ts file
const companiesFilePath = path.join(__dirname, '../src/data/companies.ts');
const companiesFileContent = fs.readFileSync(companiesFilePath, 'utf8');

// Extract the companies array
const companiesMatch = companiesFileContent.match(/export const companies: Company\[\] = \[([\s\S]*?)\];/);

if (!companiesMatch) {
  console.error('Could not find companies array in companies.ts');
  process.exit(1);
}

// Parse the companies array
let companiesArray;
try {
  // Replace TypeScript-specific syntax with JSON-compatible syntax
  let jsCode = '[' + companiesMatch[1]
    .replace(/\/\/.*$/gm, '') // Remove comments
    .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
  
  // Use eval in a controlled manner to convert the JS array to a JavaScript object
  // Note: In a production environment, a safer approach would be preferable
  companiesArray = eval(`(${jsCode})`);
} catch (error) {
  console.error('Error parsing companies array:', error);
  process.exit(1);
}

// Process each company
companiesArray.forEach(company => {
  // Check if the logo is an SVG string
  if (company.logoUrl && company.logoUrl.startsWith('<svg')) {
    // Extract SVG to a separate file
    const svgFileName = `${company.id}.svg`;
    const svgFilePath = path.join(logosDir, svgFileName);
    
    fs.writeFileSync(svgFilePath, company.logoUrl, 'utf8');
    
    // Update the reference in the JSON
    company.logoUrl = `/src/data/assets/logos/${svgFileName}`;
  }
});

// Extract therapeutic areas
const therapeuticAreasMatch = companiesFileContent.match(/export const therapeuticAreas: TherapeuticArea\[\] = \[([\s\S]*?)\];/);
let therapeuticAreasArray = [];

if (therapeuticAreasMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + therapeuticAreasMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    therapeuticAreasArray = eval(`(${jsCode})`);
    
    // Write the processed therapeutic areas to a JSON file
    const taOutputPath = path.join(jsonDir, 'therapeuticAreas.json');
    fs.writeFileSync(taOutputPath, JSON.stringify(therapeuticAreasArray, null, 2), 'utf8');
    
    console.log(`Therapeutic areas data converted successfully. JSON file saved to: ${taOutputPath}`);
  } catch (error) {
    console.error('Error parsing therapeutic areas array:', error);
  }
}

// Write the processed companies to a JSON file
const outputPath = path.join(jsonDir, 'companies.json');
fs.writeFileSync(outputPath, JSON.stringify(companiesArray, null, 2), 'utf8');

console.log(`Companies data converted successfully. JSON file saved to: ${outputPath}`);
console.log(`SVG logos extracted to: ${logosDir}`); 