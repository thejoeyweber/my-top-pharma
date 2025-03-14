/**
 * Company Type
 * 
 * Simplified type definition for company data used in the application.
 * This is the shape expected by the UI components and differs slightly
 * from both the database schema and the original data structure.
 */

export interface Company {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  headquarters: string;
  foundedYear: number | null;
  employeeCount: number | null;
  marketCapBillions: number | null;
  annualRevenueBillions: number | null;
  tickerSymbol: string;
  exchange: string;
  ceo: string;
  therapeuticAreas: string[];
} 