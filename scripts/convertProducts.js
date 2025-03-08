/**
 * Convert Products Data
 * 
 * This script converts products.ts to products.json and extracts any SVGs
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
const imagesDir = path.join(__dirname, '../src/data/assets/products');

if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir, { recursive: true });
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Read the products.ts file
const productsFilePath = path.join(__dirname, '../src/data/products.ts');
const productsFileContent = fs.readFileSync(productsFilePath, 'utf8');

// Extract the products array
const productsMatch = productsFileContent.match(/export const products: Product\[\] = \[([\s\S]*?)\];/);

if (!productsMatch) {
  console.error('Could not find products array in products.ts');
  process.exit(1);
}

// Parse the products array
let productsArray;
try {
  // Replace TypeScript-specific syntax with JSON-compatible syntax
  let jsCode = '[' + productsMatch[1]
    .replace(/\/\/.*$/gm, '') // Remove comments
    .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
  
  // Use eval in a controlled manner to convert the JS array to a JavaScript object
  // Note: In a production environment, a safer approach would be preferable
  productsArray = eval(`(${jsCode})`);
} catch (error) {
  console.error('Error parsing products array:', error);
  process.exit(1);
}

// Process each product
productsArray.forEach(product => {
  // Check if the image is an SVG string
  if (product.imageUrl && product.imageUrl.startsWith('<svg')) {
    // Extract SVG to a separate file
    const svgFileName = `${product.id}.svg`;
    const svgFilePath = path.join(imagesDir, svgFileName);
    
    fs.writeFileSync(svgFilePath, product.imageUrl, 'utf8');
    
    // Update the reference in the JSON
    product.imageUrl = `/src/data/assets/products/${svgFileName}`;
  }
});

// Extract indications
const indicationsMatch = productsFileContent.match(/export const indications = \[([\s\S]*?)\];/);
let indicationsArray = [];

if (indicationsMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + indicationsMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    indicationsArray = eval(`(${jsCode})`);
    
    // Write the processed indications to a JSON file
    const indOutputPath = path.join(jsonDir, 'indications.json');
    fs.writeFileSync(indOutputPath, JSON.stringify(indicationsArray, null, 2), 'utf8');
    
    console.log(`Indications data converted successfully. JSON file saved to: ${indOutputPath}`);
  } catch (error) {
    console.error('Error parsing indications array:', error);
  }
}

// Write the processed products to a JSON file
const outputPath = path.join(jsonDir, 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(productsArray, null, 2), 'utf8');

console.log(`Products data converted successfully. JSON file saved to: ${outputPath}`);
console.log(`Product images extracted to: ${imagesDir}`); 