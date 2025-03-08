/**
 * Admin Types
 * 
 * Type definitions for admin dashboard data.
 */

export interface SystemStats {
  label: string;
  value: number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  iconPath: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  requiresAuth: boolean;
  category: string;
  isActive: boolean;
  rateLimits: {
    enabled: boolean;
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  accessGroups: string[];
  documentation?: string;
  iconPath: string;
}

export interface CrawlerRule {
  id: string;
  pattern: string;
  priority: number;
  category: string;
  description: string;
  isActive: boolean;
  lastUpdated: string;
}

export interface CrawlerSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  startTime: string;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  recrawlAfterDays?: number;
}

export interface CrawlerConfig {
  rules: CrawlerRule[];
  schedule: CrawlerSchedule;
  concurrency: number;
  userAgent: string;
  respectRobotsTxt: boolean;
  ipRotation: boolean;
  rateLimit: {
    requestsPerSecond: number;
    maxConcurrentRequests: number;
  };
  excludePatterns: string[];
  followRedirects: boolean;
  maxDepth: number;
  dataExtractionSettings: {
    defaultLang: string;
    extractMetaTags: boolean;
    extractImages: boolean;
    extractLinks: boolean;
    extractPdfs: boolean;
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  details?: string;
  ip?: string;
  userId?: string;
  resolved: boolean;
}

export interface UserManagementData {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    lastLogin: string;
    company?: string;
    registeredDate: string;
    subscription?: string;
  }>;
  roles: Array<{
    id: string;
    name: string;
    permissions: string[];
    description: string;
    userCount: number;
  }>;
} 