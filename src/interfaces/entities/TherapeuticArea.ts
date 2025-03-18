/**
 * Therapeutic Area Interface
 * 
 * Defines the structure of therapeutic area entities used throughout the application.
 */

export interface TherapeuticArea {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconPath?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Mapping between pharmaceutical classes and therapeutic areas
 */
export interface PharmClassMapping {
  id: string;
  pharmClass: string;
  classType: string; // e.g., 'EPC', 'ATC', 'MeSH'
  therapeuticAreaId: string;
}

import type { Database } from '../../types/database';

// Database types for reference
export type DbTherapeuticArea = Database['public']['Tables']['therapeutic_areas']['Row'];
export type DbTherapeuticAreaInsert = Database['public']['Tables']['therapeutic_areas']['Insert'];
export type DbTherapeuticAreaUpdate = Database['public']['Tables']['therapeutic_areas']['Update'];

/**
 * Converts a database therapeutic area record to the application TherapeuticArea model
 */
export function dbTherapeuticAreaToTherapeuticArea(dbTherapeuticArea: DbTherapeuticArea): TherapeuticArea {
  return {
    id: dbTherapeuticArea.id,
    name: dbTherapeuticArea.name,
    slug: dbTherapeuticArea.slug,
    description: dbTherapeuticArea.description || '',
    iconPath: dbTherapeuticArea.icon_path || undefined,
    createdAt: dbTherapeuticArea.created_at || undefined,
    updatedAt: dbTherapeuticArea.updated_at || undefined
  };
}

/**
 * Converts an application TherapeuticArea model to a database insert record
 */
export function therapeuticAreaToDbTherapeuticArea(
  therapeuticArea: Partial<TherapeuticArea>
): Partial<DbTherapeuticArea> {
  return {
    id: therapeuticArea.id,
    name: therapeuticArea.name,
    description: therapeuticArea.description || null,
    slug: therapeuticArea.slug,
    icon_path: therapeuticArea.iconPath || null,
  };
} 