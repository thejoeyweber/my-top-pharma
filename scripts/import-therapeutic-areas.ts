/**
 * Therapeutic Areas Import Script
 * 
 * This script downloads and processes data from the Healthcare Provider Taxonomy Code Set
 * (HPTCS) to create standardized therapeutic areas with MeSH references.
 * 
 * Usage:
 *   npx ts-node scripts/import-therapeutic-areas.ts
 * 
 * Dependencies:
 *   npm install csv-parse @types/csv-parse
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
// NOTE: This requires installing the csv-parse package and its type definitions
// npm install csv-parse @types/csv-parse
import csvParse from 'csv-parse';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// NUCC Taxonomy URL - this URL may change periodically
const NUCC_TAXONOMY_URL = 'https://nucc.org/images/stories/CSV/nucc_taxonomy_231.csv';

// Local file path for downloaded data
const CSV_FILE_PATH = path.join(__dirname, 'nucc_taxonomy.csv');

// Output JSON file path
const JSON_OUTPUT_PATH = path.join(__dirname, '../src/data/json/therapeuticAreas.json');

// Database configuration
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Define the therapeutic area structure
interface TherapeuticArea {
  id: string;            // HPTCS code
  name: string;          // Display name
  slug: string;          // URL-friendly version
  mesh_specialty_id?: string;  // MeSH specialty reference
  mesh_disease_id?: string;    // MeSH disease reference
  description?: string;  // Description
  level: number;         // Hierarchy level
  parent_id?: string;    // Parent reference
}

// Define pharmaceutical class mapping structure
interface PharmClassMapping {
  pharm_class: string;
  class_type: string;
  therapeutic_area_id: string;
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Download the NUCC Taxonomy CSV file
 */
async function downloadTaxonomyFile(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if file already exists
    if (fs.existsSync(CSV_FILE_PATH)) {
      console.log('CSV file already exists. Using existing file.');
      return resolve();
    }

    console.log(`Downloading NUCC Taxonomy CSV from ${NUCC_TAXONOMY_URL}...`);
    const file = fs.createWriteStream(CSV_FILE_PATH);
    
    https.get(NUCC_TAXONOMY_URL, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('Download complete.');
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(CSV_FILE_PATH, () => {});
      reject(err);
    });
  });
}

/**
 * Parse the CSV file and extract relevant specialties
 */
function extractSpecialties(): TherapeuticArea[] {
  console.log('Parsing CSV file and extracting specialties...');
  
  // Read and parse the CSV file
  const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf8');
  const records = csvParse.parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  // Dictionary to map from specialty codes to MeSH IDs
  const specialtyToMeshMapping: Record<string, { specialty?: string, disease?: string }> = {
    // Allopathic & Osteopathic Physicians
    '207R00000X': { specialty: 'D002983', disease: undefined }, // General Internal Medicine
    '207RC0000X': { specialty: 'D002309', disease: 'D002318' }, // Cardiovascular Disease (Cardiology)
    '207RH0000X': { specialty: 'D004443', disease: 'D004487' }, // Hematology (Hematologist)
    '207RI0011X': { specialty: 'D007167', disease: 'D007155' }, // Immunology
    '207RO0000X': { specialty: 'D009367', disease: 'D009369' }, // Oncology
    '207RI0200X': { specialty: 'D015673', disease: 'D007239' }, // Infectious Disease
    '207RG0100X': { specialty: 'D005769', disease: 'D005767' }, // Gastroenterology
    '207RE0101X': { specialty: 'D004706', disease: 'D004700' }, // Endocrinology
    '207RN0300X': { specialty: 'D007671', disease: 'D007674' }, // Nephrology
    '207RP0002X': { specialty: 'D010511', disease: 'D010514' }, // Pulmonary Disease
    '2084N0400X': { specialty: 'D009464', disease: 'D009422' }, // Neurology
    '207QA0000X': { specialty: 'D001237', disease: 'D000293' }, // Allergy & Immunology
    '207T00000X': { specialty: 'D010575', disease: 'D011570' }, // Psychiatry
    '208D00000X': { specialty: 'D003131', disease: 'D003092' }, // Dermatology
    '208600000X': { specialty: 'D014022', disease: 'D014023' }, // Surgery
    '208200000X': { specialty: 'D009776', disease: 'D000740' }, // Obstetrics & Gynecology
    '207RS0012X': { specialty: undefined, disease: 'D035583' }       // Rare diseases
  };

  // Filter relevant specialties and map to therapeutic areas
  const therapeuticAreas: TherapeuticArea[] = [];
  
  // Keep track of processed specialties to avoid duplicates
  const processedCodes = new Set<string>();
  
  for (const record of records) {
    const code = record.Code;
    
    // Only process each code once
    if (processedCodes.has(code)) {
      continue;
    }
    
    // Check if this is a physician specialty we're interested in
    if (code in specialtyToMeshMapping) {
      const name = record.Classification === 'Allopathic & Osteopathic Physicians' 
        ? record.Specialization 
        : record.Classification;
      
      // Create slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Get MeSH mappings if available
      const meshMapping = specialtyToMeshMapping[code];
      
      therapeuticAreas.push({
        id: code,
        name,
        slug,
        mesh_specialty_id: meshMapping?.specialty,
        mesh_disease_id: meshMapping?.disease,
        description: record.Definition || undefined,
        level: 1, // Default level
        parent_id: undefined
      });
      
      processedCodes.add(code);
    }
  }
  
  // Add a few additional specialties not well-captured by the taxonomy
  therapeuticAreas.push({
    id: '2080I0204X',
    name: 'Vaccines',
    slug: 'vaccines',
    mesh_specialty_id: 'D053823',
    description: 'Development and administration of vaccines for disease prevention',
    level: 2,
    parent_id: '207RI0200X' // Parent: Infectious Disease
  });
  
  console.log(`Extracted ${therapeuticAreas.length} therapeutic areas.`);
  return therapeuticAreas;
}

/**
 * Generate initial pharmaceutical class to therapeutic area mappings
 */
function generatePharmClassMappings(therapeuticAreas: TherapeuticArea[]): PharmClassMapping[] {
  console.log('Generating pharmaceutical class mappings...');
  
  // Create a map for easier lookup
  const taMap = new Map<string, TherapeuticArea>();
  therapeuticAreas.forEach(ta => taMap.set(ta.id, ta));
  
  // Define common EPC to HPTCS mappings
  const epcMappings: PharmClassMapping[] = [
    // Cardiovascular
    { pharm_class: 'HMG-CoA Reductase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { pharm_class: 'Angiotensin II Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { pharm_class: 'Beta-Adrenergic Blocker', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { pharm_class: 'Angiotensin-Converting Enzyme Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { pharm_class: 'Calcium Channel Blocker', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    
    // Oncology
    { pharm_class: 'Kinase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { pharm_class: 'Tyrosine Kinase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { pharm_class: 'Monoclonal Antibody', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { pharm_class: 'Immune Checkpoint Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    
    // Immunology
    { pharm_class: 'Interleukin-6 Receptor Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    { pharm_class: 'Interleukin-1 Blocker', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    { pharm_class: 'Janus Kinase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    
    // Infectious Disease
    { pharm_class: 'Cephalosporin Antibacterial', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { pharm_class: 'Macrolide Antimicrobial', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { pharm_class: 'Carbapenem', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { pharm_class: 'HIV Integrase Strand Transfer Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    
    // Neurology
    { pharm_class: 'Serotonin Reuptake Inhibitor', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    { pharm_class: 'Calcitonin Gene-Related Peptide Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    { pharm_class: 'GABA-A Receptor Agonist', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    
    // Endocrinology
    { pharm_class: 'Sodium-Glucose Cotransporter 2 Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { pharm_class: 'Dipeptidyl Peptidase 4 Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { pharm_class: 'Incretin Mimetic', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { pharm_class: 'Insulin', class_type: 'EPC', therapeutic_area_id: '207RE0101X' }
  ];
  
  console.log(`Generated ${epcMappings.length} pharmaceutical class mappings.`);
  return epcMappings;
}

/**
 * Write therapeutic areas to JSON file
 */
function writeToJson(therapeuticAreas: TherapeuticArea[]): void {
  console.log(`Writing ${therapeuticAreas.length} therapeutic areas to JSON...`);
  fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(therapeuticAreas, null, 2));
  console.log(`Wrote therapeutic areas to ${JSON_OUTPUT_PATH}`);
}

/**
 * Insert therapeutic areas into database
 */
async function insertIntoDatabase(therapeuticAreas: TherapeuticArea[], pharmClassMappings: PharmClassMapping[]): Promise<void> {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('Supabase credentials not found. Skipping database insertion.');
    return;
  }
  
  try {
    console.log('Inserting therapeutic areas into database...');
    
    // Check if database is connected
    const { data: testData, error: testError } = await supabase.from('therapeutic_areas').select('count').limit(1);
    if (testError) {
      console.error('Error connecting to database:', testError);
      return;
    }
    
    // Insert therapeutic areas
    const { data, error } = await supabase
      .from('therapeutic_areas')
      .upsert(therapeuticAreas, { onConflict: 'id' });
    
    if (error) {
      console.error('Error inserting therapeutic areas:', error);
      return;
    }
    
    console.log(`Inserted ${therapeuticAreas.length} therapeutic areas.`);
    
    // Insert pharmaceutical class mappings
    console.log('Inserting pharmaceutical class mappings...');
    const { data: mappingData, error: mappingError } = await supabase
      .from('pharm_class_mappings')
      .upsert(pharmClassMappings, { onConflict: 'pharm_class, class_type' });
    
    if (mappingError) {
      console.error('Error inserting pharmaceutical class mappings:', mappingError);
      return;
    }
    
    console.log(`Inserted ${pharmClassMappings.length} pharmaceutical class mappings.`);
    
  } catch (error) {
    console.error('Database insertion failed:', error);
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Download taxonomy file
    await downloadTaxonomyFile();
    
    // Extract specialties
    const therapeuticAreas = extractSpecialties();
    
    // Generate pharmaceutical class mappings
    const pharmClassMappings = generatePharmClassMappings(therapeuticAreas);
    
    // Write to JSON file
    writeToJson(therapeuticAreas);
    
    // Insert into database if credentials are available
    await insertIntoDatabase(therapeuticAreas, pharmClassMappings);
    
    console.log('Therapeutic areas import completed successfully.');
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Execute the script
main(); 