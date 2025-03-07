/**
 * Mock Company Data
 * 
 * This file contains mock data for pharmaceutical companies to be used
 * throughout the application for development and testing purposes.
 */

export interface TherapeuticArea {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: 'Approved' | 'Phase 3' | 'Phase 2' | 'Phase 1' | 'Preclinical';
  approvalDate?: string;
  therapeuticAreas: string[];
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
  type: 'acquisition' | 'product' | 'regulatory' | 'corporate';
}

export interface FinancialMetric {
  year: number;
  revenue: number; // in billions USD
  rAndDSpending: number; // in billions USD
  netIncome: number; // in billions USD
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  headerImageUrl?: string;
  headquarters: string;
  founded: string;
  website: string;
  marketCap: number; // in billions USD
  employees: number;
  stockSymbol?: string;
  stockExchange?: string;
  therapeuticAreas: string[];
  products: Product[];
  relatedCompanies: {
    id: string;
    relationship: 'competitor' | 'partner' | 'subsidiary' | 'parent';
  }[];
  milestones: Milestone[];
  financials: FinancialMetric[];
}

// List of therapeutic areas
export const therapeuticAreas: TherapeuticArea[] = [
  { id: 'oncology', name: 'Oncology' },
  { id: 'immunology', name: 'Immunology' },
  { id: 'neuroscience', name: 'Neuroscience' },
  { id: 'cardiovascular', name: 'Cardiovascular' },
  { id: 'infectious-diseases', name: 'Infectious Diseases' },
  { id: 'vaccines', name: 'Vaccines' },
  { id: 'rare-diseases', name: 'Rare Diseases' },
  { id: 'metabolic-disorders', name: 'Metabolic Disorders' },
  { id: 'respiratory', name: 'Respiratory' },
  { id: 'hematology', name: 'Hematology' },
  { id: 'ophthalmology', name: 'Ophthalmology' },
];

// Mock companies data
export const companies: Company[] = [
  {
    id: 'pfizer',
    name: 'Pfizer',
    description: 'Pfizer Inc. is an American multinational pharmaceutical and biotechnology corporation. One of the world\'s premier biopharmaceutical companies, Pfizer discovers, develops, manufactures, and markets vaccines and medicines in a wide range of therapeutic areas.',
    logoUrl: '/images/companies/pfizer.svg',
    headerImageUrl: '/images/headers/pfizer-header.jpg',
    headquarters: 'New York, USA',
    founded: '1849',
    website: 'https://www.pfizer.com',
    marketCap: 240.5,
    employees: 79000,
    stockSymbol: 'PFE',
    stockExchange: 'NYSE',
    therapeuticAreas: ['oncology', 'vaccines', 'immunology', 'rare-diseases', 'infectious-diseases'],
    products: [
      {
        id: 'comirnaty',
        name: 'Comirnaty',
        description: 'COVID-19 mRNA vaccine developed with BioNTech',
        status: 'Approved',
        approvalDate: '2020-12-11',
        therapeuticAreas: ['vaccines', 'infectious-diseases']
      },
      {
        id: 'paxlovid',
        name: 'Paxlovid',
        description: 'Oral antiviral treatment for COVID-19',
        status: 'Approved',
        approvalDate: '2021-12-22',
        therapeuticAreas: ['infectious-diseases']
      },
      {
        id: 'prevnar',
        name: 'Prevnar 13/20',
        description: 'Pneumococcal conjugate vaccine',
        status: 'Approved',
        approvalDate: '2010-02-24',
        therapeuticAreas: ['vaccines', 'infectious-diseases']
      },
      {
        id: 'ibrance',
        name: 'Ibrance',
        description: 'Treatment for HR+/HER2- metastatic breast cancer',
        status: 'Approved',
        approvalDate: '2015-02-03',
        therapeuticAreas: ['oncology']
      }
    ],
    relatedCompanies: [
      { id: 'moderna', relationship: 'competitor' },
      { id: 'merck', relationship: 'competitor' },
      { id: 'johnson-johnson', relationship: 'competitor' },
      { id: 'biontech', relationship: 'partner' }
    ],
    milestones: [
      {
        date: '2020-12-11',
        title: 'First COVID-19 Vaccine Approval',
        description: 'Received FDA emergency use authorization for Comirnaty COVID-19 vaccine',
        type: 'regulatory'
      },
      {
        date: '2021-12-22',
        title: 'Paxlovid Approval',
        description: 'Received FDA emergency use authorization for Paxlovid COVID-19 treatment',
        type: 'regulatory'
      },
      {
        date: '2009-10-15',
        title: 'Wyeth Acquisition',
        description: 'Completed $68 billion acquisition of Wyeth Pharmaceuticals',
        type: 'acquisition'
      }
    ],
    financials: [
      {
        year: 2023,
        revenue: 58.5,
        rAndDSpending: 11.4,
        netIncome: 14.9
      },
      {
        year: 2022,
        revenue: 100.3,
        rAndDSpending: 11.4,
        netIncome: 31.4
      },
      {
        year: 2021,
        revenue: 81.3,
        rAndDSpending: 10.4,
        netIncome: 22.0
      }
    ]
  },
  {
    id: 'roche',
    name: 'Roche',
    description: 'Roche is a Swiss multinational healthcare company that operates worldwide. It is the world\'s largest biotech company and a global pioneer in pharmaceuticals and diagnostics focused on advancing science to improve people\'s lives.',
    logoUrl: '/images/companies/roche.svg',
    headerImageUrl: '/images/headers/roche-header.jpg',
    headquarters: 'Basel, Switzerland',
    founded: '1896',
    website: 'https://www.roche.com',
    marketCap: 320.7,
    employees: 101000,
    stockSymbol: 'ROG',
    stockExchange: 'SIX',
    therapeuticAreas: ['oncology', 'neuroscience', 'rare-diseases', 'ophthalmology', 'immunology'],
    products: [
      {
        id: 'tecentriq',
        name: 'Tecentriq',
        description: 'Immunotherapy for various cancer types',
        status: 'Approved',
        approvalDate: '2016-05-18',
        therapeuticAreas: ['oncology']
      },
      {
        id: 'ocrevus',
        name: 'Ocrevus',
        description: 'Treatment for multiple sclerosis',
        status: 'Approved',
        approvalDate: '2017-03-28',
        therapeuticAreas: ['neuroscience']
      },
      {
        id: 'hemlibra',
        name: 'Hemlibra',
        description: 'Treatment for hemophilia A',
        status: 'Approved',
        approvalDate: '2017-11-16',
        therapeuticAreas: ['hematology', 'rare-diseases']
      }
    ],
    relatedCompanies: [
      { id: 'novartis', relationship: 'competitor' },
      { id: 'merck', relationship: 'competitor' },
      { id: 'genentech', relationship: 'subsidiary' }
    ],
    milestones: [
      {
        date: '2009-03-26',
        title: 'Genentech Acquisition',
        description: 'Completed $46.8 billion acquisition of Genentech',
        type: 'acquisition'
      },
      {
        date: '2017-03-28',
        title: 'Ocrevus Approval',
        description: 'Received FDA approval for Ocrevus for multiple sclerosis',
        type: 'regulatory'
      }
    ],
    financials: [
      {
        year: 2023,
        revenue: 62.8,
        rAndDSpending: 12.7,
        netIncome: 12.4
      },
      {
        year: 2022,
        revenue: 63.3,
        rAndDSpending: 13.2,
        netIncome: 14.8
      },
      {
        year: 2021,
        revenue: 65.3,
        rAndDSpending: 13.7,
        netIncome: 16.4
      }
    ]
  },
  {
    id: 'novartis',
    name: 'Novartis',
    description: 'Novartis is a Swiss multinational pharmaceutical company based in Basel, Switzerland. It is one of the largest pharmaceutical companies in the world, specializing in a wide range of healthcare products including innovative medicines, generics, and biosimilars.',
    logoUrl: '/images/companies/novartis.svg',
    headerImageUrl: '/images/headers/novartis-header.jpg',
    headquarters: 'Basel, Switzerland',
    founded: '1996',
    website: 'https://www.novartis.com',
    marketCap: 210.3,
    employees: 103000,
    stockSymbol: 'NVS',
    stockExchange: 'NYSE',
    therapeuticAreas: ['ophthalmology', 'cardiovascular', 'neuroscience', 'immunology', 'oncology'],
    products: [
      {
        id: 'cosentyx',
        name: 'Cosentyx',
        description: 'Treatment for psoriasis, psoriatic arthritis, and ankylosing spondylitis',
        status: 'Approved',
        approvalDate: '2015-01-21',
        therapeuticAreas: ['immunology']
      },
      {
        id: 'entresto',
        name: 'Entresto',
        description: 'Treatment for heart failure',
        status: 'Approved',
        approvalDate: '2015-07-07',
        therapeuticAreas: ['cardiovascular']
      },
      {
        id: 'kisqali',
        name: 'Kisqali',
        description: 'Treatment for breast cancer',
        status: 'Approved',
        approvalDate: '2017-03-13',
        therapeuticAreas: ['oncology']
      }
    ],
    relatedCompanies: [
      { id: 'roche', relationship: 'competitor' },
      { id: 'pfizer', relationship: 'competitor' },
      { id: 'sandoz', relationship: 'subsidiary' }
    ],
    milestones: [
      {
        date: '2018-04-09',
        title: 'AveXis Acquisition',
        description: 'Acquired AveXis for $8.7 billion to expand gene therapy portfolio',
        type: 'acquisition'
      },
      {
        date: '2006-04-07',
        title: 'Chiron Acquisition',
        description: 'Completed acquisition of Chiron Corporation for $5.1 billion',
        type: 'acquisition'
      }
    ],
    financials: [
      {
        year: 2023,
        revenue: 45.4,
        rAndDSpending: 9.2,
        netIncome: 8.1
      },
      {
        year: 2022,
        revenue: 50.5,
        rAndDSpending: 9.9,
        netIncome: 6.9
      },
      {
        year: 2021,
        revenue: 51.6,
        rAndDSpending: 9.5,
        netIncome: 24.0
      }
    ]
  },
  {
    id: 'merck',
    name: 'Merck',
    description: 'Merck & Co., known as MSD outside the United States and Canada, is an American multinational pharmaceutical company and one of the largest pharmaceutical companies in the world. The company develops and produces medicines, vaccines, biologic therapies, and animal health products.',
    logoUrl: '/images/companies/merck.svg',
    headerImageUrl: '/images/headers/merck-header.jpg',
    headquarters: 'Kenilworth, USA',
    founded: '1891',
    website: 'https://www.merck.com',
    marketCap: 180.2,
    employees: 71000,
    stockSymbol: 'MRK',
    stockExchange: 'NYSE',
    therapeuticAreas: ['oncology', 'vaccines', 'infectious-diseases', 'cardiovascular', 'metabolic-disorders'],
    products: [
      {
        id: 'keytruda',
        name: 'Keytruda',
        description: 'Immunotherapy for various cancer types',
        status: 'Approved',
        approvalDate: '2014-09-04',
        therapeuticAreas: ['oncology', 'immunology']
      },
      {
        id: 'gardasil',
        name: 'Gardasil',
        description: 'Vaccine for human papillomavirus',
        status: 'Approved',
        approvalDate: '2006-06-08',
        therapeuticAreas: ['vaccines']
      },
      {
        id: 'januvia',
        name: 'Januvia',
        description: 'Treatment for type 2 diabetes',
        status: 'Approved',
        approvalDate: '2006-10-17',
        therapeuticAreas: ['metabolic-disorders']
      }
    ],
    relatedCompanies: [
      { id: 'pfizer', relationship: 'competitor' },
      { id: 'roche', relationship: 'competitor' },
      { id: 'johnson-johnson', relationship: 'competitor' }
    ],
    milestones: [
      {
        date: '2009-03-09',
        title: 'Schering-Plough Merger',
        description: 'Merged with Schering-Plough in a $41.1 billion deal',
        type: 'acquisition'
      },
      {
        date: '2014-09-04',
        title: 'Keytruda Approval',
        description: 'Received FDA approval for Keytruda for melanoma',
        type: 'regulatory'
      }
    ],
    financials: [
      {
        year: 2023,
        revenue: 60.1,
        rAndDSpending: 13.5,
        netIncome: 15.0
      },
      {
        year: 2022,
        revenue: 59.3,
        rAndDSpending: 13.1,
        netIncome: 14.5
      },
      {
        year: 2021,
        revenue: 48.7,
        rAndDSpending: 12.2,
        netIncome: 13.0
      }
    ]
  },
  {
    id: 'johnson-johnson',
    name: 'Johnson & Johnson',
    description: 'Johnson & Johnson is an American multinational corporation that develops medical devices, pharmaceuticals, and consumer packaged goods. It is one of the world\'s most valuable companies and is one of the most diversified healthcare companies.',
    logoUrl: '/images/companies/jnj.svg',
    headerImageUrl: '/images/headers/jnj-header.jpg',
    headquarters: 'New Brunswick, USA',
    founded: '1886',
    website: 'https://www.jnj.com',
    marketCap: 420.1,
    employees: 142000,
    stockSymbol: 'JNJ',
    stockExchange: 'NYSE',
    therapeuticAreas: ['immunology', 'oncology', 'neuroscience', 'cardiovascular', 'infectious-diseases', 'vaccines'],
    products: [
      {
        id: 'stelara',
        name: 'Stelara',
        description: 'Treatment for psoriasis, psoriatic arthritis, and Crohn\'s disease',
        status: 'Approved',
        approvalDate: '2009-09-25',
        therapeuticAreas: ['immunology']
      },
      {
        id: 'darzalex',
        name: 'Darzalex',
        description: 'Treatment for multiple myeloma',
        status: 'Approved',
        approvalDate: '2015-11-16',
        therapeuticAreas: ['oncology']
      },
      {
        id: 'tremfya',
        name: 'Tremfya',
        description: 'Treatment for plaque psoriasis',
        status: 'Approved',
        approvalDate: '2017-07-13',
        therapeuticAreas: ['immunology']
      },
      {
        id: 'jnj-vaccine',
        name: 'Janssen COVID-19 Vaccine',
        description: 'Single-dose COVID-19 vaccine',
        status: 'Approved',
        approvalDate: '2021-02-27',
        therapeuticAreas: ['vaccines', 'infectious-diseases']
      }
    ],
    relatedCompanies: [
      { id: 'pfizer', relationship: 'competitor' },
      { id: 'merck', relationship: 'competitor' },
      { id: 'novartis', relationship: 'competitor' },
      { id: 'janssen', relationship: 'subsidiary' }
    ],
    milestones: [
      {
        date: '2017-01-26',
        title: 'Actelion Acquisition',
        description: 'Acquired Actelion for $30 billion to expand into pulmonary arterial hypertension market',
        type: 'acquisition'
      },
      {
        date: '2021-02-27',
        title: 'COVID-19 Vaccine Authorization',
        description: 'Received FDA emergency use authorization for single-dose COVID-19 vaccine',
        type: 'regulatory'
      }
    ],
    financials: [
      {
        year: 2023,
        revenue: 85.2,
        rAndDSpending: 14.6,
        netIncome: 13.3
      },
      {
        year: 2022,
        revenue: 94.9,
        rAndDSpending: 15.0,
        netIncome: 17.9
      },
      {
        year: 2021,
        revenue: 93.8,
        rAndDSpending: 14.7,
        netIncome: 20.9
      }
    ]
  },
  {
    id: 'astrazeneca',
    name: 'AstraZeneca',
    description: 'AstraZeneca plc is a British-Swedish multinational pharmaceutical and biopharmaceutical company. It focuses on the discovery, development, and commercialization of prescription medicines in oncology, cardiovascular, renal and metabolism, and respiratory and immunology.',
    logoUrl: '/images/companies/astrazeneca.svg',
    headerImageUrl: '/images/headers/astrazeneca-header.jpg',
    headquarters: 'Cambridge, UK',
    founded: '1999',
    website: 'https://www.astrazeneca.com',
    marketCap: 190.6,
    employees: 83000,
    stockSymbol: 'AZN',
    stockExchange: 'NASDAQ',
    therapeuticAreas: ['oncology', 'cardiovascular', 'respiratory', 'immunology', 'vaccines', 'rare-diseases'],
    products: [
      {
        id: 'tagrisso',
        name: 'Tagrisso',
        description: 'Treatment for non-small cell lung cancer',
        status: 'Approved',
        approvalDate: '2015-11-13',
        therapeuticAreas: ['oncology']
      },
      {
        id: 'lynparza',
        name: 'Lynparza',
        description: 'Treatment for ovarian, breast, pancreatic, and prostate cancers',
        status: 'Approved',
        approvalDate: '2014-12-19',
        therapeuticAreas: ['oncology']
      },
      {
        id: 'fasenra',
        name: 'Fasenra',
        description: 'Treatment for severe eosinophilic asthma',
        status: 'Approved',
        approvalDate: '2017-11-14',
        therapeuticAreas: ['respiratory']
      },
      {
        id: 'covid-vaccine',
        name: 'Vaxzevria',
        description: 'COVID-19 vaccine',
        status: 'Approved',
        approvalDate: '2020-12-30',
        therapeuticAreas: ['vaccines', 'infectious-diseases']
      }
    ],
    relatedCompanies: [
      { id: 'pfizer', relationship: 'competitor' },
      { id: 'merck', relationship: 'competitor' },
      { id: 'novartis', relationship: 'competitor' },
      { id: 'oxford-biomedica', relationship: 'partner' }
    ],
    milestones: [
      {
        date: '2021-07-09',
        title: 'Alexion Acquisition',
        description: 'Completed $39 billion acquisition of Alexion Pharmaceuticals',
        type: 'acquisition'
      },
      {
        date: '2020-12-30',
        title: 'COVID-19 Vaccine Authorization',
        description: 'Received UK authorization for COVID-19 vaccine',
        type: 'regulatory'
      }
    ],
    financials: [
      {
        year: 2023,
        revenue: 45.8,
        rAndDSpending: 9.7,
        netIncome: 5.2
      },
      {
        year: 2022,
        revenue: 44.4,
        rAndDSpending: 9.5,
        netIncome: 3.3
      },
      {
        year: 2021,
        revenue: 37.4,
        rAndDSpending: 8.0,
        netIncome: 0.1
      }
    ]
  }
];

// Helper function to get a company by ID
export const getCompanyById = (id: string): Company | undefined => {
  return companies.find(company => company.id === id);
};

// Helper function to get companies by therapeutic area
export const getCompaniesByTherapeuticArea = (areaId: string): Company[] => {
  return companies.filter(company => company.therapeuticAreas.includes(areaId));
};

// Helper function to get related companies for a company
export const getRelatedCompanies = (companyId: string): { company: Company, relationship: string }[] => {
  const company = getCompanyById(companyId);
  if (!company) return [];
  
  return company.relatedCompanies.map(related => {
    const relatedCompany = getCompanyById(related.id);
    return {
      company: relatedCompany,
      relationship: related.relationship
    };
  }).filter(item => item.company !== undefined) as { company: Company, relationship: string }[];
}; 