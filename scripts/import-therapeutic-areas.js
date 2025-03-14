/**
 * Therapeutic Areas Import Script
 * 
 * This script downloads and processes data from the Healthcare Provider Taxonomy Code Set
 * (HPTCS) to create standardized therapeutic areas with MeSH references.
 * 
 * Usage:
 *   node scripts/import-therapeutic-areas.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Download the NUCC Taxonomy CSV file
 */
async function downloadTaxonomyFile() {
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
function extractSpecialties() {
  console.log('Parsing CSV file and extracting specialties...');
  
  // Read and parse the CSV file
  const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf8');
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  // Dictionary to map from specialty codes to MeSH IDs
  const specialtyToMeshMapping = {
    // Allopathic & Osteopathic Physicians
    '207R00000X': { specialty: 'D002983', disease: undefined, displayName: 'Internal Medicine' }, // General Internal Medicine
    '207RC0000X': { specialty: 'D002309', disease: 'D002318', displayName: 'Cardiology' }, // Cardiovascular Disease (Cardiology)
    '207RH0000X': { specialty: 'D004443', disease: 'D004487', displayName: 'Hematology' }, // Hematology (Hematologist)
    '207RI0011X': { specialty: 'D007167', disease: 'D007155', displayName: 'Immunology' }, // Immunology
    '207RO0000X': { specialty: 'D009367', disease: 'D009369', displayName: 'Oncology' }, // Oncology
    '207RI0200X': { specialty: 'D015673', disease: 'D007239', displayName: 'Infectious Disease' }, // Infectious Disease
    '207RG0100X': { specialty: 'D005769', disease: 'D005767', displayName: 'Gastroenterology' }, // Gastroenterology
    '207RE0101X': { specialty: 'D004706', disease: 'D004700', displayName: 'Endocrinology' }, // Endocrinology
    '207RN0300X': { specialty: 'D007671', disease: 'D007674', displayName: 'Nephrology' }, // Nephrology
    '207RP0002X': { specialty: 'D010511', disease: 'D010514', displayName: 'Pulmonary Disease' }, // Pulmonary Disease
    '2084N0400X': { specialty: 'D009464', disease: 'D009422', displayName: 'Neurology' }, // Neurology
    '207QA0000X': { specialty: 'D001237', disease: 'D000293', displayName: 'Allergy & Immunology' }, // Allergy & Immunology
    '207T00000X': { specialty: 'D010575', disease: 'D011570', displayName: 'Psychiatry' },
    '208D00000X': { specialty: 'D003131', disease: 'D003092', displayName: 'Dermatology' }, // Dermatology
    '208600000X': { specialty: 'D014022', disease: 'D014023', displayName: 'Surgery' }, // Surgery
    '208200000X': { specialty: 'D009776', disease: 'D000740', displayName: 'Obstetrics & Gynecology' }, // Obstetrics & Gynecology
    '207RS0012X': { specialty: undefined, disease: 'D035583', displayName: 'Rare Diseases' },      // Rare diseases
    '208VP0014X': { specialty: 'D010146', disease: 'D010146', displayName: 'Pain Management' }     // Pain Management
  };

  // Filter relevant specialties and map to therapeutic areas
  const therapeuticAreas = [];
  
  // Keep track of processed specialties to avoid duplicates
  const processedCodes = new Set();
  
  for (const record of records) {
    const code = record.Code;
    
    // Only process each code once
    if (processedCodes.has(code)) {
      continue;
    }
    
    // Check if this is a physician specialty we're interested in
    if (code in specialtyToMeshMapping) {
      // Use display name if available, otherwise use record name
      const name = specialtyToMeshMapping[code].displayName || 
        (record.Classification === 'Allopathic & Osteopathic Physicians' 
          ? record.Specialization 
          : record.Classification);
      
      // Create slug from name and code to ensure uniqueness
      let slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Append code to slug for subspecialties to ensure uniqueness
      if (code !== '207R00000X' && name === 'Internal Medicine') {
        // This is a subspecialty - add the code to make it unique
        slug = `${slug}-${code.toLowerCase()}`;
      }
      
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
  
  // Add Pain Management if not already included
  if (!processedCodes.has('208VP0014X')) {
    therapeuticAreas.push({
      id: '208VP0014X',
      name: 'Pain Management',
      slug: 'pain-management',
      mesh_specialty_id: 'D010146',
      mesh_disease_id: 'D010146',
      description: 'A physician who provides a high level of care, either as a primary physician or consultant, for patients experiencing problems with acute, chronic or cancer pain in both hospital and ambulatory settings. Patient care needs may also be coordinated with other specialists.',
      level: 1,
      parent_id: undefined
    });
  }
  
  console.log(`Extracted ${therapeuticAreas.length} therapeutic areas.`);
  return therapeuticAreas;
}

/**
 * Generate initial pharmaceutical class to therapeutic area mappings
 */
function generatePharmClassMappings(therapeuticAreas) {
  console.log('Generating pharmaceutical class mappings...');
  
  // Create a map for easier lookup
  const taMap = new Map();
  therapeuticAreas.forEach(ta => taMap.set(ta.id, ta));
  
  // Define common EPC to HPTCS mappings
  const epcMappings = [
    // Cardiovascular
    { id: 1, pharm_class: 'HMG-CoA Reductase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 2, pharm_class: 'Angiotensin II Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 3, pharm_class: 'Beta-Adrenergic Blocker', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 4, pharm_class: 'Angiotensin-Converting Enzyme Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 5, pharm_class: 'Calcium Channel Blocker', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 6, pharm_class: 'Antiplatelet Agent', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 7, pharm_class: 'Diuretic', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 8, pharm_class: 'PCSK9 Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 9, pharm_class: 'Cardiac Glycoside', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 10, pharm_class: 'Direct Thrombin Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    { id: 11, pharm_class: 'Factor Xa Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
    
    // Oncology
    { id: 12, pharm_class: 'Kinase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 13, pharm_class: 'Tyrosine Kinase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 14, pharm_class: 'Monoclonal Antibody', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 15, pharm_class: 'Immune Checkpoint Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 16, pharm_class: 'Histone Deacetylase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 17, pharm_class: 'Proteasome Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 18, pharm_class: 'Vascular Endothelial Growth Factor Receptor Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 19, pharm_class: 'CD20 Monoclonal Antibody', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 20, pharm_class: 'Alkylating Agent', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 21, pharm_class: 'Androgen Receptor Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 22, pharm_class: 'Aromatase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    { id: 23, pharm_class: 'Poly ADP Ribose Polymerase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
    
    // Immunology
    { id: 24, pharm_class: 'Interleukin-6 Receptor Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    { id: 25, pharm_class: 'Interleukin-1 Blocker', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    { id: 26, pharm_class: 'Janus Kinase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    { id: 27, pharm_class: 'Tumor Necrosis Factor Blocker', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    { id: 28, pharm_class: 'Interleukin-17 Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    { id: 29, pharm_class: 'Interleukin-23 Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    { id: 30, pharm_class: 'Interleukin-5 Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    { id: 31, pharm_class: 'Integrin Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
    
    // Infectious Disease
    { id: 32, pharm_class: 'Cephalosporin Antibacterial', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 33, pharm_class: 'Macrolide Antimicrobial', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 34, pharm_class: 'Carbapenem', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 35, pharm_class: 'HIV Integrase Strand Transfer Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 36, pharm_class: 'Quinolone Antimicrobial', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 37, pharm_class: 'Neuraminidase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 38, pharm_class: 'HIV Nucleoside Analog Reverse Transcriptase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 39, pharm_class: 'HIV Non-nucleoside Reverse Transcriptase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 40, pharm_class: 'Hepatitis C Virus NS5A Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 41, pharm_class: 'Hepatitis C Virus NS3/4A Protease Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    { id: 42, pharm_class: 'Hepatitis C Virus Polymerase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
    
    // Neurology
    { id: 43, pharm_class: 'Serotonin Reuptake Inhibitor', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    { id: 44, pharm_class: 'Calcitonin Gene-Related Peptide Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    { id: 45, pharm_class: 'GABA-A Receptor Agonist', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    { id: 46, pharm_class: 'N-methyl-D-aspartate Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    { id: 47, pharm_class: 'Dopamine Precursor', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    { id: 48, pharm_class: 'Dopamine Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    { id: 49, pharm_class: 'Anti-epileptic Agent', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    { id: 50, pharm_class: 'Cholinesterase Inhibitor', class_type: 'EPC', therapeutic_area_id: '2084N0400X' },
    
    // Endocrinology
    { id: 51, pharm_class: 'Sodium-Glucose Cotransporter 2 Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { id: 52, pharm_class: 'Dipeptidyl Peptidase 4 Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { id: 53, pharm_class: 'Incretin Mimetic', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { id: 54, pharm_class: 'Insulin', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { id: 55, pharm_class: 'Glucagon-Like Peptide-1 Receptor Agonist', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { id: 56, pharm_class: 'Thiazolidinedione', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { id: 57, pharm_class: 'Biguanide', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { id: 58, pharm_class: 'Sulfonylurea', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    { id: 59, pharm_class: 'Thyroid Hormone', class_type: 'EPC', therapeutic_area_id: '207RE0101X' },
    
    // Gastroenterology
    { id: 60, pharm_class: 'Proton Pump Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RG0100X' },
    { id: 61, pharm_class: 'Histamine-2 Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '207RG0100X' },
    { id: 62, pharm_class: '5-Hydroxytryptamine-3 Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '207RG0100X' },
    { id: 63, pharm_class: 'Alpha-Glucosidase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RG0100X' },
    { id: 64, pharm_class: 'Tumor Necrosis Factor Blocker', class_type: 'EPC', therapeutic_area_id: '207RG0100X' },
    
    // Pulmonary
    { id: 65, pharm_class: 'Beta-2 Adrenergic Agonist', class_type: 'EPC', therapeutic_area_id: '207RP0002X' },
    { id: 66, pharm_class: 'Muscarinic Antagonist', class_type: 'EPC', therapeutic_area_id: '207RP0002X' },
    { id: 67, pharm_class: 'Glucocorticoid', class_type: 'EPC', therapeutic_area_id: '207RP0002X' },
    { id: 68, pharm_class: 'Leukotriene Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '207RP0002X' },
    { id: 69, pharm_class: 'Phosphodiesterase-4 Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RP0002X' },
    
    // Allergy & Immunology
    { id: 70, pharm_class: 'H1 Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '207QA0000X' },
    { id: 71, pharm_class: 'Mast Cell Stabilizer', class_type: 'EPC', therapeutic_area_id: '207QA0000X' },
    { id: 72, pharm_class: 'Immunoglobulin E Blocker', class_type: 'EPC', therapeutic_area_id: '207QA0000X' },
    
    // Psychiatry
    { id: 73, pharm_class: 'Selective Serotonin Reuptake Inhibitor', class_type: 'EPC', therapeutic_area_id: '207T00000X' },
    { id: 74, pharm_class: 'Serotonin Norepinephrine Reuptake Inhibitor', class_type: 'EPC', therapeutic_area_id: '207T00000X' },
    { id: 75, pharm_class: 'Antipsychotic', class_type: 'EPC', therapeutic_area_id: '207T00000X' },
    { id: 76, pharm_class: 'Atypical Antipsychotic', class_type: 'EPC', therapeutic_area_id: '207T00000X' },
    { id: 77, pharm_class: 'Monoamine Oxidase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207T00000X' },
    { id: 78, pharm_class: 'Norepinephrine Dopamine Reuptake Inhibitor', class_type: 'EPC', therapeutic_area_id: '207T00000X' },
    
    // Nephrology
    { id: 79, pharm_class: 'Loop Diuretic', class_type: 'EPC', therapeutic_area_id: '207RN0300X' },
    { id: 80, pharm_class: 'Potassium-Sparing Diuretic', class_type: 'EPC', therapeutic_area_id: '207RN0300X' },
    { id: 81, pharm_class: 'Vasopressin Antagonist', class_type: 'EPC', therapeutic_area_id: '207RN0300X' },
    
    // Dermatology
    { id: 82, pharm_class: 'Retinoid', class_type: 'EPC', therapeutic_area_id: '208D00000X' },
    { id: 83, pharm_class: 'Calcineurin Inhibitor', class_type: 'EPC', therapeutic_area_id: '208D00000X' },
    { id: 84, pharm_class: 'Phosphodiesterase-4 Inhibitor', class_type: 'EPC', therapeutic_area_id: '208D00000X' },
    
    // Hematology
    { id: 85, pharm_class: 'Anticoagulant', class_type: 'EPC', therapeutic_area_id: '207RH0000X' },
    { id: 86, pharm_class: 'Hematopoietic Growth Factor', class_type: 'EPC', therapeutic_area_id: '207RH0000X' },
    { id: 87, pharm_class: 'Thrombopoietin Receptor Agonist', class_type: 'EPC', therapeutic_area_id: '207RH0000X' },
    
    // Vaccines
    { id: 88, pharm_class: 'Vaccine', class_type: 'EPC', therapeutic_area_id: '2080I0204X' },
    { id: 89, pharm_class: 'mRNA Vaccine', class_type: 'EPC', therapeutic_area_id: '2080I0204X' },
    { id: 90, pharm_class: 'Viral Vector Vaccine', class_type: 'EPC', therapeutic_area_id: '2080I0204X' }
  ];
  
  console.log(`Generated ${epcMappings.length} pharmaceutical class mappings.`);
  return epcMappings;
}

/**
 * Write therapeutic areas to JSON file
 */
function writeToJson(therapeuticAreas) {
  console.log(`Writing ${therapeuticAreas.length} therapeutic areas to JSON...`);
  fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(therapeuticAreas, null, 2));
  console.log(`Wrote therapeutic areas to ${JSON_OUTPUT_PATH}`);
}

/**
 * Insert therapeutic areas into database
 */
async function insertIntoDatabase(therapeuticAreas, pharmClassMappings) {
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
      .upsert(pharmClassMappings, { 
        onConflict: 'id',
        ignoreDuplicates: false
      });
    
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