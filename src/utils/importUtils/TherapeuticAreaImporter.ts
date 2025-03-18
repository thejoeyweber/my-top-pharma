/**
 * TherapeuticAreaImporter
 * 
 * Specific implementation of BaseImporter for handling
 * Healthcare Provider Taxonomy Code Set (HPTCS) data to create
 * standardized therapeutic areas with MeSH references.
 */

import { BaseImporter } from './BaseImporter';
import type { ImportStatistics } from './BaseImporter';
import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { parse } from 'csv-parse/sync';
import * as stringUtils from '../../utils/stringUtils';

// Define types for our data
interface TherapeuticAreaData {
  id: string;
  name: string;
  slug: string;
  mesh_specialty_id?: string;
  mesh_disease_id?: string;
  description?: string;
  level: number;
  parent_id?: string;
  is_primary?: boolean;
}

interface PharmClassMapping {
  id: number;
  pharm_class: string;
  class_type: string;
  therapeutic_area_id: string;
}

// NUCC Taxonomy URL - this URL may change periodically
const NUCC_TAXONOMY_URL = 'https://nucc.org/images/stories/CSV/nucc_taxonomy_231.csv';

export class TherapeuticAreaImporter extends BaseImporter {
  private csvFilePath: string;
  private therapeuticAreas: TherapeuticAreaData[] = [];
  private pharmClassMappings: PharmClassMapping[] = [];

  constructor() {
    // Therapeutic Areas data source ID is 2, table is 'therapeutic_areas', backup dir is 'ta'
    super(2, 'therapeutic_areas', 'ta');
    this.csvFilePath = path.join(process.cwd(), 'scripts', 'nucc_taxonomy.csv');
  }

  /**
   * Get the current statistics for the import process
   */
  public getStatistics(): ImportStatistics {
    return this.statistics;
  }

  /**
   * Execute the therapeutic area import process
   */
  protected async executeImport(): Promise<void> {
    // Download the CSV file if it doesn't exist
    await this.downloadTaxonomyFile();
    
    // Extract therapeutic areas from the CSV
    this.extractSpecialties();
    
    // Generate pharmaceutical class mappings
    this.generatePharmClassMappings();
    
    // Save data to backup before database insertion
    await this.saveBackup(this.therapeuticAreas, 'therapeutic-areas');
    
    // Insert into database
    await this.batchUpsert(this.transformToDbFormat(this.therapeuticAreas), 50, 'id');
    
    // Insert pharmaceutical class mappings if we have them
    if (this.pharmClassMappings.length > 0) {
      await this.insertPharmClassMappings();
    }
  }

  /**
   * Download the NUCC Taxonomy CSV file
   */
  private async downloadTaxonomyFile(): Promise<void> {
    try {
      // Check if file already exists
      try {
        await fs.access(this.csvFilePath);
        console.log('CSV file already exists. Using existing file.');
        return;
      } catch (error: unknown) {
        // File doesn't exist, continue with download
      }

      console.log(`Downloading NUCC Taxonomy CSV from ${NUCC_TAXONOMY_URL}...`);
      
      // Create write stream for the file
      const fileStream = fs.open(this.csvFilePath, 'w');
      
      // Download the file
      const response = await new Promise<Buffer>((resolve, reject) => {
        https.get(NUCC_TAXONOMY_URL, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to download: ${res.statusCode} ${res.statusMessage}`));
            return;
          }
          
          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
        }).on('error', reject);
      });
      
      // Write the downloaded data to the file
      const file = await fileStream;
      await file.write(response);
      await file.close();
      
      console.log('Download complete.');
    } catch (error: unknown) {
      console.error('Error downloading taxonomy file:', error);
      throw new Error(`Failed to download taxonomy file: ${(error as Error).message}`);
    }
  }

  /**
   * Parse the CSV file and extract relevant specialties
   */
  private async extractSpecialties(): Promise<void> {
    console.log('Parsing CSV file and extracting specialties...');
    
    try {
      // Read and parse the CSV file
      const csvData = await fs.readFile(this.csvFilePath, 'utf8');
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true
      });

      // Dictionary to map from specialty codes to MeSH IDs
      const specialtyToMeshMapping: Record<string, { specialty?: string, disease?: string, displayName?: string }> = {
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
      const therapeuticAreas: TherapeuticAreaData[] = [];
      
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
          // Use display name if available, otherwise use record name
          const name = specialtyToMeshMapping[code].displayName || 
            (record.Classification === 'Allopathic & Osteopathic Physicians' 
              ? record.Specialization 
              : record.Classification);
          
          // Create slug from name
          const slug = stringUtils.generateSlug(name);
          
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
            parent_id: undefined,
            is_primary: true
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
        parent_id: '207RI0200X', // Parent: Infectious Disease
        is_primary: false
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
          parent_id: undefined,
          is_primary: true
        });
      }
      
      console.log(`Extracted ${therapeuticAreas.length} therapeutic areas.`);
      this.therapeuticAreas = therapeuticAreas;
      this.statistics.processed = therapeuticAreas.length;
    } catch (error: unknown) {
      console.error('Error extracting specialties:', error);
      throw new Error(`Failed to extract specialties: ${error}`);
    }
  }

  /**
   * Generate initial pharmaceutical class to therapeutic area mappings
   */
  private generatePharmClassMappings(): void {
    console.log('Generating pharmaceutical class mappings...');
    
    try {
      // Create a map for easier lookup
      const taMap = new Map<string, TherapeuticAreaData>();
      this.therapeuticAreas.forEach(ta => taMap.set(ta.id, ta));
      
      // Define common EPC to HPTCS mappings
      const epcMappings: PharmClassMapping[] = [
        // Cardiovascular
        { id: 1, pharm_class: 'HMG-CoA Reductase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
        { id: 2, pharm_class: 'Angiotensin II Receptor Antagonist', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
        { id: 3, pharm_class: 'Beta-Adrenergic Blocker', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
        { id: 4, pharm_class: 'Angiotensin-Converting Enzyme Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
        { id: 5, pharm_class: 'Calcium Channel Blocker', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
        { id: 6, pharm_class: 'Antiplatelet Agent', class_type: 'EPC', therapeutic_area_id: '207RC0000X' },
        
        // Oncology
        { id: 12, pharm_class: 'Kinase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
        { id: 13, pharm_class: 'Tyrosine Kinase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
        { id: 14, pharm_class: 'Monoclonal Antibody', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
        { id: 15, pharm_class: 'Immune Checkpoint Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RO0000X' },
        
        // Immunology
        { id: 24, pharm_class: 'Interleukin-6 Receptor Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
        { id: 25, pharm_class: 'Interleukin-1 Blocker', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
        { id: 26, pharm_class: 'Janus Kinase Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
        { id: 27, pharm_class: 'Tumor Necrosis Factor Blocker', class_type: 'EPC', therapeutic_area_id: '207RI0011X' },
        
        // Infectious Disease
        { id: 32, pharm_class: 'Cephalosporin Antibacterial', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
        { id: 33, pharm_class: 'Macrolide Antimicrobial', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
        { id: 34, pharm_class: 'Carbapenem', class_type: 'EPC', therapeutic_area_id: '207RI0200X' },
        { id: 35, pharm_class: 'HIV Integrase Strand Transfer Inhibitor', class_type: 'EPC', therapeutic_area_id: '207RI0200X' }
      ];
      
      // Validate mappings against available therapeutic areas
      this.pharmClassMappings = epcMappings.filter(mapping => {
        if (!taMap.has(mapping.therapeutic_area_id)) {
          console.warn(`Pharmaceutical class mapping references unknown therapeutic area ID: ${mapping.therapeutic_area_id}`);
          return false;
        }
        return true;
      });
      
      console.log(`Generated ${this.pharmClassMappings.length} pharmaceutical class mappings.`);
    } catch (error: unknown) {
      console.error('Error generating pharmaceutical class mappings:', error);
      // Not throwing here as this is not critical for the main import
    }
  }

  /**
   * Insert pharmaceutical class mappings into the database
   */
  private async insertPharmClassMappings(): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    console.log(`Inserting ${this.pharmClassMappings.length} pharmaceutical class mappings...`);
    
    try {
      const { error } = await this.supabase
        .from('pharmaceutical_class_mappings')
        .upsert(this.pharmClassMappings, { 
          onConflict: 'id',
          count: 'exact'
        });
        
      if (error) {
        console.error('Error inserting pharmaceutical class mappings:', error);
      } else {
        console.log('Pharmaceutical class mappings inserted successfully.');
      }
    } catch (error: unknown) {
      console.error('Error inserting pharmaceutical class mappings:', error);
    }
  }

  /**
   * Transform the therapeutic areas to the database format
   */
  private transformToDbFormat(therapeuticAreas: TherapeuticAreaData[]): any[] {
    return therapeuticAreas.map(ta => ({
      id: ta.id,
      name: ta.name,
      slug: ta.slug,
      description: ta.description || null,
      mesh_specialty_id: ta.mesh_specialty_id || null,
      mesh_disease_id: ta.mesh_disease_id || null,
      level: ta.level,
      parent_id: ta.parent_id || null,
      is_primary: ta.is_primary || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }
} 