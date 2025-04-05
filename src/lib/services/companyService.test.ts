import { describe, it, expect, vi, beforeEach } from "vitest";
import { companyService } from "./companyService";
import { dbCompanyToCompany } from "../../interfaces/entities"; // Import the real mapping function
import type { DbCompany, Company } from "../../interfaces/entities"; // Import DB type for mock data and App type for expected result

// --- Mock Setup ---
const mockIlike = vi.fn();
// Mock the builder object returned by select/ilike etc.
const mockBuilder = {
  ilike: mockIlike,
  // Mock the implicit .then() when the query object is awaited
  then: vi.fn(),
};

// Mock the select function to return the mock builder
const mockSelect = vi.fn(() => mockBuilder);

// Mock the from function
const mockFrom = vi.fn(() => ({
  select: mockSelect,
}));

// Apply the mock to the supabase module
vi.mock("../supabase", () => ({
  supabase: {
    from: mockFrom,
  },
}));
// --- End Mock Setup ---

// Realistic Mock Raw DB Data (based on provided query results)
const mockDbCompanies: DbCompany[] = [
  {
    id: "d6f095e0-1799-44dc-85b9-eee818e97ca7",
    name: "Arcellx, Inc.",
    description: "Arcellx, Inc., a clinical-stage biotechnology company, engages in the development of various immunotherapies for patients with cancer and other incurable diseases. The company's lead ddCAR product candidate is CART-ddBCMA, which is in phase 1 clinical trial for the treatment of patients with relapsed or refractory (r/r) multiple myeloma (MM). It is also developing ACLX-001, an immunotherapeutic combination composed of ARC-T cells and bi-valent SparX proteins targeting BCMA to treat r/r MM; ACLX-002 and ACLX-003 for treating r/r acute myeloid leukemia (AML) and myelodysplastic syndrome (MDS); and other AML/MDS product candidates, as well as solid tumor programs. The company was formerly known as Encarta Therapeutics, Inc. and changed its name to Arcellx, Inc. in January 2016. Arcellx, Inc. was incorporated in 2014 and is headquartered in Gaithersburg, Maryland.",
    logo_url: null,
    header_image_url: null,
    headquarters: "Gaithersburg, US",
    founded: 2022,
    website: "https://arcellx.com",
    market_cap: 3335101407.00, // Converted from string
    employees: 163,
    ticker_symbol: "ACLX",
    stock_exchange: "NASDAQ",
    ownership_type: null,
    parent_company_id: null,
    created_at: "2025-04-02T22:01:44.719532+00:00", // Adjusted format slightly for consistency if needed
    updated_at: "2025-04-04T03:25:55.990026+00:00", // Adjusted format slightly for consistency if needed
    slug: "arcellx"
  },
  {
    id: "e7a7d9b4-2e5e-4c61-a1f6-e9f7c54fa80f",
    name: "ADMA Biologics, Inc.",
    description: "ADMA Biologics, Inc., a biopharmaceutical company, engages in developing, manufacturing, and marketing specialty plasma-derived biologics for the treatment of immune deficiencies and infectious diseases in the United States and internationally. It offers BIVIGAM, an intravenous immune globulin (IVIG) product indicated for the treatment of primary humoral immunodeficiency (PI); ASCENIV, an IVIG product for the treatment of PI; and Nabi-HB for the treatment of acute exposure to blood containing Hepatitis B surface antigen and other listed exposures to Hepatitis B. The company also develops a pipeline of plasma-derived therapeutics, including products related to the methods of treatment and prevention of S. pneumonia infection for an immunoglobulin. In addition, it operates source plasma collection facilities. The company sells its products through independent distributors, sales agents, specialty pharmacies, and other alternate site providers. ADMA Biologics, Inc. was incorporated in 2004 and is headquartered in Ramsey, New Jersey.",
    logo_url: null,
    header_image_url: null,
    headquarters: "Ramsey, US",
    founded: 2013,
    website: "https://www.admabiologics.com",
    market_cap: 4614483300.00, // Converted from string
    employees: 685,
    ticker_symbol: "ADMA",
    stock_exchange: "NASDAQ",
    ownership_type: null,
    parent_company_id: null,
    created_at: "2025-04-02T22:01:44.719532+00:00",
    updated_at: "2025-04-04T03:25:55.990026+00:00",
    slug: "adma-biologics"
  },
  {
    id: "d7ca9a47-ae0a-4dae-96be-084591377f63",
    name: "Adaptive Biotechnologies Corporation",
    description: "Adaptive Biotechnologies Corporation, a commercial-stage company, develops an immune medicine platform for the diagnosis and treatment of various diseases. The company offers immunoSEQ, a platform and core immunosequencing product that is used to answer translational research questions, as well as to discover new prognostic and diagnostic signals; and T-Detect COVID for the confirmation of past COVID-19 infection. It also provides clonoSEQ, a clinical diagnostic product for the detection and monitoring of minimal residual disease in patients with multiple myeloma, B cell acute lymphoblastic leukemia, and chronic lymphocytic leukemia, as well as available as a CLIA-validated laboratory developed test for patients with other lymphoid cancers; and immunoSEQ T-MAP COVID for vaccine developers and researchers to measure the T-cell immune response to vaccines. In addition, the company offers a pipeline of clinical products and services that are used for the diagnosing, monitoring, and treatment of diseases, such as cancer, autoimmune conditions, and infectious diseases. It serves the life sciences research, clinical diagnostics, and drug discovery applications. Adaptive Biotechnologies Corporation has strategic collaborations with Genentech, Inc. for the development, manufacture, and commercialization of neoantigen directed T cell therapies for the treatment of a range of cancers; and Microsoft Corporation to develop diagnostic tests for the early detection of various diseases from a single blood test. The company was formerly known as Adaptive TCR Corporation and changed its name to Adaptive Biotechnologies Corporation in December 2011. Adaptive Biotechnologies Corporation was incorporated in 2009 and is headquartered in Seattle, Washington.",
    logo_url: null,
    header_image_url: null,
    headquarters: "Seattle, US",
    founded: 2019,
    website: "https://www.adaptivebiotech.com",
    market_cap: 1117336640.00, // Converted from string
    employees: 619,
    ticker_symbol: "ADPT",
    stock_exchange: "NASDAQ",
    ownership_type: null,
    parent_company_id: null,
    created_at: "2025-04-02T22:01:44.719532+00:00",
    updated_at: "2025-04-04T03:25:55.990026+00:00",
    slug: "adaptive-biotechnologies"
  }
];

// Expected Mapped Data (using the actual mapping function)
const expectedCompanies: Company[] = mockDbCompanies.map(dbCompanyToCompany);

describe("companyService", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Reset the mock builder's promise resolution
    mockBuilder.then.mockReset();
    // Ensure chained methods return the mock builder
    mockIlike.mockReturnThis();
  });

  describe("getCompanies", () => {
    it("should fetch and map companies correctly when called without options", async () => {
      // Arrange: Setup mock response for the final await
      mockBuilder.then.mockImplementation((resolve) => resolve({ data: mockDbCompanies, error: null }));

      // Act: Call the service method
      const result = await companyService.getCompanies();

      // Assert: Check if Supabase was called correctly
      expect(mockFrom).toHaveBeenCalledWith("companies");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockIlike).not.toHaveBeenCalled(); // Filter should not be called

      // Assert: Check if the result matches the expected mapped data
      expect(result).toEqual(expectedCompanies);
    });

    it("should apply filterText option correctly using case-insensitive search on name", async () => {
      // Arrange
      const filterText = "bio";
      // Filter the raw mock data to get the expected raw result
      const expectedRawFiltered = mockDbCompanies.filter(c => 
        c.name.toLowerCase().includes(filterText.toLowerCase())
      );
      // Map the expected raw result to the Company type
      const expectedFilteredCompanies = expectedRawFiltered.map(dbCompanyToCompany);
      
      // Setup mock response for the final await (after ilike)
      mockBuilder.then.mockImplementation((resolve) => resolve({ data: expectedRawFiltered, error: null }));

      // Act: Call the service method with filter option
      const result = await companyService.getCompanies({ filterText });

      // Assert: Check if Supabase was called correctly
      expect(mockFrom).toHaveBeenCalledWith("companies");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockIlike).toHaveBeenCalledWith('name', `%${filterText}%`); // Check ilike call

      // Assert: Check if the result matches the expected filtered and mapped data
      expect(result).toEqual(expectedFilteredCompanies);
      // Ensure it returned only the matching companies
      expect(result.length).toBe(2); 
      expect(result[0].name).toContain("Biologics");
      expect(result[1].name).toContain("Biotechnologies");
    });
    
    it.todo('should apply filterText option correctly using case-insensitive search on name AND description'); // Future enhancement

    it('should handle Supabase errors', async () => {
      // Arrange: Setup mock error response
      const mockError = new Error('Supabase query failed');
      // Make the mock builder reject the promise
      mockBuilder.then.mockImplementation((resolve, reject) => reject(mockError));

      // Act & Assert: Expect the error to be thrown
      await expect(companyService.getCompanies()).rejects.toThrow(mockError);

      // Assert: Check if Supabase was called correctly
      expect(mockFrom).toHaveBeenCalledWith("companies");
      expect(mockSelect).toHaveBeenCalledWith("*");
    });

     it('should return an empty array when Supabase returns null data and no error', async () => {
      // Arrange: Setup mock response with null data
      mockBuilder.then.mockImplementation((resolve) => resolve({ data: null, error: null }));

      // Act: Call the service method
      const result = await companyService.getCompanies();

      // Assert: Check if Supabase was called correctly
      expect(mockFrom).toHaveBeenCalledWith("companies");
      expect(mockSelect).toHaveBeenCalledWith("*");

      // Assert: Check if the result is an empty array
      expect(result).toEqual([]);
    });
    
    it.todo('should apply sortBy option correctly');
    it.todo('should apply pagination options correctly');
  });

  describe("getCompanyDetails", () => {
    // Add tests for getCompanyDetails later
    it.todo('should fetch and map a single company by slug');
    it.todo('should return null if company slug is not found');
    it.todo('should handle Supabase errors when fetching details');
  });
}); 