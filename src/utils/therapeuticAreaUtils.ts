/**
 * Therapeutic Area Utilities
 * 
 * This file provides utility functions for accessing and managing therapeutic area data,
 * including classification of products based on pharmaceutical classes.
 */

import { supabase } from '../lib/supabase';
import type { TherapeuticArea } from '../interfaces/entities/TherapeuticArea';

// Example mock data for fallback only
const mockTherapeuticAreas: TherapeuticArea[] = [
  { 
    id: '207RC0000X', 
    name: 'Cardiology',
    slug: 'cardiology',
    description: 'Diseases of the heart and blood vessels'
  },
  {
    id: '207RO0000X',
    name: 'Oncology',
    slug: 'oncology',
    description: 'Cancer and tumors'
  },
  {
    id: '207RI0200X',
    name: 'Infectious Disease',
    slug: 'infectious-disease',
    description: 'Bacterial, viral, and fungal infections'
  }
];

/**
 * Fetches all therapeutic areas from Supabase
 */
export async function getAllTherapeuticAreas(): Promise<TherapeuticArea[]> {
  try {
    const { data, error } = await supabase
      .from('therapeutic_areas')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching therapeutic areas:', error);
      // Fall back to mock data as a last resort
      return mockTherapeuticAreas;
    }
    
    return data as TherapeuticArea[];
  } catch (error) {
    console.error('Failed to fetch therapeutic areas:', error);
    // Fall back to mock data as a last resort
    return mockTherapeuticAreas;
  }
}

/**
 * Fetches a therapeutic area by ID
 */
export async function getTherapeuticAreaById(id: string): Promise<TherapeuticArea | null> {
  try {
    const { data, error } = await supabase
      .from('therapeutic_areas')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching therapeutic area ${id}:`, error);
      // Fall back to mock data
      return mockTherapeuticAreas.find(area => area.id === id) || null;
    }
    
    return data as TherapeuticArea;
  } catch (error) {
    console.error(`Failed to fetch therapeutic area ${id}:`, error);
    // Fall back to mock data
    return mockTherapeuticAreas.find(area => area.id === id) || null;
  }
}

/**
 * Fetches a therapeutic area by slug
 */
export async function getTherapeuticAreaBySlug(slug: string): Promise<TherapeuticArea | null> {
  try {
    const { data, error } = await supabase
      .from('therapeutic_areas')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error(`Error fetching therapeutic area with slug ${slug}:`, error);
      // Fall back to mock data
      return mockTherapeuticAreas.find(area => area.slug === slug) || null;
    }
    
    return data as TherapeuticArea;
  } catch (error) {
    console.error(`Failed to fetch therapeutic area with slug ${slug}:`, error);
    // Fall back to mock data
    return mockTherapeuticAreas.find(area => area.slug === slug) || null;
  }
}

/**
 * Local pharmaceutical class mappings as fallback
 */
const localEpcMappings: Record<string, string[]> = {
  'HMG-CoA Reductase Inhibitor': ['207RC0000X'],
  'Angiotensin II Receptor Antagonist': ['207RC0000X']
  // Add more mappings as needed
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
  
  try {
    // Use fallback mapping for now until pharm_class_mappings table is available
    const matchedAreas = new Set<string>();
    
    for (const epcClass of epcClasses) {
      const areas = localEpcMappings[epcClass];
      if (areas) {
        areas.forEach(area => matchedAreas.add(area));
      }
    }
    
    return Array.from(matchedAreas);
  } catch (error) {
    console.error('Failed to classify product by EPC:', error);
    
    // Fall back to local mapping table
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
 * Map of ATC codes to therapeutic areas
 */
const atcToTherapeuticAreaMap: Record<string, string[]> = {
  'A': ['207RG0100X'], // Gastroenterology
  'A10': ['207RE0101X'] // Endocrinology (diabetes)
  // Add more mappings as needed
};

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