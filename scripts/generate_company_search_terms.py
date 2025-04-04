import json
import os
import urllib.parse

# Special cases mapping for companies that need custom search terms
SPECIAL_CASES = {
    "Eli Lilly": "Lilly",
    "Johnson & Johnson": "Johnson & Johnson",
    "GSK": "GlaxoSmithKline",
    "AstraZeneca": "AstraZeneca",
    "Novo Nordisk": "Novo Nordisk",
    "Takeda Pharmaceutical": "Takeda",
    "Dr. Reddy's": "Dr. Reddy's",
    "Regeneron": "Regeneron",
    "Moderna": "Moderna US",  # From our previous finding
    "BeiGene": "BeiGene",
    "Viatris": "Viatris",
    "Sanofi": "Sanofi",
    "Amgen": "Amgen",
    "Gilead": "Gilead",
    "Biogen": "Biogen"
}

def clean_search_term(term):
    """
    Clean the search term by removing trailing commas and other unwanted characters.
    """
    # Remove trailing commas
    term = term.rstrip(',')
    
    # Remove other unwanted characters that might cause issues
    term = term.strip()
    
    return term

def get_search_term(company_name):
    """
    Generate search term from company name, handling special cases.
    """
    # First check if the company name starts with any of our special cases
    for prefix, replacement in SPECIAL_CASES.items():
        if company_name.startswith(prefix):
            return replacement
    
    # Default: use first word of company name
    # Handle lowercase company names starting with a
    if company_name.startswith("a") and len(company_name) > 1 and company_name[1].isupper():
        # Handle names like aTyr, where the first letter is lowercase
        search_term = company_name
    else:
        search_term = company_name.split(" ")[0]
    
    # Clean the search term
    return clean_search_term(search_term)

def get_url_encoded_term(term):
    """
    URL encode the search term for use in API queries.
    """
    return urllib.parse.quote(term)

def main():
    # Path to the input JSON file
    input_file = "_docs/temp/fmp_companies_initial.json"
    
    # Check if the file exists
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} does not exist.")
        return
    
    # Load the company data
    with open(input_file, 'r') as f:
        companies = json.load(f)
    
    # Generate search terms for each company
    search_terms = []
    for company in companies:
        name = company["name"]
        ticker = company["ticker_symbol"]
        search_term = get_search_term(name)
        url_encoded_term = get_url_encoded_term(search_term)
        
        search_terms.append({
            "ticker_symbol": ticker,
            "company_name": name,
            "search_term": search_term,
            "url_encoded_term": url_encoded_term
        })
    
    # Create a comma-separated string of search terms
    search_terms_csv = ",".join([term["search_term"] for term in search_terms])
    
    # Save the CSV to a file
    with open("_docs/temp/company_search_terms.csv", "w") as f:
        f.write(search_terms_csv)
    
    # Save the full mapping as JSON for reference
    with open("_docs/temp/company_search_terms.json", "w") as f:
        json.dump(search_terms, f, indent=2)
    
    # Also save a CSV file with ticker symbol and search term
    with open("_docs/temp/company_search_mapping.csv", "w") as f:
        f.write("ticker_symbol,company_name,search_term,url_encoded_term\n")
        for term in search_terms:
            f.write(f"{term['ticker_symbol']},{term['company_name']},{term['search_term']},{term['url_encoded_term']}\n")
    
    print(f"Generated {len(search_terms)} company search terms")
    print(f"CSV file saved to _docs/temp/company_search_terms.csv")
    print(f"Detailed mapping saved to _docs/temp/company_search_mapping.csv")
    print(f"JSON mapping saved to _docs/temp/company_search_terms.json")

if __name__ == "__main__":
    main() 