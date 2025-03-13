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
          id: number;
          name: string;
          slug: string;
          website: string | null;
          logo_url: string | null;
          description: string | null;
          founded_year: number | null;
          headquarters: string | null;
          employee_count: number | null;
          revenue_usd: number | null;
          public_company: boolean;
          stock_symbol: string | null;
          stock_exchange: string | null;
          ticker: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          website?: string | null;
          logo_url?: string | null;
          description?: string | null;
          founded_year?: number | null;
          headquarters?: string | null;
          employee_count?: number | null;
          revenue_usd?: number | null;
          public_company?: boolean;
          stock_symbol?: string | null;
          stock_exchange?: string | null;
          ticker?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          website?: string | null;
          logo_url?: string | null;
          description?: string | null;
          founded_year?: number | null;
          headquarters?: string | null;
          employee_count?: number | null;
          revenue_usd?: number | null;
          public_company?: boolean;
          stock_symbol?: string | null;
          stock_exchange?: string | null;
          ticker?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      data_sources: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          base_url: string | null;
          auth_type: string | null;
          auth_key: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          base_url?: string | null;
          auth_type?: string | null;
          auth_key?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          base_url?: string | null;
          auth_type?: string | null;
          auth_key?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      data_source_endpoints: {
        Row: {
          id: number;
          data_source_id: number;
          name: string;
          endpoint_path: string;
          description: string | null;
          is_active: boolean;
          target_table: string;
          field_mapping: Json | null;
          configuration: Json | null;
          last_run_at: string | null;
          last_success_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          data_source_id: number;
          name: string;
          endpoint_path: string;
          description?: string | null;
          is_active?: boolean;
          target_table: string;
          field_mapping?: Json | null;
          configuration?: Json | null;
          last_run_at?: string | null;
          last_success_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          data_source_id?: number;
          name?: string;
          endpoint_path?: string;
          description?: string | null;
          is_active?: boolean;
          target_table?: string;
          field_mapping?: Json | null;
          configuration?: Json | null;
          last_run_at?: string | null;
          last_success_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      company_financials: {
        Row: {
          id: number;
          company_id: number;
          period: string;
          fiscal_date: string;
          revenue: number | null;
          gross_profit: number | null;
          net_income: number | null;
          ebitda: number | null;
          r_and_d_expense: number | null;
          eps: number | null;
          shares_outstanding: number | null;
          source: string;
          source_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          company_id: number;
          period: string;
          fiscal_date: string;
          revenue?: number | null;
          gross_profit?: number | null;
          net_income?: number | null;
          ebitda?: number | null;
          r_and_d_expense?: number | null;
          eps?: number | null;
          shares_outstanding?: number | null;
          source: string;
          source_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          company_id?: number;
          period?: string;
          fiscal_date?: string;
          revenue?: number | null;
          gross_profit?: number | null;
          net_income?: number | null;
          ebitda?: number | null;
          r_and_d_expense?: number | null;
          eps?: number | null;
          shares_outstanding?: number | null;
          source?: string;
          source_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      company_metrics: {
        Row: {
          id: number;
          company_id: number;
          date: string;
          pe_ratio: number | null;
          pb_ratio: number | null;
          price_to_sales: number | null;
          dividend_yield: number | null;
          debt_to_equity: number | null;
          roa: number | null;
          roe: number | null;
          current_ratio: number | null;
          quick_ratio: number | null;
          source: string;
          source_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          company_id: number;
          date: string;
          pe_ratio?: number | null;
          pb_ratio?: number | null;
          price_to_sales?: number | null;
          dividend_yield?: number | null;
          debt_to_equity?: number | null;
          roa?: number | null;
          roe?: number | null;
          current_ratio?: number | null;
          quick_ratio?: number | null;
          source: string;
          source_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          company_id?: number;
          date?: string;
          pe_ratio?: number | null;
          pb_ratio?: number | null;
          price_to_sales?: number | null;
          dividend_yield?: number | null;
          debt_to_equity?: number | null;
          roa?: number | null;
          roe?: number | null;
          current_ratio?: number | null;
          quick_ratio?: number | null;
          source?: string;
          source_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      company_stock_data: {
        Row: {
          id: number;
          company_id: number;
          date: string;
          open: number | null;
          high: number | null;
          low: number | null;
          close: number | null;
          adjusted_close: number | null;
          volume: number | null;
          source: string;
          source_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          company_id: number;
          date: string;
          open?: number | null;
          high?: number | null;
          low?: number | null;
          close?: number | null;
          adjusted_close?: number | null;
          volume?: number | null;
          source: string;
          source_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          company_id?: number;
          date?: string;
          open?: number | null;
          high?: number | null;
          low?: number | null;
          close?: number | null;
          adjusted_close?: number | null;
          volume?: number | null;
          source?: string;
          source_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      data_ingestion_logs: {
        Row: {
          id: number;
          data_source_id: number | null;
          endpoint_id: number | null;
          records_processed: number | null;
          records_added: number | null;
          records_updated: number | null;
          status: string;
          error_message: string | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: number;
          data_source_id?: number | null;
          endpoint_id?: number | null;
          records_processed?: number | null;
          records_added?: number | null;
          records_updated?: number | null;
          status: string;
          error_message?: string | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: number;
          data_source_id?: number | null;
          endpoint_id?: number | null;
          records_processed?: number | null;
          records_added?: number | null;
          records_updated?: number | null;
          status?: string;
          error_message?: string | null;
          started_at?: string;
          completed_at?: string | null;
        };
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