import { supabase } from "../supabase";
import type { Company } from "../../interfaces/entities";
import { dbCompanyToCompany } from "../../interfaces/entities";
import {
  ICompanyService,
  CompanyListOptions,
} from "../../interfaces/services/ICompanyService";

const companyService: ICompanyService = {
  async getCompanies(
    options?: CompanyListOptions
  ): Promise<Company[]> {
    console.log("getCompanies called with options:", options);

    // Basic implementation: Fetch all companies
    const { data: dbData, error } = await supabase
      .from("companies")
      .select("*");

    if (error) {
      console.error("Error fetching companies:", error);
      throw error; // Re-throw the error to be handled by the caller
    }

    // Map the raw DB data to the Company interface
    // If dbData is null/undefined, map will handle it gracefully (empty array)
    const companies = (dbData || []).map(dbCompanyToCompany);

    return companies;
  },

  async getCompanyDetails(slug: string): Promise<Company | null> {
    console.log("getCompanyDetails called with slug:", slug);
    // Placeholder: Implement actual Supabase query logic here in Task 1.4
    // Example:
    // const { data, error } = await supabase.from('companies').select('*').eq('slug', slug).single();
    // if (error) {
    //   if (error.code === 'PGRST116') return null; // Not found
    //   throw error;
    // }
    // return data ? dbCompanyToCompany(data) : null; // Assuming a mapping function
    return Promise.resolve(null); // Return null for now
  },
};

export { companyService }; 