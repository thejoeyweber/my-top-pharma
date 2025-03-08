/**
 * User Types
 * 
 * Type definitions for user data.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  company: string;
  avatarUrl: string;
  createdAt: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    marketingEmails: boolean;
    newCompanyAlerts: boolean;
    productApprovals: boolean;
    websiteLaunches: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    density: 'compact' | 'comfortable' | 'spacious';
    fontSize: 'small' | 'medium' | 'large';
  };
  defaultFilters: {
    region: string | null;
    therapeuticAreas: string[];
    companyTypes: string[];
  };
}

export interface UserNotification {
  id: string;
  type: 'company' | 'product' | 'website' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
  entityId?: string;
}

export interface FollowedItem {
  id: string;
  type: 'company' | 'product' | 'therapeuticArea' | 'website';
  name: string;
  addedDate: string;
  lastUpdate?: string;
  notifyChanges: boolean;
} 