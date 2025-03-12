/**
 * Database Types
 * 
 * Type definitions for Supabase database schema.
 * These types ensure type safety when interacting with the database.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          ticker: string;
          sector: string | null;
          industry: string | null;
          market_cap: number | null;
          cik: string | null;
          isin: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          ticker: string;
          sector?: string | null;
          industry?: string | null;
          market_cap?: number | null;
          cik?: string | null;
          isin?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          ticker?: string;
          sector?: string | null;
          industry?: string | null;
          market_cap?: number | null;
          cik?: string | null;
          isin?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

/**
 * Type for the raw company data from the database
 * This is used when fetching company data directly from Supabase
 */
export type DbCompany = Database['public']['Tables']['companies']['Row'];

/**
 * Type for inserting a new company into the database
 */
export type DbCompanyInsert = Database['public']['Tables']['companies']['Insert'];

/**
 * Type for updating an existing company in the database
 */
export type DbCompanyUpdate = Database['public']['Tables']['companies']['Update']; 