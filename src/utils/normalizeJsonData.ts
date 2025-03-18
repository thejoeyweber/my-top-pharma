/**
 * Normalize JSON Data
 * 
 * This utility script normalizes the JSON data files to match the canonical interfaces.
 * It performs the following operations:
 * 
 * 1. Converts companies.json to match the Company interface
 * 2. Converts therapeuticAreas.json to match the TherapeuticArea interface
 * 3. Extracts nested objects to create normalized references
 * 
 * Run with: npx tsx src/utils/normalizeJsonData.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Company } from '../interfaces/entities/Company';
import type { TherapeuticArea } from '../interfaces/entities/TherapeuticArea';
import type { Product } from '../interfaces/entities/Product';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const jsonDir = path.join(rootDir, 'src/data/json');

// Path to JSON files
const companiesJsonPath = path.join(jsonDir, 'companies.json');
const therapeuticAreasJsonPath = path.join(jsonDir, 'therapeuticAreas.json');
const productsJsonPath = path.join(jsonDir, 'products.json');

// Backup existing files before modifying them
function backupFile(filePath: string): void {
  const backupPath = `${filePath}.bak.${Date.now()}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`Backed up ${filePath} to ${backupPath}`);
}

// Function to generate a slug from a name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to check if a value is an object
function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Function to normalize companies.json
function normalizeCompanies(): void {
  try {
    console.log(`Reading companies file from: ${companiesJsonPath}`);
    if (!fs.existsSync(companiesJsonPath)) {
      console.error(`Error: companies.json not found at ${companiesJsonPath}`);
      return;
    }
    
    backupFile(companiesJsonPath);
    
    // Read the companies.json file
    const companiesRaw = JSON.parse(fs.readFileSync(companiesJsonPath, 'utf8')) as any[];
    console.log(`Successfully read ${companiesRaw.length} companies from JSON`);
    
    // Extract products from companies for separate normalization
    const allProducts: any[] = [];
    
    // Read existing products if available
    let existingProducts: any[] = [];
    if (fs.existsSync(productsJsonPath)) {
      try {
        existingProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
        console.log(`Read ${existingProducts.length} existing products from products.json`);
      } catch (error) {
        console.error('Error reading products.json:', error);
      }
    }
    
    // Create a product map for lookup
    const productMap = new Map<string, any>();
    existingProducts.forEach(product => {
      productMap.set(product.id, product);
    });
    
    // Normalize companies
    const normalizedCompanies: Partial<Company>[] = companiesRaw.map(company => {
      let productIds: string[] = [];
      
      // Handle products based on their type
      if (Array.isArray(company.products)) {
        productIds = company.products.map((product: any) => {
          // If the product is a string, it's already an ID
          if (typeof product === 'string') {
            return product;
          }
          
          // If it's an object, extract it and add to allProducts
          if (isObject(product) && product.id) {
            const productWithCompany = { ...product, companyId: company.id };
            allProducts.push(productWithCompany);
            return product.id;
          }
          
          // If we can't determine what it is, log and skip
          console.warn(`Skipping invalid product in company ${company.id}:`, product);
          return null;
        }).filter(Boolean); // Remove any null entries
      }
      
      // Create normalized company
      const normalizedCompany: Partial<Company> = {
        id: company.id,
        name: company.name,
        slug: company.slug || generateSlug(company.name),
        description: company.description || '',
        logoUrl: company.logoUrl || '',
        headerImageUrl: company.headerImageUrl,
        websiteUrl: company.website ? `https://${company.website}` : '',
        headquarters: company.headquarters || '',
        foundedYear: company.founded ? parseInt(company.founded) : null,
        employeeCount: company.employees || null,
        marketCapBillions: company.marketCap || null,
        annualRevenueBillions: null,
        isPublic: !!company.tickerSymbol,
        tickerSymbol: company.tickerSymbol || null,
        stockExchange: company.stockExchange || null,
        therapeuticAreas: company.therapeuticAreas || [],
        products: productIds,
        relatedCompanies: company.relatedCompanies || [],
        milestones: company.milestones || [],
        financials: company.financials || [],
        createdAt: company.createdAt || new Date().toISOString(),
        updatedAt: company.updatedAt || new Date().toISOString()
      };
      
      return normalizedCompany;
    });
    
    // Write the normalized companies to companies.json
    fs.writeFileSync(
      companiesJsonPath, 
      JSON.stringify(normalizedCompanies, null, 2), 
      'utf8'
    );
    console.log(`Normalized companies.json with ${normalizedCompanies.length} companies`);
    
    // Update products.json if we extracted any products
    if (allProducts.length > 0) {
      try {
        // Backup products.json if it exists
        if (existingProducts.length > 0) {
          backupFile(productsJsonPath);
        }
        
        // Merge new products with existing ones
        allProducts.forEach(product => {
          if (product.id) {
            const existing = productMap.get(product.id);
            if (existing) {
              // Update existing product
              productMap.set(product.id, { ...existing, ...product });
            } else {
              // Add new product
              productMap.set(product.id, product);
            }
          }
        });
        
        // Convert map to array
        const mergedProducts = Array.from(productMap.values());
        
        // Write the products to products.json
        fs.writeFileSync(
          productsJsonPath, 
          JSON.stringify(mergedProducts, null, 2), 
          'utf8'
        );
        console.log(`Updated products.json with ${mergedProducts.length} products`);
      } catch (error) {
        console.error('Error processing products:', error);
      }
    }
  } catch (error) {
    console.error('Error normalizing companies:', error);
  }
}

// Function to normalize therapeuticAreas.json
function normalizeTherapeuticAreas(): void {
  try {
    if (!fs.existsSync(therapeuticAreasJsonPath)) {
      console.error(`Error: therapeuticAreas.json not found at ${therapeuticAreasJsonPath}`);
      return;
    }
    
    backupFile(therapeuticAreasJsonPath);
    
    // Read the therapeuticAreas.json file
    const therapeuticAreasRaw = JSON.parse(fs.readFileSync(therapeuticAreasJsonPath, 'utf8')) as any[];
    console.log(`Successfully read ${therapeuticAreasRaw.length} therapeutic areas from JSON`);
    
    // Read companies if the file exists
    let companies: Partial<Company>[] = [];
    if (fs.existsSync(companiesJsonPath)) {
      companies = JSON.parse(fs.readFileSync(companiesJsonPath, 'utf8')) as Partial<Company>[];
      console.log(`Successfully read ${companies.length} companies for therapeutic area references`);
    }
    
    // Build a map of therapeutic area IDs to company IDs
    const taToCompaniesMap = new Map<string, string[]>();
    companies.forEach(company => {
      if (company.therapeuticAreas && company.id) {
        company.therapeuticAreas.forEach(taId => {
          if (!taToCompaniesMap.has(taId)) {
            taToCompaniesMap.set(taId, []);
          }
          taToCompaniesMap.get(taId)?.push(company.id!);
        });
      }
    });
    
    // Build a map of therapeutic area IDs to product IDs
    const taToProductsMap = new Map<string, string[]>();
    
    // If products.json exists, use it to populate the map
    if (fs.existsSync(productsJsonPath)) {
      const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8')) as any[];
      console.log(`Successfully read ${products.length} products for therapeutic area references`);
      
      products.forEach(product => {
        if (product.therapeuticAreas && product.id) {
          product.therapeuticAreas.forEach((taId: string) => {
            if (!taToProductsMap.has(taId)) {
              taToProductsMap.set(taId, []);
            }
            taToProductsMap.get(taId)?.push(product.id);
          });
        }
      });
    }
    
    // Normalize therapeutic areas
    const normalizedTherapeuticAreas: Partial<TherapeuticArea>[] = therapeuticAreasRaw.map(ta => {
      // Create normalized therapeutic area
      const normalizedTa: Partial<TherapeuticArea> = {
        id: ta.id,
        name: ta.name,
        slug: ta.slug || generateSlug(ta.name),
        description: ta.description || '',
        iconUrl: ta.iconUrl || '',
        imageUrl: ta.imageUrl || '',
        isPrimary: ta.level === 1,
        parentId: ta.parent_id || undefined,
        // Add company IDs
        companyIds: taToCompaniesMap.get(ta.id) || [],
        // Add product IDs
        productIds: taToProductsMap.get(ta.id) || [],
        alternativeNames: ta.alternativeNames || [],
        relatedConditions: ta.relatedConditions || [],
        // Convert mesh_* to camelCase
        marketSizeBillions: ta.market_size_billions || undefined,
        growthRate: ta.growth_rate || undefined,
        updatedAt: ta.updatedAt || new Date().toISOString(),
        color: ta.color || '#3498db',
      };
      
      return normalizedTa;
    });
    
    // Write the normalized therapeutic areas to therapeuticAreas.json
    fs.writeFileSync(
      therapeuticAreasJsonPath, 
      JSON.stringify(normalizedTherapeuticAreas, null, 2), 
      'utf8'
    );
    console.log(`Normalized therapeuticAreas.json with ${normalizedTherapeuticAreas.length} therapeutic areas`);
  } catch (error) {
    console.error('Error normalizing therapeutic areas:', error);
  }
}

// Main function to run the normalization
async function main() {
  console.log('Starting JSON data normalization...');
  
  try {
    // Normalize companies.json first
    normalizeCompanies();
    
    // Then normalize therapeuticAreas.json
    normalizeTherapeuticAreas();
    
    console.log('JSON data normalization completed successfully.');
  } catch (error) {
    console.error('Error normalizing JSON data:', error);
    process.exit(1);
  }
}

// Run the main function if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { normalizeCompanies, normalizeTherapeuticAreas }; 