/**
 * Convert Admin Data
 * 
 * This script converts admin.ts to various JSON files (systemStats.json, 
 * apiEndpoints.json, etc.) and extracts SVGs to separate files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const jsonDir = path.join(__dirname, '../src/data/json');
const iconsDir = path.join(__dirname, '../src/data/assets/icons');

if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir, { recursive: true });
}

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Read the admin.ts file
const adminFilePath = path.join(__dirname, '../src/data/admin.ts');
const adminFileContent = fs.readFileSync(adminFilePath, 'utf8');

// Helper function to extract data and SVGs
function extractDataAndSvgs(dataMatch, dataName, iconPropertyName = 'icon') {
  if (!dataMatch) {
    console.error(`Could not find ${dataName} in admin.ts`);
    return null;
  }

  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + dataMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    // Note: In a production environment, a safer approach would be preferable
    const dataArray = eval(`(${jsCode})`);
    
    // Process each item to extract SVGs
    dataArray.forEach((item, index) => {
      if (item[iconPropertyName] && item[iconPropertyName].startsWith('<svg')) {
        // Create a unique filename for the SVG
        const svgFileName = `${dataName}-${item.id || index}.svg`;
        const svgFilePath = path.join(iconsDir, svgFileName);
        
        fs.writeFileSync(svgFilePath, item[iconPropertyName], 'utf8');
        
        // Update the reference in the data
        item[iconPropertyName.replace('icon', 'iconPath')] = `/src/data/assets/icons/${svgFileName}`;
        delete item[iconPropertyName]; // Remove the SVG content
      }
    });
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, `${dataName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(dataArray, null, 2), 'utf8');
    
    console.log(`${dataName} data converted successfully. JSON file saved to: ${outputPath}`);
    return dataArray;
  } catch (error) {
    console.error(`Error processing ${dataName}:`, error);
    return null;
  }
}

// Extract system stats
const systemStatsMatch = adminFileContent.match(/export const systemStats = \[([\s\S]*?)\];/);
const systemStats = extractDataAndSvgs(systemStatsMatch, 'systemStats');

// Extract recent crawler jobs
const recentCrawlerJobsMatch = adminFileContent.match(/export const recentCrawlerJobs = \[([\s\S]*?)\];/);
if (recentCrawlerJobsMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + recentCrawlerJobsMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    const recentCrawlerJobs = eval(`(${jsCode})`);
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, 'recentCrawlerJobs.json');
    fs.writeFileSync(outputPath, JSON.stringify(recentCrawlerJobs, null, 2), 'utf8');
    
    console.log(`recentCrawlerJobs data converted successfully. JSON file saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing recentCrawlerJobs:', error);
  }
}

// Extract API endpoints
const apiEndpointsMatch = adminFileContent.match(/export const apiEndpoints = \[([\s\S]*?)\];/);
const apiEndpoints = extractDataAndSvgs(apiEndpointsMatch, 'apiEndpoints');

// Extract crawler config
const crawlerConfigMatch = adminFileContent.match(/export const crawlerConfig = ({[\s\S]*?});/);
if (crawlerConfigMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = crawlerConfigMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS object to a JavaScript object
    const crawlerConfig = eval(`(${jsCode})`);
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, 'crawlerConfig.json');
    fs.writeFileSync(outputPath, JSON.stringify(crawlerConfig, null, 2), 'utf8');
    
    console.log(`crawlerConfig data converted successfully. JSON file saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing crawlerConfig:', error);
  }
}

// Extract system logs
const systemLogsMatch = adminFileContent.match(/export const systemLogs = \[([\s\S]*?)\];/);
if (systemLogsMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + systemLogsMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    const systemLogs = eval(`(${jsCode})`);
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, 'systemLogs.json');
    fs.writeFileSync(outputPath, JSON.stringify(systemLogs, null, 2), 'utf8');
    
    console.log(`systemLogs data converted successfully. JSON file saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing systemLogs:', error);
  }
}

// Extract user management data
const userManagementMatch = adminFileContent.match(/export const userManagement = ({[\s\S]*?});/);
if (userManagementMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = userManagementMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS object to a JavaScript object
    const userManagement = eval(`(${jsCode})`);
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, 'userManagement.json');
    fs.writeFileSync(outputPath, JSON.stringify(userManagement, null, 2), 'utf8');
    
    console.log(`userManagement data converted successfully. JSON file saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing userManagement:', error);
  }
}

console.log(`Icon SVGs extracted to: ${iconsDir}`); 