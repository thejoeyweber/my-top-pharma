/**
 * Therapeutic Area Utilities
 * 
 * This file provides utility functions for accessing and managing therapeutic area data,
 * including classification of products based on OpenFDA pharmaceutical classes.
 */

import { supabase } from './supabase';
import type { TherapeuticArea, PharmClassMapping } from '../types/TherapeuticArea';
import { getFeatureFlag } from './featureFlags';
import { withDataSource } from './dataSourceUtil';
import type { ContentType } from './dataSourceUtil';

// Import mock data
import therapeuticAreasData from '../data/json/therapeuticAreas.json';

/**
 * Process the therapeuticAreas.json data
 * This ensures the data has a consistent structure without trying to convert IDs
 * that are already in HPTCS format
 */
function processTherapeuticAreas(): TherapeuticArea[] {
  // Simply return the data as is - it's already in the correct format with HPTCS codes
  return therapeuticAreasData;
}

/**
 * Fetches all therapeutic areas from either the database or mock data
 */
export async function getAllTherapeuticAreas(): Promise<TherapeuticArea[]> {
  return withDataSource<TherapeuticArea[]>(
    'therapeutic_areas',
    // Static JSON function
    async () => processTherapeuticAreas(),
    // Database function
    async (isLocal) => {
      try {
        // Use a type assertion to help TypeScript understand the Supabase client
        const result = await supabase
          .from('therapeutic_areas')
          .select('*')
          .order('name');
          
        if (result.error) {
          console.error('Error fetching therapeutic areas:', result.error);
          return processTherapeuticAreas();
        }
        
        return result.data as TherapeuticArea[];
      } catch (error) {
        console.error('Failed to fetch therapeutic areas:', error);
        return processTherapeuticAreas();
      }
    }
  );
}

/**
 * Fetches a therapeutic area by ID
 */
export async function getTherapeuticAreaById(id: string): Promise<TherapeuticArea | null> {
  return withDataSource<TherapeuticArea | null>(
    'therapeutic_areas',
    // Static JSON function
    async () => {
      const mockAreas = processTherapeuticAreas();
      return mockAreas.find(area => area.id === id) || null;
    },
    // Database function
    async (isLocal) => {
      try {
        // Use a type assertion to help TypeScript understand the Supabase client
        const result = await supabase
          .from('therapeutic_areas')
          .select('*')
          .eq('id', id)
          .single();
          
        if (result.error) {
          console.error(`Error fetching therapeutic area ${id}:`, result.error);
          // Fall back to mock data
          const mockAreas = processTherapeuticAreas();
          return mockAreas.find(area => area.id === id) || null;
        }
        
        return result.data as TherapeuticArea;
      } catch (error) {
        console.error(`Failed to fetch therapeutic area ${id}:`, error);
        // Fall back to mock data
        const mockAreas = processTherapeuticAreas();
        return mockAreas.find(area => area.id === id) || null;
      }
    }
  );
}

/**
 * Fetches a therapeutic area by slug
 */
export async function getTherapeuticAreaBySlug(slug: string): Promise<TherapeuticArea | null> {
  return withDataSource<TherapeuticArea | null>(
    'therapeutic_areas',
    // Static JSON function
    async () => {
      const mockAreas = processTherapeuticAreas();
      return mockAreas.find(area => area.slug === slug) || null;
    },
    // Database function
    async (isLocal) => {
      try {
        // Use a type assertion to help TypeScript understand the Supabase client
        const result = await supabase
          .from('therapeutic_areas')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (result.error) {
          console.error(`Error fetching therapeutic area with slug ${slug}:`, result.error);
          // Fall back to mock data
          const mockAreas = processTherapeuticAreas();
          return mockAreas.find(area => area.slug === slug) || null;
        }
        
        return result.data as TherapeuticArea;
      } catch (error) {
        console.error(`Failed to fetch therapeutic area with slug ${slug}:`, error);
        // Fall back to mock data
        const mockAreas = processTherapeuticAreas();
        return mockAreas.find(area => area.slug === slug) || null;
      }
    }
  );
}

/**
 * Local pharmaceutical class mappings for when database is not being used
 * Used as a fallback for classifyProductByEPC when not using the database
 */
const localEpcMappings: Record<string, string[]> = {
  // Cardiovascular
  'HMG-CoA Reductase Inhibitor': ['207RC0000X'],
  'Angiotensin II Receptor Antagonist': ['207RC0000X'],
  'Beta-Adrenergic Blocker': ['207RC0000X'],
  'Angiotensin-Converting Enzyme Inhibitor': ['207RC0000X'],
  'Calcium Channel Blocker': ['207RC0000X'],
  'Antiplatelet Agent': ['207RC0000X'],
  'Diuretic': ['207RC0000X'],
  'PCSK9 Inhibitor': ['207RC0000X'],
  'Cardiac Glycoside': ['207RC0000X'],
  'Direct Thrombin Inhibitor': ['207RC0000X'],
  'Factor Xa Inhibitor': ['207RC0000X'],
  
  // Oncology
  'Kinase Inhibitor': ['207RO0000X'],
  'Tyrosine Kinase Inhibitor': ['207RO0000X'],
  'Monoclonal Antibody': ['207RO0000X', '207RI0011X'], // Could be both oncology and immunology
  'Immune Checkpoint Inhibitor': ['207RO0000X'],
  'Histone Deacetylase Inhibitor': ['207RO0000X'],
  'Proteasome Inhibitor': ['207RO0000X'],
  'Vascular Endothelial Growth Factor Receptor Inhibitor': ['207RO0000X'],
  'CD20 Monoclonal Antibody': ['207RO0000X'],
  'Alkylating Agent': ['207RO0000X'],
  'Androgen Receptor Inhibitor': ['207RO0000X'],
  'Aromatase Inhibitor': ['207RO0000X'],
  'Poly ADP Ribose Polymerase Inhibitor': ['207RO0000X'],
  
  // Immunology
  'Interleukin-6 Receptor Inhibitor': ['207RI0011X'],
  'Interleukin-1 Blocker': ['207RI0011X'],
  'Janus Kinase Inhibitor': ['207RI0011X'],
  'Tumor Necrosis Factor Blocker': ['207RI0011X', '207RG0100X'], // Both immunology and gastroenterology
  'Interleukin-17 Inhibitor': ['207RI0011X'],
  'Interleukin-23 Inhibitor': ['207RI0011X'],
  'Interleukin-5 Receptor Antagonist': ['207RI0011X'],
  'Integrin Receptor Antagonist': ['207RI0011X'],
  
  // Infectious Disease
  'Cephalosporin Antibacterial': ['207RI0200X'],
  'Macrolide Antimicrobial': ['207RI0200X'],
  'Carbapenem': ['207RI0200X'],
  'HIV Integrase Strand Transfer Inhibitor': ['207RI0200X'],
  'Quinolone Antimicrobial': ['207RI0200X'],
  'Neuraminidase Inhibitor': ['207RI0200X'],
  'HIV Nucleoside Analog Reverse Transcriptase Inhibitor': ['207RI0200X'],
  'HIV Non-nucleoside Reverse Transcriptase Inhibitor': ['207RI0200X'],
  'Hepatitis C Virus NS5A Inhibitor': ['207RI0200X'],
  'Hepatitis C Virus NS3/4A Protease Inhibitor': ['207RI0200X'],
  'Hepatitis C Virus Polymerase Inhibitor': ['207RI0200X'],
  
  // Neurology
  'Serotonin Reuptake Inhibitor': ['2084N0400X'],
  'Calcitonin Gene-Related Peptide Receptor Antagonist': ['2084N0400X'],
  'GABA-A Receptor Agonist': ['2084N0400X'],
  'N-methyl-D-aspartate Receptor Antagonist': ['2084N0400X'],
  'Dopamine Precursor': ['2084N0400X'],
  'Dopamine Receptor Antagonist': ['2084N0400X'],
  'Anti-epileptic Agent': ['2084N0400X'],
  'Cholinesterase Inhibitor': ['2084N0400X'],
  
  // Endocrinology
  'Sodium-Glucose Cotransporter 2 Inhibitor': ['207RE0101X'],
  'Dipeptidyl Peptidase 4 Inhibitor': ['207RE0101X'],
  'Incretin Mimetic': ['207RE0101X'],
  'Insulin': ['207RE0101X'],
  'Glucagon-Like Peptide-1 Receptor Agonist': ['207RE0101X'],
  'Thiazolidinedione': ['207RE0101X'],
  'Biguanide': ['207RE0101X'],
  'Sulfonylurea': ['207RE0101X'],
  'Thyroid Hormone': ['207RE0101X'],
  
  // Gastroenterology
  'Proton Pump Inhibitor': ['207RG0100X'],
  'Histamine-2 Receptor Antagonist': ['207RG0100X'],
  '5-Hydroxytryptamine-3 Receptor Antagonist': ['207RG0100X'],
  'Alpha-Glucosidase Inhibitor': ['207RG0100X'],
  
  // Pulmonary
  'Beta-2 Adrenergic Agonist': ['207RP0002X'],
  'Muscarinic Antagonist': ['207RP0002X'],
  'Glucocorticoid': ['207RP0002X', '207RI0011X'], // Could be pulmonary or immunology
  'Leukotriene Receptor Antagonist': ['207RP0002X'],
  'Phosphodiesterase-4 Inhibitor': ['207RP0002X', '208D00000X'], // Could be pulmonary or dermatology
  
  // Allergy & Immunology
  'H1 Receptor Antagonist': ['207QA0000X'],
  'Mast Cell Stabilizer': ['207QA0000X'],
  'Immunoglobulin E Blocker': ['207QA0000X'],
  
  // Psychiatry
  'Selective Serotonin Reuptake Inhibitor': ['207T00000X'],
  'Serotonin Norepinephrine Reuptake Inhibitor': ['207T00000X'],
  'Antipsychotic': ['207T00000X'],
  'Atypical Antipsychotic': ['207T00000X'],
  'Monoamine Oxidase Inhibitor': ['207T00000X'],
  'Norepinephrine Dopamine Reuptake Inhibitor': ['207T00000X'],
  
  // Nephrology
  'Loop Diuretic': ['207RN0300X'],
  'Potassium-Sparing Diuretic': ['207RN0300X'],
  'Vasopressin Antagonist': ['207RN0300X'],
  
  // Dermatology
  'Retinoid': ['208D00000X'],
  'Calcineurin Inhibitor': ['208D00000X'],
  
  // Hematology
  'Anticoagulant': ['207RH0000X'],
  'Hematopoietic Growth Factor': ['207RH0000X'],
  'Thrombopoietin Receptor Agonist': ['207RH0000X'],
  
  // Vaccines
  'Vaccine': ['2080I0204X'],
  'mRNA Vaccine': ['2080I0204X'],
  'Viral Vector Vaccine': ['2080I0204X'],

  // Pain Management
  'Opioid Analgesic': ['208VP0014X'],
  'Non-Steroidal Anti-Inflammatory Drug': ['208VP0014X', '208D00000X'], // Pain or Dermatology
  'Cyclooxygenase-2 Selective Inhibitor': ['208VP0014X'],
  'Opioid Receptor Antagonist': ['208VP0014X']
};

/**
 * Map of ATC codes to therapeutic areas
 * Used by classifyProductByRxCUI when fetching ATC classes from RxClass API
 */
const atcToTherapeuticAreaMap: Record<string, string[]> = {
  // A - Alimentary tract and metabolism
  'A': ['207RG0100X'], // Gastroenterology
  'A10': ['207RE0101X'], // Endocrinology (diabetes)
  
  // B - Blood and blood forming organs
  'B': ['207RH0000X'], // Hematology
  
  // C - Cardiovascular system
  'C': ['207RC0000X'], // Cardiology
  
  // D - Dermatologicals
  'D': ['208D00000X'], // Dermatology
  
  // G - Genito-urinary system and sex hormones
  'G': ['208200000X'], // Obstetrics & Gynecology
  
  // H - Systemic hormonal preparations, excluding sex hormones and insulins
  'H': ['207RE0101X'], // Endocrinology
  
  // J - Antiinfectives for systemic use
  'J': ['207RI0200X'], // Infectious Disease
  'J07': ['2080I0204X'], // Vaccines
  
  // L - Antineoplastic and immunomodulating agents
  'L01': ['207RO0000X'], // Oncology
  'L04': ['207RI0011X'], // Immunology
  
  // M - Musculo-skeletal system
  'M': ['208VP0014X'], // Pain Management
  
  // N - Nervous system
  'N': ['2084N0400X'], // Neurology
  'N05': ['207T00000X'], // Psychiatry (psycholeptics)
  'N06': ['207T00000X'], // Psychiatry (psychoanaleptics)
  'N02': ['208VP0014X'], // Pain Management (analgesics)
  
  // P - Antiparasitic products, insecticides and repellents
  'P': ['207RI0200X'], // Infectious Disease
  
  // R - Respiratory system
  'R': ['207RP0002X'], // Pulmonary
  'R06': ['207QA0000X'], // Allergy & Immunology (antihistamines)
  
  // S - Sensory organs
  'S01': ['207W00000X'], // Ophthalmology
  
  // V - Various
  'V': ['207R00000X'] // General Internal Medicine (fallback)
};

/**
 * Classifies a product by its Established Pharmacologic Classes (EPCs)
 * 
 * @param epcClasses Array of EPC values from OpenFDA
 * @returns Array of matching therapeutic area IDs
 */
export async function classifyProductByEPC(epcClasses: string[]): Promise<string[]> {
  if (!epcClasses || epcClasses.length === 0) {
    return [];
  }
  
  const useDatabase = getFeatureFlag('USE_DATABASE_THERAPEUTIC_AREAS');
  
  if (useDatabase) {
    try {
      const { data, error } = await supabase
        .from('pharm_class_mappings')
        .select('therapeutic_area_id')
        .in('pharm_class', epcClasses)
        .eq('class_type', 'EPC');
        
      if (error) {
        console.error('Error classifying product by EPC:', error);
        return [];
      }
      
      // Extract unique therapeutic area IDs
      type MappingResult = { therapeutic_area_id: string };
      const taIds = data.map((mapping: MappingResult) => mapping.therapeutic_area_id);
      return [...new Set(taIds)] as string[];
    } catch (error) {
      console.error('Failed to classify product by EPC:', error);
      return [];
    }
  } else {
    // When not using the database, use local mapping table
    const matchedAreas = new Set<string>();
    
    for (const epcClass of epcClasses) {
      const areas = localEpcMappings[epcClass];
      if (areas) {
        areas.forEach(area => matchedAreas.add(area));
      }
    }
    
    return Array.from(matchedAreas);
  }
}

/**
 * Classifies a product by RxCUI using the RxClass API
 * 
 * @param rxcuis Array of RxCUI values from OpenFDA
 * @returns Array of matching therapeutic area IDs
 */
export async function classifyProductByRxCUI(rxcuis: string[]): Promise<string[]> {
  if (!rxcuis || rxcuis.length === 0) {
    return [];
  }

  try {
    // Keep track of all therapeutic areas matched
    const therapeuticAreas = new Set<string>();
    
    // Call RxClass API for each RxCUI
    const promises = rxcuis.map(rxcui => 
      fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${rxcui}&relaSource=ATC`)
        .then(res => res.json())
    );
    
    const results = await Promise.all(promises);
    
    // Process RxClass API results
    for (const result of results) {
      if (result?.rxclassDrugInfoList?.rxclassDrugInfo) {
        for (const classInfo of result.rxclassDrugInfoList.rxclassDrugInfo) {
          const classId = classInfo?.rxclassMinConceptItem?.classId;
          
          if (!classId) continue;
          
          // Map ATC code to therapeutic areas
          // First, try for exact match
          if (atcToTherapeuticAreaMap[classId]) {
            atcToTherapeuticAreaMap[classId].forEach(ta => therapeuticAreas.add(ta));
          } else {
            // Try for prefix match for hierarchical ATC codes (e.g., 'N02' matches 'N')
            for (const atcPrefix of Object.keys(atcToTherapeuticAreaMap)) {
              if (classId.startsWith(atcPrefix)) {
                atcToTherapeuticAreaMap[atcPrefix].forEach(ta => therapeuticAreas.add(ta));
                break;
              }
            }
          }
        }
      }
    }
    
    return Array.from(therapeuticAreas) as string[];
  } catch (error) {
    console.error('Failed to classify product by RxCUI:', error);
    return [];
  }
}

/**
 * Utility function to convert HPTCS codes to their human-readable names in one call
 * 
 * @param codes Array of HPTCS codes
 * @returns Object mapping HPTCS codes to their names
 */
export async function getTherapeuticAreaNamesMap(taIds: string[]): Promise<Record<string, string>> {
  // Get all therapeutic areas
  const allAreas = await getAllTherapeuticAreas();
  
  // Create a map of ID to name
  const idToNameMap: Record<string, string> = {};
  
  // Only process if we have a valid array of IDs
  if (Array.isArray(taIds)) {
    taIds.forEach(id => {
      const area = allAreas.find(a => a.id === id);
      idToNameMap[id] = area ? area.name : id;
    });
  }
  
  return idToNameMap;
}

/**
 * Usage example for therapeutic area classification:
 * 
 * import { classifyProductByEPC, classifyProductByRxCUI } from '../utils/therapeuticAreaUtils';
 * 
 * // Classify by EPC
 * const epcClasses = ['HMG-CoA Reductase Inhibitor', 'Angiotensin II Receptor Antagonist'];
 * const tasByEpc = await classifyProductByEPC(epcClasses);
 * 
 * // Classify by RxCUI
 * const rxcuis = ['153165', '310965'];
 * const tasByRxCui = await classifyProductByRxCUI(rxcuis);
 * 
 * // Combine results for better coverage
 * const combinedTas = [...new Set([...tasByEpc, ...tasByRxCui])];
 */ 