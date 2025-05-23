export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      alert_subscriptions: {
        Row: {
          created_at: string | null
          frequency: string | null
          id: string
          last_sent: string | null
          reference_id: string | null
          type_of_alert: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          frequency?: string | null
          id?: string
          last_sent?: string | null
          reference_id?: string | null
          type_of_alert?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          frequency?: string | null
          id?: string
          last_sent?: string | null
          reference_id?: string | null
          type_of_alert?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          employees: number | null
          founded: number | null
          header_image_url: string | null
          headquarters: string | null
          id: string
          logo_url: string | null
          market_cap: number | null
          name: string
          ownership_type: string | null
          parent_company_id: string | null
          slug: string | null
          stock_exchange: string | null
          ticker_symbol: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          employees?: number | null
          founded?: number | null
          header_image_url?: string | null
          headquarters?: string | null
          id?: string
          logo_url?: string | null
          market_cap?: number | null
          name: string
          ownership_type?: string | null
          parent_company_id?: string | null
          slug?: string | null
          stock_exchange?: string | null
          ticker_symbol?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          employees?: number | null
          founded?: number | null
          header_image_url?: string | null
          headquarters?: string | null
          id?: string
          logo_url?: string | null
          market_cap?: number | null
          name?: string
          ownership_type?: string | null
          parent_company_id?: string | null
          slug?: string | null
          stock_exchange?: string | null
          ticker_symbol?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_financials: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          net_income: number | null
          r_and_d_spending: number | null
          revenue: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          net_income?: number | null
          r_and_d_spending?: number | null
          revenue?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          net_income?: number | null
          r_and_d_spending?: number | null
          revenue?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_financials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_milestones: {
        Row: {
          company_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          milestone_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          milestone_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          milestone_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_milestones_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_therapeutic_areas: {
        Row: {
          company_id: string
          created_at: string | null
          therapeutic_area_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          therapeutic_area_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          therapeutic_area_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_therapeutic_areas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_therapeutic_areas_therapeutic_area_id_fkey"
            columns: ["therapeutic_area_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      development_phases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_num: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_num: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_num?: number
          updated_at?: string
        }
        Relationships: []
      }
      indications: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string | null
          created_at: string | null
          date: string | null
          id: string
          sentiment: string | null
          source: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          sentiment?: string | null
          source?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          sentiment?: string | null
          source?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      news_companies: {
        Row: {
          company_id: string
          created_at: string | null
          news_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          news_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          news_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_companies_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      news_products: {
        Row: {
          created_at: string | null
          news_id: string
          product_id: string
        }
        Insert: {
          created_at?: string | null
          news_id: string
          product_id: string
        }
        Update: {
          created_at?: string | null
          news_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_products_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      news_therapeutic_areas: {
        Row: {
          created_at: string | null
          news_id: string
          therapeutic_area_id: string
        }
        Insert: {
          created_at?: string | null
          news_id: string
          therapeutic_area_id: string
        }
        Update: {
          created_at?: string | null
          news_id?: string
          therapeutic_area_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_therapeutic_areas_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_therapeutic_areas_therapeutic_area_id_fkey"
            columns: ["therapeutic_area_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      product_approvals: {
        Row: {
          agency: string | null
          created_at: string | null
          date: string | null
          details: string | null
          id: string
          indication: string | null
          product_id: string | null
          region: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agency?: string | null
          created_at?: string | null
          date?: string | null
          details?: string | null
          id?: string
          indication?: string | null
          product_id?: string | null
          region?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agency?: string | null
          created_at?: string | null
          date?: string | null
          details?: string | null
          id?: string
          indication?: string | null
          product_id?: string | null
          region?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_approvals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_indications: {
        Row: {
          created_at: string | null
          indication_id: string
          product_id: string
        }
        Insert: {
          created_at?: string | null
          indication_id: string
          product_id: string
        }
        Update: {
          created_at?: string | null
          indication_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_indications_indication_id_fkey"
            columns: ["indication_id"]
            isOneToOne: false
            referencedRelation: "indications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_indications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_patents: {
        Row: {
          created_at: string | null
          description: string | null
          expiry_date: string | null
          id: string
          number: string | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          number?: string | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          number?: string | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_patents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_therapeutic_areas: {
        Row: {
          created_at: string | null
          product_id: string
          therapeutic_area_id: string
        }
        Insert: {
          created_at?: string | null
          product_id: string
          therapeutic_area_id: string
        }
        Update: {
          created_at?: string | null
          product_id?: string
          therapeutic_area_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_therapeutic_areas_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_therapeutic_areas_therapeutic_area_id_fkey"
            columns: ["therapeutic_area_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      product_timelines: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          product_id: string | null
          stage: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          product_id?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          product_id?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_timelines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          generic_name: string | null
          id: string
          image_url: string | null
          molecule_type: string | null
          name: string
          slug: string | null
          stage: string | null
          status: string | null
          updated_at: string | null
          website: string | null
          year: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          generic_name?: string | null
          id?: string
          image_url?: string | null
          molecule_type?: string | null
          name: string
          slug?: string | null
          stage?: string | null
          status?: string | null
          updated_at?: string | null
          website?: string | null
          year?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          generic_name?: string | null
          id?: string
          image_url?: string | null
          molecule_type?: string | null
          name?: string
          slug?: string | null
          stage?: string | null
          status?: string | null
          updated_at?: string | null
          website?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      regulatory_approvals: {
        Row: {
          agency: string | null
          approval_date: string | null
          company_id: string | null
          created_at: string | null
          details: string | null
          id: string
          indication: string | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          agency?: string | null
          approval_date?: string | null
          company_id?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          indication?: string | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agency?: string | null
          approval_date?: string | null
          company_id?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          indication?: string | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regulatory_approvals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regulatory_approvals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      related_companies: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          related_company_id: string | null
          relationship_type: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          related_company_id?: string | null
          relationship_type?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          related_company_id?: string | null
          relationship_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "related_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_companies_related_company_id_fkey"
            columns: ["related_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      therapeutic_areas: {
        Row: {
          created_at: string | null
          description: string | null
          icon_path: string | null
          id: string
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_path?: string | null
          id?: string
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_path?: string | null
          id?: string
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_followed_companies: {
        Row: {
          company_id: string
          created_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_followed_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followed_companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_followed_entities: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_followed_products: {
        Row: {
          created_at: string | null
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_followed_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followed_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_followed_therapeutic_areas: {
        Row: {
          created_at: string | null
          therapeutic_area_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          therapeutic_area_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          therapeutic_area_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_followed_therapeutic_areas_therapeutic_area_id_fkey"
            columns: ["therapeutic_area_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followed_therapeutic_areas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_followed_websites: {
        Row: {
          created_at: string | null
          user_id: string
          website_id: string
        }
        Insert: {
          created_at?: string | null
          user_id: string
          website_id: string
        }
        Update: {
          created_at?: string | null
          user_id?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_followed_websites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followed_websites_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          message: string | null
          notification_type: string | null
          read: boolean | null
          timestamp: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string | null
          notification_type?: string | null
          read?: boolean | null
          timestamp?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string | null
          notification_type?: string | null
          read?: boolean | null
          timestamp?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          preference_key: string | null
          preference_value: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preference_key?: string | null
          preference_value?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preference_key?: string | null
          preference_value?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          job_title: string | null
          last_login: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          job_title?: string | null
          last_login?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          job_title?: string | null
          last_login?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      website_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      website_features: {
        Row: {
          added_date: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string | null
          status: string | null
          updated_at: string | null
          website_id: string | null
        }
        Insert: {
          added_date?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          status?: string | null
          updated_at?: string | null
          website_id?: string | null
        }
        Update: {
          added_date?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          status?: string | null
          updated_at?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_features_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      website_hosting: {
        Row: {
          created_at: string | null
          expiration_date: string | null
          id: string
          ip: string | null
          nameservers: string | null
          provider: string | null
          registrar: string | null
          registration_date: string | null
          ssl_expiration_date: string | null
          ssl_provider: string | null
          updated_at: string | null
          website_id: string | null
        }
        Insert: {
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          ip?: string | null
          nameservers?: string | null
          provider?: string | null
          registrar?: string | null
          registration_date?: string | null
          ssl_expiration_date?: string | null
          ssl_provider?: string | null
          updated_at?: string | null
          website_id?: string | null
        }
        Update: {
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          ip?: string | null
          nameservers?: string | null
          provider?: string | null
          registrar?: string | null
          registration_date?: string | null
          ssl_expiration_date?: string | null
          ssl_provider?: string | null
          updated_at?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_hosting_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      website_legal_content: {
        Row: {
          content_type: string | null
          created_at: string | null
          id: string
          jurisdiction: string | null
          last_updated: string | null
          text: string | null
          updated_at: string | null
          url: string | null
          version: string | null
          website_id: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          id?: string
          jurisdiction?: string | null
          last_updated?: string | null
          text?: string | null
          updated_at?: string | null
          url?: string | null
          version?: string | null
          website_id?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          id?: string
          jurisdiction?: string | null
          last_updated?: string | null
          text?: string | null
          updated_at?: string | null
          url?: string | null
          version?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_legal_content_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      website_tech_stack: {
        Row: {
          analytics: string | null
          cdn_provider: string | null
          chat_provider: string | null
          cms: string | null
          created_at: string | null
          email_service: string | null
          framework: string | null
          id: string
          marketing_automation: string | null
          search_technology: string | null
          server: string | null
          updated_at: string | null
          website_id: string | null
        }
        Insert: {
          analytics?: string | null
          cdn_provider?: string | null
          chat_provider?: string | null
          cms?: string | null
          created_at?: string | null
          email_service?: string | null
          framework?: string | null
          id?: string
          marketing_automation?: string | null
          search_technology?: string | null
          server?: string | null
          updated_at?: string | null
          website_id?: string | null
        }
        Update: {
          analytics?: string | null
          cdn_provider?: string | null
          chat_provider?: string | null
          cms?: string | null
          created_at?: string | null
          email_service?: string | null
          framework?: string | null
          id?: string
          marketing_automation?: string | null
          search_technology?: string | null
          server?: string | null
          updated_at?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_tech_stack_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      website_therapeutic_areas: {
        Row: {
          created_at: string | null
          therapeutic_area_id: string
          website_id: string
        }
        Insert: {
          created_at?: string | null
          therapeutic_area_id: string
          website_id: string
        }
        Update: {
          created_at?: string | null
          therapeutic_area_id?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_therapeutic_areas_therapeutic_area_id_fkey"
            columns: ["therapeutic_area_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_therapeutic_areas_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      websites: {
        Row: {
          category_id: string | null
          company_id: string | null
          created_at: string | null
          description: string | null
          domain: string
          has_ssl: boolean | null
          id: string
          language: string | null
          last_crawl: string | null
          last_updated: string | null
          region: string | null
          screenshot_date: string | null
          screenshot_url: string | null
          site_name: string | null
          status: string | null
          updated_at: string | null
          url: string
          slug: string
        }
        Insert: {
          category_id?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          domain: string
          has_ssl?: boolean | null
          id?: string
          language?: string | null
          last_crawl?: string | null
          last_updated?: string | null
          region?: string | null
          screenshot_date?: string | null
          screenshot_url?: string | null
          site_name?: string | null
          status?: string | null
          updated_at?: string | null
          url: string
          slug: string
        }
        Update: {
          category_id?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          domain?: string
          has_ssl?: boolean | null
          id?: string
          language?: string | null
          last_crawl?: string | null
          last_updated?: string | null
          region?: string | null
          screenshot_date?: string | null
          screenshot_url?: string | null
          site_name?: string | null
          status?: string | null
          updated_at?: string | null
          url?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "websites_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "website_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "websites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

