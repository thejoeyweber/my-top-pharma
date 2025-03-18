// Entity interfaces for the application
export interface Company {
  id: string;
  name: string;
  description: string;
  founded: number;
  headquarters: string;
  website: string;
  ticker_symbol: string;
  stock_exchange: string;
  logo_url?: string;
  header_image_url?: string;
  slug: string;
  ownership_type?: string;
  market_cap?: number;
  employees?: number;
  parent_company_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  company_id: string;
  status?: string;
  year?: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface TherapeuticArea {
  id: string;
  name: string;
  description: string;
  icon_path?: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Website {
  id: string;
  url: string;
  company_id: string;
  domain: string;
  screenshot_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DevelopmentPhase {
  id: string;
  name: string;
  description: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  notification_frequency: 'daily' | 'weekly' | 'never';
  email_notifications: boolean;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface UserFollowedEntity {
  id: string;
  user_id: string;
  entity_type: 'company' | 'product' | 'therapeutic_area';
  entity_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  type: string;
  entity_id?: string;
  message: string;
  read: boolean;
  created_at: string;
  updated_at: string;
} 