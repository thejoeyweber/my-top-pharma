/**
 * Convert User Data
 * 
 * This script converts user.ts to various JSON files (userProfile.json,
 * userPreferences.json, etc.).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const jsonDir = path.join(__dirname, '../src/data/json');

if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir, { recursive: true });
}

// Read the user.ts file
const userFilePath = path.join(__dirname, '../src/data/user.ts');
const userFileContent = fs.readFileSync(userFilePath, 'utf8');

// Extract the user profile
const userProfileMatch = userFileContent.match(/export const userProfile = ({[\s\S]*?});/);

if (userProfileMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = userProfileMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS object to a JavaScript object
    const userProfile = eval(`(${jsCode})`);
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, 'userProfile.json');
    fs.writeFileSync(outputPath, JSON.stringify(userProfile, null, 2), 'utf8');
    
    console.log(`userProfile data converted successfully. JSON file saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing userProfile:', error);
  }
}

// Extract the user preferences
const userPreferencesMatch = userFileContent.match(/export const userPreferences = ({[\s\S]*?});/);

if (userPreferencesMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = userPreferencesMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS object to a JavaScript object
    const userPreferences = eval(`(${jsCode})`);
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, 'userPreferences.json');
    fs.writeFileSync(outputPath, JSON.stringify(userPreferences, null, 2), 'utf8');
    
    console.log(`userPreferences data converted successfully. JSON file saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing userPreferences:', error);
  }
}

// Extract followed companies
const followedCompaniesMatch = userFileContent.match(/export const followedCompanies = \[([\s\S]*?)\];/);

if (followedCompaniesMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + followedCompaniesMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    const followedCompanies = eval(`(${jsCode})`);
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, 'followedCompanies.json');
    fs.writeFileSync(outputPath, JSON.stringify(followedCompanies, null, 2), 'utf8');
    
    console.log(`followedCompanies data converted successfully. JSON file saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing followedCompanies:', error);
  }
}

// Extract followed therapeutic areas
const followedTherapeuticAreasMatch = userFileContent.match(/export const followedTherapeuticAreas = \[([\s\S]*?)\];/);

if (followedTherapeuticAreasMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + followedTherapeuticAreasMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    const followedTherapeuticAreas = eval(`(${jsCode})`);
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, 'followedTherapeuticAreas.json');
    fs.writeFileSync(outputPath, JSON.stringify(followedTherapeuticAreas, null, 2), 'utf8');
    
    console.log(`followedTherapeuticAreas data converted successfully. JSON file saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing followedTherapeuticAreas:', error);
  }
}

// Extract user notifications
const userNotificationsMatch = userFileContent.match(/export const userNotifications = \[([\s\S]*?)\];/);

if (userNotificationsMatch) {
  try {
    // Replace TypeScript-specific syntax with JSON-compatible syntax
    let jsCode = '[' + userNotificationsMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Use eval in a controlled manner to convert the JS array to a JavaScript object
    const userNotifications = eval(`(${jsCode})`);
    
    // Write the processed data to a JSON file
    const outputPath = path.join(jsonDir, 'userNotifications.json');
    fs.writeFileSync(outputPath, JSON.stringify(userNotifications, null, 2), 'utf8');
    
    console.log(`userNotifications data converted successfully. JSON file saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing userNotifications:', error);
  }
} 