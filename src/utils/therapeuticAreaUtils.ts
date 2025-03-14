/**
 * Therapeutic Area Utilities
 * 
 * This file provides utility functions for accessing and managing therapeutic area data,
 * including classification of products based on OpenFDA pharmaceutical classes.
 */

import { supabase } from './supabase';
import type { TherapeuticArea, PharmClassMapping } from '../types/TherapeuticArea';
import { getFeatureFlag } from './featureFlags';

// Import mock data
import therapeuticAreasData from '../data/json/therapeuticAreas.json';

/**
 * Convert the current therapeuticAreas.json data to match the new HPTCS format
 * This is a temporary function for backwards compatibility during transition
 */
function mapLegacyTherapeuticAreas(): TherapeuticArea[] {
  // Map from old ID to HPTCS code and MeSH references
  const hptcsMapping: Record<string, Partial<TherapeuticArea>> = {
    'oncology': {
      id: '207RO0000X',
      mesh_specialty_id: 'D009367',
      mesh_disease_id: 'D009369',
      description: 'Medical specialty focused on the study and treatment of cancer',
      level: 1
    },
    'immunology': {
      id: '207RI0011X',
      mesh_specialty_id: 'D007167',
      mesh_disease_id: 'D007155',
      description: 'Medical specialty focused on immune system disorders',
      level: 1
    },
    'neuroscience': {
      id: '2084N0400X',
      mesh_specialty_id: 'D009464',
      mesh_disease_id: 'D009422',
      description: 'Medical specialty focused on the nervous system and its disorders',
      level: 1
    },
    'cardiovascular': {
      id: '207RC0000X',
      mesh_specialty_id: 'D002309',
      mesh_disease_id: 'D002318',
      description: 'Medical specialty focused on the heart and vascular system',
      level: 1
    },
    'infectious-diseases': {
      id: '207RI0200X',
      mesh_specialty_id: 'D015673',
      mesh_disease_id: 'D007239',
      description: 'Medical specialty focused on diseases caused by pathogens',
      level: 1
    },
    'vaccines': {
      id: '2080I0204X',
      mesh_specialty_id: 'D053823',
      mesh_disease_id: undefined,
      description: 'Development and administration of vaccines for disease prevention',
      level: 2
    },
    'rare-diseases': {
      id: '207RS0012X',
      mesh_specialty_id: undefined,
      mesh_disease_id: 'D035583',
      description: 'Medical specialty focused on diseases affecting small numbers of patients',
      level: 1
    }
  };

  return therapeuticAreasData.map(ta => {
    const mapping = hptcsMapping[ta.id] || {};
    return {
      ...ta,
      id: mapping.id || ta.id,
      slug: ta.id, // use the existing id as slug for compatibility
      mesh_specialty_id: mapping.mesh_specialty_id,
      mesh_disease_id: mapping.mesh_disease_id,
      description: mapping.description || '',
      level: mapping.level || 1,
      parent_id: undefined
    } as unknown as TherapeuticArea;
  });
}

/**
 * Fetches all therapeutic areas from either the database or mock data
 */
export async function getAllTherapeuticAreas(): Promise<TherapeuticArea[]> {
  const useDatabase = getFeatureFlag('USE_DATABASE_THERAPEUTIC_AREAS');
  
  if (useDatabase) {
    try {
      const { data, error } = await supabase
        .from('therapeutic_areas')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching therapeutic areas:', error);
        return mapLegacyTherapeuticAreas();
      }
      
      return data as TherapeuticArea[];
    } catch (error) {
      console.error('Failed to fetch therapeutic areas:', error);
      return mapLegacyTherapeuticAreas();
    }
  } else {
    // Use mock data with added HPTCS fields
    return mapLegacyTherapeuticAreas();
  }
}

/**
 * Fetches a therapeutic area by ID
 */
export async function getTherapeuticAreaById(id: string): Promise<TherapeuticArea | null> {
  const useDatabase = getFeatureFlag('USE_DATABASE_THERAPEUTIC_AREAS');
  
  if (useDatabase) {
    try {
      const { data, error } = await supabase
        .from('therapeutic_areas')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error(`Error fetching therapeutic area ${id}:`, error);
        // Fall back to mock data
        const mockAreas = mapLegacyTherapeuticAreas();
        return mockAreas.find(area => area.id === id) || null;
      }
      
      return data as TherapeuticArea;
    } catch (error) {
      console.error(`Failed to fetch therapeutic area ${id}:`, error);
      // Fall back to mock data
      const mockAreas = mapLegacyTherapeuticAreas();
      return mockAreas.find(area => area.id === id) || null;
    }
  } else {
    // Use mock data
    const mockAreas = mapLegacyTherapeuticAreas();
    return mockAreas.find(area => area.id === id) || null;
  }
}

/**
 * Fetches a therapeutic area by slug
 */
export async function getTherapeuticAreaBySlug(slug: string): Promise<TherapeuticArea | null> {
  const useDatabase = getFeatureFlag('USE_DATABASE_THERAPEUTIC_AREAS');
  
  if (useDatabase) {
    try {
      const { data, error } = await supabase
        .from('therapeutic_areas')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) {
        console.error(`Error fetching therapeutic area with slug ${slug}:`, error);
        // Fall back to mock data
        const mockAreas = mapLegacyTherapeuticAreas();
        return mockAreas.find(area => area.slug === slug) || null;
      }
      
      return data as TherapeuticArea;
    } catch (error) {
      console.error(`Failed to fetch therapeutic area with slug ${slug}:`, error);
      // Fall back to mock data
      const mockAreas = mapLegacyTherapeuticAreas();
      return mockAreas.find(area => area.slug === slug) || null;
    }
  } else {
    // Use mock data
    const mockAreas = mapLegacyTherapeuticAreas();
    return mockAreas.find(area => area.slug === slug) || null;
  }
}

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
    // When not using the database, we can't classify by EPC
    // This would require a local mapping table
    return [];
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

  // For now we'll implement a simplified version without calling RxClass API
  // In a full implementation, we would:
  // 1. Call RxClass API to get ATC classes for the RxCUI
  // 2. Map ATC classes to therapeutic areas
  
  // This is a placeholder implementation
  console.log('RxCUI classification would use:', rxcuis);
  return [];
  
  // Future implementation would look like:
  /*
  try {
    // Call RxClass API for each RxCUI
    const promises = rxcuis.map(rxcui => 
      fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${rxcui}&relaSource=ATC`)
        .then(res => res.json())
    );
    
    const results = await Promise.all(promises);
    
    // Process results...
    
  } catch (error) {
    console.error('Failed to classify product by RxCUI:', error);
    return [];
  }
  */
} 