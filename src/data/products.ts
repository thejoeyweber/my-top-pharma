/**
 * Product Data
 * 
 * Mock data for pharmaceutical products including development stages,
 * therapeutic areas, regulatory approvals, and other key information.
 */
import { companies } from './companies';

// Get a safety fallback company ID
const DEFAULT_COMPANY_ID = companies[0]?.id || 'pfizer';

export type ProductStage = 
  | 'preclinical'
  | 'phase1'
  | 'phase2'
  | 'phase3'
  | 'submitted'
  | 'approved'
  | 'marketed';

export interface ProductApproval {
  region: string;
  date: string;
  agency: string;
  indication: string;
  status: 'approved' | 'rejected' | 'pending';
}

export interface ProductTimeline {
  stage: ProductStage;
  startDate: string;
  endDate?: string;
  milestone?: string;
}

export interface Product {
  id: string;
  name: string;
  genericName?: string;
  companyId: string;
  description: string;
  stage: ProductStage;
  therapeuticAreas: string[];
  indications: string[];
  moleculeType: string;
  timeline: ProductTimeline[];
  approvals: ProductApproval[];
  imageUrl?: string;
  website?: string;
  patents?: {
    number: string;
    expiryDate: string;
    description: string;
  }[];
}

// Helper function to get stage name for display
export function getStageName(stage: ProductStage): string {
  const stageNames = {
    'preclinical': 'Preclinical',
    'phase1': 'Phase 1',
    'phase2': 'Phase 2',
    'phase3': 'Phase 3',
    'submitted': 'Submitted',
    'approved': 'Approved',
    'marketed': 'Marketed'
  };
  return stageNames[stage] || stage;
}

// Helper function to get stage color
export function getStageColor(stage: ProductStage): string {
  const stageColors = {
    'preclinical': 'gray',
    'phase1': 'blue', 
    'phase2': 'indigo',
    'phase3': 'purple',
    'submitted': 'yellow',
    'approved': 'green',
    'marketed': 'emerald'
  };
  return stageColors[stage] || 'gray';
}

// List of common indications
export const indications = [
  'Alzheimer\'s Disease',
  'Breast Cancer',
  'Chronic Heart Failure',
  'Diabetes Mellitus',
  'Epilepsy',
  'Fibromyalgia',
  'Glaucoma',
  'Hypertension',
  'Inflammatory Bowel Disease',
  'Juvenile Rheumatoid Arthritis',
  'Kidney Disease',
  'Lung Cancer',
  'Multiple Sclerosis',
  'Non-Small Cell Lung Cancer',
  'Osteoarthritis',
  'Parkinson\'s Disease',
  'Psoriasis',
  'Rheumatoid Arthritis',
  'Schizophrenia',
  'Type 2 Diabetes',
  'Ulcerative Colitis',
  'Vascular Dementia',
  'Weight Management',
  'COVID-19'
];

// Mock product data
export const products: Product[] = [
  {
    id: 'exampla',
    name: 'Exampla',
    genericName: 'examplamab',
    companyId: 'pfizer',
    description: 'A monoclonal antibody targeting inflammatory pathways implicated in several autoimmune conditions.',
    stage: 'marketed',
    therapeuticAreas: ['immunology', 'dermatology'],
    indications: ['Rheumatoid Arthritis', 'Psoriasis', 'Psoriatic Arthritis'],
    moleculeType: 'Monoclonal Antibody',
    timeline: [
      { stage: 'preclinical', startDate: '2012-03', endDate: '2014-01' },
      { stage: 'phase1', startDate: '2014-02', endDate: '2015-06', milestone: 'Positive safety profile' },
      { stage: 'phase2', startDate: '2015-07', endDate: '2017-01', milestone: 'Met primary endpoint' },
      { stage: 'phase3', startDate: '2017-02', endDate: '2019-04', milestone: 'Superior to standard of care' },
      { stage: 'submitted', startDate: '2019-05', endDate: '2020-01' },
      { stage: 'approved', startDate: '2020-01', endDate: '2020-03' },
      { stage: 'marketed', startDate: '2020-04' }
    ],
    approvals: [
      { region: 'United States', date: '2020-01-15', agency: 'FDA', indication: 'Rheumatoid Arthritis', status: 'approved' },
      { region: 'European Union', date: '2020-03-10', agency: 'EMA', indication: 'Rheumatoid Arthritis', status: 'approved' },
      { region: 'United States', date: '2021-06-22', agency: 'FDA', indication: 'Psoriasis', status: 'approved' },
      { region: 'Japan', date: '2020-05-18', agency: 'PMDA', indication: 'Rheumatoid Arthritis', status: 'approved' }
    ],
    patents: [
      { number: 'US9876543', expiryDate: '2035-06-15', description: 'Composition of matter' },
      { number: 'US8765432', expiryDate: '2032-11-20', description: 'Method of treatment for autoimmune diseases' }
    ]
  },
  {
    id: 'cardiofix',
    name: 'CardioFix',
    genericName: 'amlodipivastatin',
    companyId: 'pfizer',
    description: 'A dual-action therapy combining calcium channel blocking and statin effects for cardiovascular disease management.',
    stage: 'phase3',
    therapeuticAreas: ['cardiovascular'],
    indications: ['Hypertension with Hyperlipidemia'],
    moleculeType: 'Small Molecule',
    timeline: [
      { stage: 'preclinical', startDate: '2015-06', endDate: '2017-02' },
      { stage: 'phase1', startDate: '2017-03', endDate: '2018-04' },
      { stage: 'phase2', startDate: '2018-05', endDate: '2020-09', milestone: 'Positive efficacy signals' },
      { stage: 'phase3', startDate: '2020-11' }
    ],
    approvals: [],
    website: 'https://example.com/cardiofix-clinical-trial'
  },
  {
    id: 'neuroease',
    name: 'NeuroEase',
    genericName: 'seroloxitine',
    companyId: 'pfizer',
    description: 'A novel serotonin modulator for treatment of major depressive disorder with reduced side effects.',
    stage: 'submitted',
    therapeuticAreas: ['neurology', 'psychiatry'],
    indications: ['Major Depressive Disorder', 'Generalized Anxiety Disorder'],
    moleculeType: 'Small Molecule',
    timeline: [
      { stage: 'preclinical', startDate: '2014-01', endDate: '2015-08' },
      { stage: 'phase1', startDate: '2015-09', endDate: '2016-07' },
      { stage: 'phase2', startDate: '2016-08', endDate: '2018-02', milestone: 'Significant symptom reduction' },
      { stage: 'phase3', startDate: '2018-03', endDate: '2021-11', milestone: 'Met all primary endpoints' },
      { stage: 'submitted', startDate: '2022-01' }
    ],
    approvals: [
      { region: 'United States', date: '2022-01-10', agency: 'FDA', indication: 'Major Depressive Disorder', status: 'pending' }
    ]
  },
  {
    id: 'immunorex',
    name: 'ImmunoRex',
    genericName: 'tcelimumab',
    companyId: 'pfizer',
    description: 'A next-generation checkpoint inhibitor for treatment of advanced and metastatic solid tumors.',
    stage: 'approved',
    therapeuticAreas: ['oncology', 'immunology'],
    indications: ['Melanoma', 'Non-Small Cell Lung Cancer'],
    moleculeType: 'Monoclonal Antibody',
    timeline: [
      { stage: 'preclinical', startDate: '2013-09', endDate: '2015-03' },
      { stage: 'phase1', startDate: '2015-04', endDate: '2016-08', milestone: 'Well-tolerated with early efficacy signals' },
      { stage: 'phase2', startDate: '2016-09', endDate: '2018-06', milestone: 'Promising ORR in NSCLC' },
      { stage: 'phase3', startDate: '2018-07', endDate: '2021-01', milestone: 'Extended survival in melanoma' },
      { stage: 'submitted', startDate: '2021-02', endDate: '2021-11' },
      { stage: 'approved', startDate: '2021-12' }
    ],
    approvals: [
      { region: 'United States', date: '2021-12-05', agency: 'FDA', indication: 'Melanoma', status: 'approved' },
      { region: 'European Union', date: '2022-03-18', agency: 'EMA', indication: 'Melanoma', status: 'approved' },
      { region: 'United States', date: '2022-05-11', agency: 'FDA', indication: 'Non-Small Cell Lung Cancer', status: 'pending' }
    ]
  },
  {
    id: 'diabetreat',
    name: 'DiabeTreat',
    genericName: 'gluforine',
    companyId: 'pfizer',
    description: 'An oral glucose-regulating agent with improved safety profile for type 2 diabetes.',
    stage: 'phase2',
    therapeuticAreas: ['endocrinology'],
    indications: ['Type 2 Diabetes'],
    moleculeType: 'Small Molecule',
    timeline: [
      { stage: 'preclinical', startDate: '2017-02', endDate: '2019-03' },
      { stage: 'phase1', startDate: '2019-04', endDate: '2020-07' },
      { stage: 'phase2', startDate: '2020-09' }
    ],
    approvals: []
  },
  {
    id: 'respirafree',
    name: 'RespiraFree',
    genericName: 'bronchodilastatin',
    companyId: 'pfizer',
    description: 'A combination bronchodilator and anti-inflammatory for treatment of COPD and severe asthma.',
    stage: 'marketed',
    therapeuticAreas: ['respiratory'],
    indications: ['Chronic Obstructive Pulmonary Disease', 'Severe Asthma'],
    moleculeType: 'Small Molecule',
    timeline: [
      { stage: 'preclinical', startDate: '2011-06', endDate: '2013-04' },
      { stage: 'phase1', startDate: '2013-05', endDate: '2014-01' },
      { stage: 'phase2', startDate: '2014-02', endDate: '2015-09', milestone: 'Significant improvement in lung function' },
      { stage: 'phase3', startDate: '2015-10', endDate: '2017-11', milestone: 'Reduced exacerbation frequency' },
      { stage: 'submitted', startDate: '2018-01', endDate: '2018-09' },
      { stage: 'approved', startDate: '2018-10', endDate: '2019-01' },
      { stage: 'marketed', startDate: '2019-02' }
    ],
    approvals: [
      { region: 'United States', date: '2018-10-25', agency: 'FDA', indication: 'COPD', status: 'approved' },
      { region: 'European Union', date: '2019-01-15', agency: 'EMA', indication: 'COPD', status: 'approved' },
      { region: 'United States', date: '2020-04-30', agency: 'FDA', indication: 'Severe Asthma', status: 'approved' }
    ]
  },
  {
    id: 'oncovitae',
    name: 'OncoVitae',
    genericName: 'immuno-oncolytic virus therapy',
    companyId: 'pfizer',
    description: 'A novel oncolytic virus therapy designed to target and destroy specific cancer cells while activating immune response.',
    stage: 'phase1',
    therapeuticAreas: ['oncology'],
    indications: ['Solid Tumors', 'Metastatic Melanoma'],
    moleculeType: 'Biologic',
    timeline: [
      { stage: 'preclinical', startDate: '2018-09', endDate: '2021-05', milestone: 'Promising tumor reduction in animal models' },
      { stage: 'phase1', startDate: '2021-06' }
    ],
    approvals: []
  },
  {
    id: 'neuropaincalm',
    name: 'NeuroPainCalm',
    genericName: 'neurolixtanib',
    companyId: 'pfizer',
    description: 'A selective ion channel modulator for treatment of neuropathic pain conditions with reduced side effects.',
    stage: 'phase3',
    therapeuticAreas: ['neurology', 'pain management'],
    indications: ['Diabetic Neuropathy', 'Post-Herpetic Neuralgia'],
    moleculeType: 'Small Molecule',
    timeline: [
      { stage: 'preclinical', startDate: '2016-02', endDate: '2017-09' },
      { stage: 'phase1', startDate: '2017-10', endDate: '2018-12' },
      { stage: 'phase2', startDate: '2019-01', endDate: '2020-11', milestone: 'Significant pain reduction' },
      { stage: 'phase3', startDate: '2021-01' }
    ],
    approvals: []
  },
  {
    id: 'arthrirelief',
    name: 'ArthriRelief',
    genericName: 'cartilomab',
    companyId: 'pfizer',
    description: 'A disease-modifying treatment for osteoarthritis that targets cartilage regeneration and inflammation reduction.',
    stage: 'phase2',
    therapeuticAreas: ['rheumatology', 'orthopedics'],
    indications: ['Osteoarthritis'],
    moleculeType: 'Monoclonal Antibody',
    timeline: [
      { stage: 'preclinical', startDate: '2017-04', endDate: '2019-02' },
      { stage: 'phase1', startDate: '2019-03', endDate: '2020-08' },
      { stage: 'phase2', startDate: '2020-09' }
    ],
    approvals: []
  },
  {
    id: 'hepatocure',
    name: 'HepatoCure',
    genericName: 'hepasolimab',
    companyId: 'pfizer',
    description: 'A revolutionary treatment for advanced liver diseases including non-alcoholic steatohepatitis (NASH).',
    stage: 'submitted',
    therapeuticAreas: ['gastroenterology', 'hepatology'],
    indications: ['Non-alcoholic Steatohepatitis', 'Liver Fibrosis'],
    moleculeType: 'Monoclonal Antibody',
    timeline: [
      { stage: 'preclinical', startDate: '2015-01', endDate: '2016-07' },
      { stage: 'phase1', startDate: '2016-08', endDate: '2017-12' },
      { stage: 'phase2', startDate: '2018-01', endDate: '2019-10', milestone: 'Fibrosis reduction observed' },
      { stage: 'phase3', startDate: '2019-11', endDate: '2022-03', milestone: 'Met primary endpoint of NASH resolution' },
      { stage: 'submitted', startDate: '2022-04' }
    ],
    approvals: [
      { region: 'United States', date: '2022-04-15', agency: 'FDA', indication: 'NASH', status: 'pending' }
    ]
  },
  {
    id: 'covid-immun',
    name: 'COVID-Immun',
    genericName: 'pancoronavir',
    companyId: 'pfizer',
    description: 'A broad-spectrum antiviral medication effective against multiple coronavirus strains including SARS-CoV-2.',
    stage: 'approved',
    therapeuticAreas: ['infectious disease'],
    indications: ['COVID-19'],
    moleculeType: 'Small Molecule',
    timeline: [
      { stage: 'preclinical', startDate: '2020-02', endDate: '2020-04', milestone: 'Rapid development' },
      { stage: 'phase1', startDate: '2020-05', endDate: '2020-07', milestone: 'Accelerated trials' },
      { stage: 'phase2', startDate: '2020-07', endDate: '2020-10', milestone: 'Strong antiviral activity' },
      { stage: 'phase3', startDate: '2020-11', endDate: '2021-05', milestone: 'Reduced hospitalization risk' },
      { stage: 'submitted', startDate: '2021-06', endDate: '2021-09' },
      { stage: 'approved', startDate: '2021-10' }
    ],
    approvals: [
      { region: 'United States', date: '2021-10-08', agency: 'FDA', indication: 'COVID-19', status: 'approved' },
      { region: 'European Union', date: '2021-11-12', agency: 'EMA', indication: 'COVID-19', status: 'approved' },
      { region: 'United Kingdom', date: '2021-10-22', agency: 'MHRA', indication: 'COVID-19', status: 'approved' },
      { region: 'Japan', date: '2021-12-05', agency: 'PMDA', indication: 'COVID-19', status: 'approved' }
    ]
  },
  {
    id: 'allerclear',
    name: 'AllerClear',
    genericName: 'omnidestatin',
    companyId: 'pfizer',
    description: 'A long-lasting non-drowsy antihistamine for seasonal and perennial allergies with minimal side effects.',
    stage: 'marketed',
    therapeuticAreas: ['immunology', 'allergy'],
    indications: ['Seasonal Allergic Rhinitis', 'Chronic Urticaria'],
    moleculeType: 'Small Molecule',
    timeline: [
      { stage: 'preclinical', startDate: '2013-11', endDate: '2015-03' },
      { stage: 'phase1', startDate: '2015-04', endDate: '2016-01' },
      { stage: 'phase2', startDate: '2016-02', endDate: '2017-06', milestone: 'Superior to standard antihistamines' },
      { stage: 'phase3', startDate: '2017-07', endDate: '2019-01', milestone: 'Confirmed efficacy and safety' },
      { stage: 'submitted', startDate: '2019-02', endDate: '2019-10' },
      { stage: 'approved', startDate: '2019-11', endDate: '2020-01' },
      { stage: 'marketed', startDate: '2020-02' }
    ],
    approvals: [
      { region: 'United States', date: '2019-11-22', agency: 'FDA', indication: 'Seasonal Allergic Rhinitis', status: 'approved' },
      { region: 'European Union', date: '2020-01-18', agency: 'EMA', indication: 'Seasonal Allergic Rhinitis', status: 'approved' },
      { region: 'United States', date: '2021-03-05', agency: 'FDA', indication: 'Chronic Urticaria', status: 'approved' }
    ]
  },
  {
    id: 'bonestrengthen',
    name: 'BoneStrengthen',
    genericName: 'osteogelin',
    companyId: 'pfizer',
    description: 'An innovative treatment for osteoporosis that stimulates bone formation while inhibiting bone resorption.',
    stage: 'phase3',
    therapeuticAreas: ['orthopedics', 'endocrinology'],
    indications: ['Osteoporosis', 'Osteopenia'],
    moleculeType: 'Peptide',
    timeline: [
      { stage: 'preclinical', startDate: '2016-05', endDate: '2018-01' },
      { stage: 'phase1', startDate: '2018-02', endDate: '2019-03' },
      { stage: 'phase2', startDate: '2019-04', endDate: '2021-06', milestone: 'Increased bone mineral density' },
      { stage: 'phase3', startDate: '2021-08' }
    ],
    approvals: []
  },
  {
    id: 'psoriaclear',
    name: 'PsoriaClear',
    genericName: 'dermakumab',
    companyId: 'pfizer',
    description: 'A targeted biologic therapy for moderate to severe plaque psoriasis with long-lasting skin clearance.',
    stage: 'approved',
    therapeuticAreas: ['dermatology', 'immunology'],
    indications: ['Plaque Psoriasis', 'Psoriatic Arthritis'],
    moleculeType: 'Monoclonal Antibody',
    timeline: [
      { stage: 'preclinical', startDate: '2014-09', endDate: '2016-03' },
      { stage: 'phase1', startDate: '2016-04', endDate: '2017-02' },
      { stage: 'phase2', startDate: '2017-03', endDate: '2018-10', milestone: 'High PASI 90 response rates' },
      { stage: 'phase3', startDate: '2018-11', endDate: '2020-08', milestone: 'Confirmed superior efficacy' },
      { stage: 'submitted', startDate: '2020-09', endDate: '2021-04' },
      { stage: 'approved', startDate: '2021-05' }
    ],
    approvals: [
      { region: 'United States', date: '2021-05-12', agency: 'FDA', indication: 'Plaque Psoriasis', status: 'approved' },
      { region: 'European Union', date: '2021-08-23', agency: 'EMA', indication: 'Plaque Psoriasis', status: 'approved' },
      { region: 'United States', date: '2022-02-08', agency: 'FDA', indication: 'Psoriatic Arthritis', status: 'pending' }
    ]
  }
];

// Helper functions to get products data
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCompany(companyId: string): Product[] {
  return products.filter(product => product.companyId === companyId);
}

export function getProductsByStage(stage: ProductStage): Product[] {
  return products.filter(product => product.stage === stage);
}

export function getProductsByTherapeuticArea(areaId: string): Product[] {
  return products.filter(product => product.therapeuticAreas.includes(areaId));
}

export function getRelatedProducts(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => 
      p.id !== productId && (
        p.companyId === product.companyId ||
        p.therapeuticAreas.some(area => product.therapeuticAreas.includes(area)) ||
        p.indications.some(ind => product.indications.includes(ind))
      )
    )
    .slice(0, 3);
} 