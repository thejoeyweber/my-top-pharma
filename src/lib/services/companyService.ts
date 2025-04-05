import { supabase } from "../supabase";
import type { Company } from "../../interfaces/entities";
import { dbCompanyToCompany } from "../../interfaces/entities";
import type {
  ICompanyService,
  CompanyListOptions,
} from "../../interfaces/services/ICompanyService";

const companyService: ICompanyService = {
  async getCompanies(
    options?: CompanyListOptions
  ): Promise<Company[]> {
    // Start building the query
    let query = supabase.from("companies").select("*");

    // Apply filterText if provided
    if (options?.filterText) {
      const filterPattern = `%${options.filterText}%`;
      // Apply filter to the name column (can be expanded later)
      console.log(`Applying filter: name.ilike.${filterPattern}`);
      query = query.ilike("name", filterPattern);
    }

    // Execute the potentially filtered query
    console.log("Executing Supabase query for getCompanies...");
    const { data: dbData, error } = await query;

    if (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
    
    console.log(`Received ${dbData?.length ?? 0} records from Supabase.`);

    // Map the raw DB data to the Company interface
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