/**
 * MockDataSource.ts
 * 
 * A mock implementation of the DataSource interface that returns
 * hardcoded data for testing and development purposes.
 */

import type { DataSource, QueryOptions, PaginatedResult } from '../interfaces/DataSource';
import type { Company } from '../interfaces/entities/Company';
import type { Product } from '../interfaces/entities/Product';
import type { Website } from '../interfaces/entities/Website';
import type { TherapeuticArea } from '../interfaces/entities/TherapeuticArea';

/**
 * Mock implementation of the DataSource interface
 * Returns predefined data for testing purposes
 */
export class MockDataSource implements DataSource {
  private companies: Company[];
  private products: Product[];
  private websites: Website[];
  private therapeuticAreas: TherapeuticArea[];

  constructor() {
    // Initialize with mock data
    this.companies = [
      {
        id: 'pfizer',
        name: 'Pfizer',
        slug: 'pfizer',
        description: 'A leading pharmaceutical company focused on developing innovative therapies.',
        logoUrl: '/images/logos/pfizer.png',
        websiteUrl: 'https://www.pfizer.com',
        headquarters: 'New York, USA',
        foundedYear: 1849,
        employeeCount: 88000,
        marketCapBillions: 200.5,
        annualRevenueBillions: 81.3,
        tickerSymbol: 'PFE',
        exchange: 'NYSE',
        ceo: 'Albert Bourla',
        therapeuticAreas: ['oncology', 'immunology', 'vaccines']
      },
      {
        id: 'novartis',
        name: 'Novartis',
        slug: 'novartis',
        description: 'A global healthcare company based in Switzerland.',
        logoUrl: '/images/logos/novartis.png',
        websiteUrl: 'https://www.novartis.com',
        headquarters: 'Basel, Switzerland',
        foundedYear: 1996,
        employeeCount: 103000,
        marketCapBillions: 180.7,
        annualRevenueBillions: 51.9,
        tickerSymbol: 'NVS',
        exchange: 'NYSE',
        ceo: 'Vasant Narasimhan',
        therapeuticAreas: ['ophthalmology', 'neuroscience', 'immunology']
      }
    ];

    this.therapeuticAreas = [
      {
        id: 'oncology',
        name: 'Oncology',
        slug: 'oncology',
        description: 'The branch of medicine that deals with the study, treatment, diagnosis, and prevention of cancer.',
        iconUrl: '/images/icons/oncology.svg',
        isPrimary: true,
        companyIds: ['pfizer', 'novartis'],
        color: '#FF5733'
      },
      {
        id: 'immunology',
        name: 'Immunology',
        slug: 'immunology',
        description: 'The study of the immune system and its response to infectious disease.',
        iconUrl: '/images/icons/immunology.svg',
        isPrimary: true,
        companyIds: ['pfizer', 'novartis'],
        color: '#33FF57'
      },
      {
        id: 'neuroscience',
        name: 'Neuroscience',
        slug: 'neuroscience',
        description: 'The scientific study of the nervous system and brain.',
        iconUrl: '/images/icons/neuroscience.svg',
        isPrimary: true,
        companyIds: ['novartis'],
        color: '#3357FF'
      }
    ];

    this.products = [
      {
        id: 'product1',
        name: 'Comirnaty',
        genericName: 'COVID-19 mRNA vaccine',
        companyId: 'pfizer',
        description: 'COVID-19 vaccine based on mRNA technology',
        stage: 'market',
        therapeuticAreas: ['vaccines'],
        indications: ['COVID-19 prevention'],
        moleculeType: 'mRNA vaccine',
        imageUrl: '/images/products/comirnaty.jpg',
        timeline: [
          {
            date: '2020-12-11',
            stage: 'approved',
            description: 'FDA Emergency Use Authorization'
          },
          {
            date: '2021-08-23',
            stage: 'approved',
            description: 'FDA Full Approval'
          }
        ],
        approvals: [
          {
            region: 'United States',
            date: '2021-08-23',
            indication: 'Prevention of COVID-19 in individuals 16 years and older'
          },
          {
            region: 'European Union',
            date: '2020-12-21',
            indication: 'Prevention of COVID-19'
          }
        ]
      }
    ];

    this.websites = [
      {
        id: 'website1',
        domain: 'pfizer.com',
        siteName: 'Pfizer Corporate Website',
        category: 'corporate',
        description: 'The main corporate website for Pfizer Inc.',
        companyId: 'pfizer',
        launchDate: '2019-06-15',
        url: 'https://www.pfizer.com',
        hasSSL: true,
        screenshotUrl: '/images/screenshots/pfizer-com.jpg',
        region: 'Global',
        status: 'active',
        techStack: {
          cms: 'Adobe Experience Manager',
          framework: 'React',
          analytics: 'Adobe Analytics'
        }
      }
    ];
  }

  /**
   * Health check method
   * Always returns true for mock data source
   */
  async healthCheck(): Promise<boolean> {
    return true;
  }

  /**
   * Apply pagination, filtering, and sorting to any data array
   */
  private applyQueryOptions<T>(data: T[], options?: QueryOptions): PaginatedResult<T> {
    let filteredData = [...data];
    
    // Default pagination values
    const page = options?.pagination?.page || 1;
    const limit = options?.pagination?.limit || 10;
    const offset = (page - 1) * limit;
    
    // Apply filters if provided
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        filteredData = filteredData.filter(item => {
          const itemValue = item[key as keyof T];
          
          // Handle array contains
          if (Array.isArray(itemValue) && typeof value === 'string') {
            return itemValue.includes(value);
          }
          
          // Handle string includes
          if (typeof itemValue === 'string' && typeof value === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          
          // Handle exact match
          return itemValue === value;
        });
      }
    }
    
    // Apply sorting if provided
    if (options?.sort) {
      const { field, direction } = options.sort;
      filteredData.sort((a, b) => {
        const aValue = a[field as keyof T];
        const bValue = b[field as keyof T];
        
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Apply pagination
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return {
      data: paginatedData,
      pagination: {
        total: filteredData.length,
        page,
        limit,
        pages: Math.ceil(filteredData.length / limit)
      }
    };
  }

  /**
   * Get a company by ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    const company = this.companies.find(c => c.id === id);
    return company || null;
  }

  /**
   * Get companies with optional filtering, sorting, and pagination
   */
  async getCompanies(options?: QueryOptions): Promise<PaginatedResult<Company>> {
    return this.applyQueryOptions(this.companies, options);
  }

  /**
   * Get a product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  /**
   * Get products with optional filtering, sorting, and pagination
   */
  async getProducts(options?: QueryOptions): Promise<PaginatedResult<Product>> {
    return this.applyQueryOptions(this.products, options);
  }

  /**
   * Get products by company ID
   */
  async getProductsForCompany(companyId: string, options?: QueryOptions): Promise<PaginatedResult<Product>> {
    const companyProducts = this.products.filter(p => p.companyId === companyId);
    return this.applyQueryOptions(companyProducts, options);
  }

  /**
   * Get a website by ID
   */
  async getWebsiteById(id: string): Promise<Website | null> {
    const website = this.websites.find(w => w.id === id);
    return website || null;
  }

  /**
   * Get websites with optional filtering, sorting, and pagination
   */
  async getWebsites(options?: QueryOptions): Promise<PaginatedResult<Website>> {
    return this.applyQueryOptions(this.websites, options);
  }

  /**
   * Get websites by company ID
   */
  async getWebsitesForCompany(companyId: string, options?: QueryOptions): Promise<PaginatedResult<Website>> {
    const companyWebsites = this.websites.filter(w => w.companyId === companyId);
    return this.applyQueryOptions(companyWebsites, options);
  }

  /**
   * Get a therapeutic area by ID
   */
  async getTherapeuticAreaById(id: string): Promise<TherapeuticArea | null> {
    const therapeuticArea = this.therapeuticAreas.find(ta => ta.id === id);
    return therapeuticArea || null;
  }

  /**
   * Get therapeutic areas with optional filtering, sorting, and pagination
   */
  async getTherapeuticAreas(options?: QueryOptions): Promise<PaginatedResult<TherapeuticArea>> {
    return this.applyQueryOptions(this.therapeuticAreas, options);
  }

  /**
   * Get therapeutic areas by company ID
   */
  async getTherapeuticAreasForCompany(companyId: string, options?: QueryOptions): Promise<PaginatedResult<TherapeuticArea>> {
    const companyTAs = this.therapeuticAreas.filter(ta => 
      ta.companyIds?.includes(companyId)
    );
    return this.applyQueryOptions(companyTAs, options);
  }
} 