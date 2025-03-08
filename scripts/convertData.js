/**
 * Convert Data
 * 
 * This script converts TS data files to JSON and extracts SVGs to separate files.
 * 
 * NOTE: After running this script, the TS data files can be removed as the application
 * now uses JSON files exclusively through the dataUtils.ts utility.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const jsonDir = path.join(__dirname, '../src/data/json');
const assetsDir = path.join(__dirname, '../src/data/assets');
const iconsDir = path.join(assetsDir, 'icons');
const logosDir = path.join(assetsDir, 'logos');
const screenshotsDir = path.join(assetsDir, 'screenshots');
const productsDir = path.join(assetsDir, 'products');

// Create directories
[jsonDir, assetsDir, iconsDir, logosDir, screenshotsDir, productsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Function to extract SVGs from data
function extractSvgs(data, idField, svgField, outputDir, prefix = '') {
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      if (item[svgField] && typeof item[svgField] === 'string' && item[svgField].startsWith('<svg')) {
        const id = item[idField] || index;
        const svgFileName = `${prefix}${id}.svg`;
        const svgFilePath = path.join(outputDir, svgFileName);
        
        fs.writeFileSync(svgFilePath, item[svgField], 'utf8');
        
        // Update the reference in the data
        item[svgField] = `/src/data/assets/${path.basename(outputDir)}/${svgFileName}`;
      }
    });
  }
  return data;
}

// Function to save data to JSON file
function saveToJson(data, filename) {
  const outputPath = path.join(jsonDir, filename);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Data saved to: ${outputPath}`);
}

// Companies data
const companies = [
  {
    id: 'pfizer',
    name: 'Pfizer',
    description: 'Pfizer Inc. is an American multinational pharmaceutical and biotechnology corporation.',
    logoUrl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>',
    headquarters: 'New York, USA',
    founded: '1849',
    website: 'https://www.pfizer.com',
    marketCap: 240.5,
    employees: 79000,
    stockSymbol: 'PFE',
    stockExchange: 'NYSE',
    therapeuticAreas: ['oncology', 'vaccines', 'immunology'],
    products: [],
    relatedCompanies: [],
    milestones: [],
    financials: []
  },
  {
    id: 'novartis',
    name: 'Novartis',
    description: 'Novartis International AG is a Swiss multinational pharmaceutical company.',
    logoUrl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" fill="red"/></svg>',
    headquarters: 'Basel, Switzerland',
    founded: '1996',
    website: 'https://www.novartis.com',
    marketCap: 180.3,
    employees: 108000,
    stockSymbol: 'NVS',
    stockExchange: 'NYSE',
    therapeuticAreas: ['oncology', 'neuroscience', 'immunology'],
    products: [],
    relatedCompanies: [],
    milestones: [],
    financials: []
  }
];

// Therapeutic areas data
const therapeuticAreas = [
  { id: 'oncology', name: 'Oncology' },
  { id: 'immunology', name: 'Immunology' },
  { id: 'neuroscience', name: 'Neuroscience' },
  { id: 'cardiovascular', name: 'Cardiovascular' },
  { id: 'infectious-diseases', name: 'Infectious Diseases' },
  { id: 'vaccines', name: 'Vaccines' },
  { id: 'rare-diseases', name: 'Rare Diseases' }
];

// Products data
const products = [
  {
    id: 'exampla',
    name: 'Exampla',
    genericName: 'examplamab',
    companyId: 'pfizer',
    description: 'A monoclonal antibody targeting inflammatory pathways.',
    stage: 'marketed',
    therapeuticAreas: ['immunology', 'dermatology'],
    indications: ['Rheumatoid Arthritis', 'Psoriasis'],
    moleculeType: 'Monoclonal Antibody',
    timeline: [],
    approvals: [],
    imageUrl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="green"/></svg>'
  },
  {
    id: 'cardiofix',
    name: 'CardioFix',
    genericName: 'amlodipivastatin',
    companyId: 'pfizer',
    description: 'A dual-action therapy for cardiovascular disease management.',
    stage: 'phase3',
    therapeuticAreas: ['cardiovascular'],
    indications: ['Hypertension with Hyperlipidemia'],
    moleculeType: 'Small Molecule',
    timeline: [],
    approvals: [],
    imageUrl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" fill="purple"/></svg>'
  }
];

// Indications data
const indications = [
  'Alzheimer\'s Disease',
  'Breast Cancer',
  'Chronic Heart Failure',
  'Diabetes Mellitus',
  'Epilepsy'
];

// Websites data
const websites = [
  {
    id: 'pfizer-corporate',
    domain: 'pfizer.com',
    siteName: 'Pfizer Corporate Website',
    category: 'corporate',
    subcategories: ['investor-relations', 'careers'],
    description: 'Official corporate website for Pfizer Inc.',
    companyId: 'pfizer',
    therapeuticAreas: ['oncology', 'vaccines', 'immunology'],
    region: 'global',
    screenshotUrl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" fill="blue"/></svg>'
  },
  {
    id: 'novartis-corporate',
    domain: 'novartis.com',
    siteName: 'Novartis Corporate Website',
    category: 'corporate',
    subcategories: ['investor-relations', 'careers'],
    description: 'Official corporate website for Novartis AG.',
    companyId: 'novartis',
    therapeuticAreas: ['oncology', 'neuroscience', 'immunology'],
    region: 'global',
    screenshotUrl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" fill="red"/></svg>'
  }
];

// Website categories data
const websiteCategories = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'hcp', label: 'Healthcare Professional' },
  { value: 'patient', label: 'Patient' },
  { value: 'campaign', label: 'Campaign' }
];

// Regions data
const regions = [
  { value: 'global', label: 'Global' },
  { value: 'US', label: 'United States' },
  { value: 'EU', label: 'European Union' }
];

// Admin data
const systemStats = [
  { 
    id: 'companies-stat',
    label: 'Companies', 
    value: 2847, 
    change: '+12%', 
    trend: 'up',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15Z" clip-rule="evenodd" /></svg>'
  },
  { 
    id: 'products-stat',
    label: 'Products', 
    value: 14382, 
    change: '+8%', 
    trend: 'up',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M11.25 3v4.046a3 3 0 0 0-4.277 4.204H1.5v-6A2.25 2.25 0 0 1 3.75 3h7.5Z" /></svg>'
  }
];

// User data
const userProfile = {
  id: 'user-001',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  jobTitle: 'Pharmaceutical Research Analyst',
  company: 'BioHealth Partners',
  avatarUrl: '/images/avatars/female-1.jpg',
  createdAt: '2023-09-12T14:30:00Z',
};

const userPreferences = {
  notifications: {
    email: true,
    push: false,
    marketingEmails: false,
    newCompanyAlerts: true,
    productApprovals: true,
    websiteLaunches: false,
  },
  display: {
    theme: 'light',
    compactMode: false,
    dashboardLayout: 'grid',
  },
  privacy: {
    showProfilePublicly: true,
    shareActivityWithinOrg: true,
  },
};

const followedCompanies = [
  { id: 'pfizer', name: 'Pfizer', followedAt: '2023-12-10T09:15:00Z' },
  { id: 'novartis', name: 'Novartis', followedAt: '2023-11-25T14:20:00Z' }
];

// Process and save all data
console.log('Starting data conversion process...');

// Process companies data
const processedCompanies = extractSvgs(companies, 'id', 'logoUrl', logosDir);
saveToJson(processedCompanies, 'companies.json');
saveToJson(therapeuticAreas, 'therapeuticAreas.json');

// Process products data
const processedProducts = extractSvgs(products, 'id', 'imageUrl', productsDir);
saveToJson(processedProducts, 'products.json');
saveToJson(indications, 'indications.json');

// Process websites data
const processedWebsites = extractSvgs(websites, 'id', 'screenshotUrl', screenshotsDir);
saveToJson(processedWebsites, 'websites.json');
saveToJson(websiteCategories, 'websiteCategories.json');
saveToJson(regions, 'regions.json');

// Process admin data
const processedSystemStats = extractSvgs(systemStats, 'id', 'icon', iconsDir, 'stat-');
saveToJson(processedSystemStats, 'systemStats.json');

// Process user data
saveToJson(userProfile, 'userProfile.json');
saveToJson(userPreferences, 'userPreferences.json');
saveToJson(followedCompanies, 'followedCompanies.json');

console.log('Data conversion completed successfully!');
console.log('SVGs have been extracted to src/data/assets/'); 