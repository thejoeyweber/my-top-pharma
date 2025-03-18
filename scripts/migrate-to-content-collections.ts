/**
 * Migrate JSON data to Astro Content Collections
 * 
 * This script migrates the existing JSON data files to the Astro Content Collections format.
 * It reads the JSON files from src/data/json and writes them to src/content.
 */

import fs from 'fs/promises';
import path from 'path';

// Define file paths
const dataDir = path.join(process.cwd(), 'src', 'data', 'json');
const contentDir = path.join(process.cwd(), 'src', 'content');

// Function to ensure a directory exists
async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Function to check if a file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Function to migrate therapeutic areas
async function migrateTherapeuticAreas(): Promise<void> {
  console.log('Migrating therapeutic areas...');
  
  // Read the JSON file
  const filePath = path.join(dataDir, 'therapeuticAreas.json');
  
  // Check if the file exists
  if (!(await fileExists(filePath))) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const therapeuticAreas = JSON.parse(data);
    
    // Ensure the target directory exists
    const targetDir = path.join(contentDir, 'therapeutic-areas');
    await ensureDir(targetDir);
    
    // Write each therapeutic area as a separate JSON file
    let migrationCount = 0;
    for (const area of therapeuticAreas) {
      // Use the slug as the filename
      const fileName = `${area.slug}.json`;
      const filePath = path.join(targetDir, fileName);
      
      // Write the file with pretty formatting
      await fs.writeFile(filePath, JSON.stringify(area, null, 2));
      migrationCount++;
    }
    
    console.log(`✅ Migrated ${migrationCount} therapeutic areas`);
  } catch (error) {
    console.error(`Error migrating therapeutic areas:`, error);
  }
}

// Function to migrate companies
async function migrateCompanies(): Promise<void> {
  console.log('Migrating companies...');
  
  // Read the JSON file
  const filePath = path.join(dataDir, 'companies.json');
  
  // Check if the file exists
  if (!(await fileExists(filePath))) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const companies = JSON.parse(data);
    
    // Ensure the target directory exists
    const targetDir = path.join(contentDir, 'companies');
    await ensureDir(targetDir);
    
    // Write each company as a separate JSON file
    let migrationCount = 0;
    for (const company of companies) {
      // Use the slug as the filename
      const fileName = `${company.slug}.json`;
      const filePath = path.join(targetDir, fileName);
      
      // Write the file with pretty formatting
      await fs.writeFile(filePath, JSON.stringify(company, null, 2));
      migrationCount++;
    }
    
    console.log(`✅ Migrated ${migrationCount} companies`);
  } catch (error) {
    console.error(`Error migrating companies:`, error);
  }
}

// Main function to run the migration
async function migrateToContentCollections(): Promise<void> {
  try {
    console.log('Starting migration to Content Collections...');
    console.log(`Looking for JSON files in: ${dataDir}`);
    
    // Ensure the content directory exists
    await ensureDir(contentDir);
    
    // List all files in the data directory
    const files = await fs.readdir(dataDir);
    console.log(`Found files: ${files.join(', ')}`);
    
    // Migrate therapeutic areas and companies
    await migrateTherapeuticAreas();
    await migrateCompanies();
    
    console.log('Migration completed successfully!');
    console.log('📝 Note: You can now use Astro\'s getCollection() API to fetch data in your components.');
  } catch (error) {
    console.error('Error migrating to Content Collections:', error);
    process.exit(1);
  }
}

// Run the migration
migrateToContentCollections(); 