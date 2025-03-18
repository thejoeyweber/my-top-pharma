/// <reference types="astro/client" />
/// <reference types="@supabase/supabase-js" />

/**
 * Environment variables available to both server and client
 */
interface ImportMetaEnv {
  // Remote Supabase connection
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  
  // Local Supabase connection
  readonly PUBLIC_LOCAL_SUPABASE_URL: string;
  readonly PUBLIC_LOCAL_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_LOCAL_SUPABASE_SERVICE_ROLE_KEY: string;
  
  // Feature flags (public)
  readonly PUBLIC_USE_LOCAL_DATABASE: string;
  readonly PUBLIC_USE_MOCK_DATA: string;
  readonly PUBLIC_ENABLE_FEATURE_FLAGS: string;
  readonly PUBLIC_DEBUG_MODE: string;
  
  // API keys (public versions for browser)
  readonly PUBLIC_FMP_API_KEY: string;
  
  // Server-only environment variables
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly FMP_API_KEY: string;
  
  // Database configuration
  readonly DATABASE_URL: string;
  
  // Development/Production mode
  readonly MODE: 'development' | 'production';
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Declare the Astro Content Collections
 */
declare module 'astro:content' {
  export interface CollectionEntry<C extends keyof typeof collections> {
    id: string;
    slug: string;
    body: string;
    collection: C;
    data: typeof collections[C]["schema"] extends infer T
      ? import('astro:content').InferEntrySchema<T>
      : never;
    render(): Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }

  export interface CollectionEntryMap {
    'therapeutic-areas': CollectionEntry<'therapeutic-areas'>;
    'companies': CollectionEntry<'companies'>;
  }
} 