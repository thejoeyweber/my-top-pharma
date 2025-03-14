/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Remote Supabase connection
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  
  // Local Supabase connection
  readonly PUBLIC_LOCAL_SUPABASE_URL: string;
  readonly PUBLIC_LOCAL_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_LOCAL_SUPABASE_SERVICE_ROLE_KEY: string;
  
  // Feature flags
  readonly PUBLIC_USE_LOCAL_DATABASE: string;
  
  // API keys
  readonly PUBLIC_FMP_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 