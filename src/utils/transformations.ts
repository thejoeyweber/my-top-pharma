import type { 
  Company, 
  Product, 
  TherapeuticArea, 
  Website, 
  DevelopmentPhase,
  UserPreferences,
  UserFollowedEntity,
  UserNotification
} from '../types/entities';

export function transformCompany(data: any): Company {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    founded: parseInt(data.founded),
    headquarters: data.headquarters,
    website: data.website,
    ticker_symbol: data.ticker_symbol,
    stock_exchange: data.stock_exchange,
    logo_url: data.logo_url,
    header_image_url: data.header_image_url,
    slug: data.slug,
    ownership_type: data.ownership_type,
    market_cap: data.market_cap,
    employees: data.employees,
    parent_company_id: data.parent_company_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

export function transformProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    company_id: data.company_id,
    status: data.status,
    year: data.year ? parseInt(data.year) : undefined,
    slug: data.slug,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

export function transformTherapeuticArea(data: any): TherapeuticArea {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    icon_path: data.icon_path,
    slug: data.slug,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

export function transformWebsite(data: any): Website {
  return {
    id: data.id,
    url: data.url,
    company_id: data.company_id,
    domain: data.domain,
    screenshot_date: data.screenshot_date,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

export function transformDevelopmentPhase(data: any): DevelopmentPhase {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    order_num: data.order_num,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

export function transformUserPreferences(data: any): UserPreferences {
  return {
    id: data.id,
    user_id: data.user_id,
    notification_frequency: data.notification_frequency,
    email_notifications: data.email_notifications,
    theme: data.theme,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

export function transformUserFollowedEntity(data: any): UserFollowedEntity {
  return {
    id: data.id,
    user_id: data.user_id,
    entity_type: data.entity_type,
    entity_id: data.entity_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

export function transformUserNotification(data: any): UserNotification {
  return {
    id: data.id,
    user_id: data.user_id,
    type: data.type,
    entity_id: data.entity_id,
    message: data.message,
    read: data.read,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
} 