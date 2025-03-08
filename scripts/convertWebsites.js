/**
 * Convert Websites Data
 * 
 * This script converts websites.ts to websites.json and extracts any SVGs
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
const screenshotsDir = path.join(__dirname, '../src/data/assets/screenshots');

if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir, { recursive: true });
}

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Read the websites.ts file
const websitesFilePath = path.join(__dirname, '../src/data/websites.ts');
const websitesFileContent = fs.readFileSync(websitesFilePath, 'utf8');

// Extract the websites array
const websitesMatch = websitesFileContent.match(/export const websites: Website\[\] = \[([\s\S]*?)\];/);

if (!websitesMatch) {
  console.error('Could not find websites array in websites.ts');
  process.exit(1);
}

// Parse the websites array
let websitesArray;
try {
  // Replace TypeScript-specific syntax with JSON-compatible syntax
  let jsCode = '[' + websitesMatch[1]
    .replace(/\/\/.*$/gm, '') // Remove comments
    .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
  
  // Use eval in a controlled manner to convert the JS array to a JavaScript object
  // Note: In a production environment, a safer approach would be preferable
  websitesArray = eval(`(${jsCode})`);
} catch (error) {
  console.error('Error parsing websites array:', error);
  process.exit(1);
}

// Process each website
websitesArray.forEach(website => {
  // Check if the screenshot is an SVG string
  if (website.screenshotUrl && website.screenshotUrl.startsWith('<svg')) {
    // Extract SVG to a separate file
    const svgFileName = `${website.id}.svg`;
    const svgFilePath = path.join(screenshotsDir, svgFileName);
    
    fs.writeFileSync(svgFilePath, website.screenshotUrl, 'utf8');
    
    // Update the reference in the JSON
    website.screenshotUrl = `/src/data/assets/screenshots/${svgFileName}`;
  }
});

// Extract website categories
const categoriesMatch = websitesFileContent.match(/export const websiteCategories = \[([\s\S]*?)\];/);
let categoriesArray = [];

if (categoriesMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + categoriesMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    categoriesArray = eval(`(${jsCode})`);
    
    // Write the processed categories to a JSON file
    const catOutputPath = path.join(jsonDir, 'websiteCategories.json');
    fs.writeFileSync(catOutputPath, JSON.stringify(categoriesArray, null, 2), 'utf8');
    
    console.log(`Website categories data converted successfully. JSON file saved to: ${catOutputPath}`);
  } catch (error) {
    console.error('Error parsing website categories array:', error);
  }
}

// Extract regions
const regionsMatch = websitesFileContent.match(/export const regions = \[([\s\S]*?)\];/);
let regionsArray = [];

if (regionsMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + regionsMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    regionsArray = eval(`(${jsCode})`);
    
    // Write the processed regions to a JSON file
    const regOutputPath = path.join(jsonDir, 'regions.json');
    fs.writeFileSync(regOutputPath, JSON.stringify(regionsArray, null, 2), 'utf8');
    
    console.log(`Regions data converted successfully. JSON file saved to: ${regOutputPath}`);
  } catch (error) {
    console.error('Error parsing regions array:', error);
  }
}

// Write the processed websites to a JSON file
const outputPath = path.join(jsonDir, 'websites.json');
fs.writeFileSync(outputPath, JSON.stringify(websitesArray, null, 2), 'utf8');

console.log(`Websites data converted successfully. JSON file saved to: ${outputPath}`);
console.log(`Screenshot images extracted to: ${screenshotsDir}`); 