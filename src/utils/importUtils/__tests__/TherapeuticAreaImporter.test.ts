/**
 * TherapeuticAreaImporter Tests
 * 
 * Unit tests for the TherapeuticAreaImporter class.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TherapeuticAreaImporter } from '../TherapeuticAreaImporter';
import * as fs from 'fs/promises';
import * as path from 'path';
import https from 'https';

// Mock the dependencies
vi.mock('fs/promises', () => ({
  access: vi.fn(),
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn().mockResolvedValue('Code,Classification,Specialization,Definition\n207RC0000X,Allopathic & Osteopathic Physicians,Cardiology,A cardiologist specializes in diseases of the heart')
}));

vi.mock('path', () => ({
  join: (...args: string[]) => args.join('/'),
  dirname: vi.fn((path) => path.split('/').slice(0, -1).join('/'))
}));

vi.mock('https', () => ({
  get: vi.fn()
}));

vi.mock('../../../utils/stringUtils', () => ({
  generateSlug: (str: string) => str.toLowerCase().replace(/[^\w]+/g, '-')
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockResolvedValue({ error: null, count: 1 }),
    insert: vi.fn().mockResolvedValue({ error: null }),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis()
  }))
}));

// Mock the CSV parse function
vi.mock('csv-parse/sync', () => ({
  parse: vi.fn(() => [
    { 
      Code: '207RC0000X',
      Classification: 'Allopathic & Osteopathic Physicians',
      Specialization: 'Cardiology',
      Definition: 'A cardiologist specializes in diseases of the heart'
    },
    {
      Code: '207RO0000X',
      Classification: 'Allopathic & Osteopathic Physicians',
      Specialization: 'Oncology',
      Definition: 'An oncologist specializes in the treatment of cancer'
    }
  ])
}));

describe('TherapeuticAreaImporter', () => {
  let importer: TherapeuticAreaImporter;
  const mockHttpsResponse = {
    statusCode: 200,
    on: vi.fn().mockImplementation((event, callback) => {
      if (event === 'data') callback(Buffer.from('mock csv data'));
      if (event === 'end') callback();
      return mockHttpsResponse;
    }),
    pipe: vi.fn()
  };
  
  const mockHttpsGet = https.get as unknown as vi.Mock;
  
  beforeEach(() => {
    importer = new TherapeuticAreaImporter();
    vi.resetAllMocks();
    
    // Mock HTTP response
    mockHttpsGet.mockImplementation((url, callback) => {
      callback(mockHttpsResponse);
      return { on: vi.fn() };
    });
    
    // Mock file not found for the first access check
    (fs.access as vi.Mock).mockRejectedValueOnce(new Error('File not found'));
    
    // Mock file opened for writing
    (fs.open as unknown as vi.Mock) = vi.fn().mockResolvedValue({
      write: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined)
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with correct default values', () => {
    expect(importer).toBeDefined();
  });
  
  it('should import therapeutic areas successfully', async () => {
    // Spy on protected method without exposing it
    const executeImportSpy = vi.spyOn(importer as any, 'executeImport');
    const downloadFileSpy = vi.spyOn(importer as any, 'downloadTaxonomyFile');
    const extractSpecialtiesSpy = vi.spyOn(importer as any, 'extractSpecialties');
    
    // Execute the import
    const result = await importer.import();
    
    // Verify the process flow
    expect(executeImportSpy).toHaveBeenCalled();
    expect(downloadFileSpy).toHaveBeenCalled();
    expect(extractSpecialtiesSpy).toHaveBeenCalled();
    
    // Check that statistics are returned
    expect(result).toBeDefined();
    expect(result.processed).toBeGreaterThan(0);
  });
  
  it('should handle file already exists scenario', async () => {
    // Reset the mock to make access succeed (file exists)
    (fs.access as vi.Mock).mockResolvedValueOnce(undefined);
    
    // Spy on the method
    const downloadFileSpy = vi.spyOn(importer as any, 'downloadTaxonomyFile');
    
    // Execute just the download part
    await (importer as any).downloadTaxonomyFile();
    
    // Check if the file was not downloaded because it exists
    expect(downloadFileSpy).toHaveBeenCalled();
    expect(https.get).not.toHaveBeenCalled();
  });
  
  it('should extract therapeutic areas from CSV data', async () => {
    // Execute the extraction
    await (importer as any).extractSpecialties();
    
    // Verify we have extracted some data
    const therapeuticAreas = (importer as any).therapeuticAreas;
    expect(therapeuticAreas).toBeDefined();
    expect(therapeuticAreas.length).toBeGreaterThan(0);
    
    // Check the structure of a therapeutic area
    const firstArea = therapeuticAreas[0];
    expect(firstArea).toHaveProperty('id');
    expect(firstArea).toHaveProperty('name');
    expect(firstArea).toHaveProperty('slug');
    expect(firstArea).toHaveProperty('mesh_specialty_id');
  });
  
  it('should generate pharmaceutical class mappings', () => {
    // Setup by first extracting therapeutic areas
    (importer as any).therapeuticAreas = [
      { id: '207RC0000X', name: 'Cardiology' },
      { id: '207RO0000X', name: 'Oncology' }
    ];
    
    // Generate mappings
    (importer as any).generatePharmClassMappings();
    
    // Verify mappings were created
    const mappings = (importer as any).pharmClassMappings;
    expect(mappings).toBeDefined();
    expect(mappings.length).toBeGreaterThan(0);
    
    // Check structure of a mapping
    const firstMapping = mappings[0];
    expect(firstMapping).toHaveProperty('id');
    expect(firstMapping).toHaveProperty('pharm_class');
    expect(firstMapping).toHaveProperty('therapeutic_area_id');
  });
  
  it('should provide statistics for the import process', () => {
    // Set some statistics manually
    (importer as any).statistics = {
      processed: 20,
      inserted: 15,
      updated: 5,
      errors: 0,
      skipped: 0
    };
    
    // Get statistics
    const stats = importer.getStatistics();
    
    // Verify statistics are returned correctly
    expect(stats).toEqual({
      processed: 20,
      inserted: 15,
      updated: 5,
      errors: 0,
      skipped: 0
    });
  });
}); 