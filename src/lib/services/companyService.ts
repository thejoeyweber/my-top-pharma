import { supabase } from "../supabase";
import type { Company } from "../../interfaces/entities/Company";
import type {
  ICompanyService,
  CompanyListOptions,
} from "../../interfaces/services/ICompanyService";

const companyService: ICompanyService = {
  async getCompanies(
    options?: CompanyListOptions
  ): Promise<Company[]> {
    console.log("getCompanies called with options:", options);
    // Placeholder: Implement actual Supabase query logic here in Task 1.4
    // Example:
    // const { data, error } = await supabase.from('companies').select('*');
    // if (error) throw error;
    // return data.map(dbCompanyToCompany); // Assuming a mapping function
    return Promise.resolve([]); // Return empty array for now
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