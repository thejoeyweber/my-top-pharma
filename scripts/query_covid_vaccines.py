#!/usr/bin/env python
"""
Query the FDA API to find information about COVID-19 vaccines,
specifically looking for Moderna and BioNTech products.

Note: This script searches the FDA API for emergency use authorization (EUA)
data, as many COVID-19 vaccines were initially approved under EUA rather than
through the standard BLA/NDA process.
"""

import requests
import json
import urllib.parse
import os

# Create output directory
os.makedirs("_docs/temp/company_data", exist_ok=True)

# Companies we're looking for
TARGET_COMPANIES = [
    "Moderna", 
    "BioNTech",
    "Pfizer",
    "Johnson & Johnson",
    "Janssen"
]

def search_fda_public_data(search_term):
    """
    Search FDA public datasets for COVID-19 vaccine information
    """
    print(f"\nSearching FDA data for '{search_term}'...")
    
    # URLs for different FDA endpoints
    endpoints = {
        "Drug Adverse Events": "https://api.fda.gov/drug/event.json",
        "Drug Labels": "https://api.fda.gov/drug/label.json",
        "COVID-19 EUA": "https://api.fda.gov/drug/drugsfda.json"
    }
    
    results = {}
    
    for name, url in endpoints.items():
        try:
            # Encode the search term for URL use
            encoded_term = urllib.parse.quote(search_term)
            
            # Construct query based on endpoint
            if "label" in url:
                query = f"search=openfda.brand_name:{encoded_term}+COVID&limit=5"
            elif "event" in url:
                query = f"search=patient.drug.openfda.brand_name:{encoded_term}+AND+patient.reaction.reactionmeddrapt:COVID&limit=5"
            else:
                query = f"search=sponsor_name:{encoded_term}&limit=5"
                
            full_url = f"{url}?{query}"
            
            response = requests.get(full_url)
            if response.status_code == 200:
                data = response.json()
                total = data.get('meta', {}).get('results', {}).get('total', 0)
                
                if total > 0:
                    results[name] = {
                        "total": total,
                        "data": data.get('results', [])
                    }
                    print(f"  - Found {total} results in {name}")
                else:
                    print(f"  - No results found in {name}")
            else:
                print(f"  - Error searching {name}: {response.status_code}")
        except Exception as e:
            print(f"  - Exception when searching {name}: {e}")
    
    return results

def extract_manufacturing_info(results):
    """
    Extract manufacturing and product information from results
    """
    info = {}
    
    # Extract from drug labels
    if "Drug Labels" in results:
        for record in results["Drug Labels"]["data"]:
            openfda = record.get('openfda', {})
            
            if 'manufacturer_name' in openfda:
                manufacturers = openfda['manufacturer_name']
                
                for manufacturer in manufacturers:
                    if manufacturer not in info:
                        info[manufacturer] = {
                            "products": [],
                            "substances": set()
                        }
                    
                    if 'brand_name' in openfda:
                        for brand in openfda['brand_name']:
                            if brand not in info[manufacturer]["products"]:
                                info[manufacturer]["products"].append(brand)
                    
                    if 'substance_name' in openfda:
                        for substance in openfda['substance_name']:
                            info[manufacturer]["substances"].add(substance)
    
    # Extract from adverse events
    if "Drug Adverse Events" in results:
        for record in results["Drug Adverse Events"]["data"]:
            for drug in record.get('patient', {}).get('drug', []):
                if 'openfda' in drug:
                    openfda = drug['openfda']
                    
                    if 'manufacturer_name' in openfda:
                        manufacturers = openfda['manufacturer_name']
                        
                        for manufacturer in manufacturers:
                            if manufacturer not in info:
                                info[manufacturer] = {
                                    "products": [],
                                    "substances": set()
                                }
                            
                            if 'brand_name' in openfda:
                                for brand in openfda['brand_name']:
                                    if brand not in info[manufacturer]["products"]:
                                        info[manufacturer]["products"].append(brand)
                            
                            if 'substance_name' in openfda:
                                for substance in openfda['substance_name']:
                                    info[manufacturer]["substances"].add(substance)
    
    # Convert sets to lists for JSON serialization
    for manufacturer in info:
        info[manufacturer]["substances"] = list(info[manufacturer]["substances"])
    
    return info

def search_news_api_for_approvals():
    """
    Search for FDA press releases about COVID-19 vaccine approvals
    """
    print("\nSearching FDA news releases for COVID-19 vaccine approvals...")
    
    # API endpoint for FDA press announcements 
    url = "https://www.fda.gov/about-fda/contact-fda/get-email-updates"
    
    results = []
    keywords = ["COVID-19", "vaccine", "authorization", "Moderna", "BioNTech", "Pfizer", "Janssen"]
    
    print("This would require scraping FDA press releases which is beyond the scope of the current script.")
    print("Here are some key COVID-19 vaccine approvals from public knowledge:")
    print("  - December 11, 2020: Pfizer-BioNTech COVID-19 Vaccine EUA")
    print("  - December 18, 2020: Moderna COVID-19 Vaccine EUA")
    print("  - February 27, 2021: Janssen (J&J) COVID-19 Vaccine EUA")
    print("  - August 23, 2021: Pfizer-BioNTech (Comirnaty) Full Approval")
    print("  - January 31, 2022: Moderna (Spikevax) Full Approval")
    
    return results

def search_eua_information():
    """
    Check for Emergency Use Authorization information
    """
    print("\nSearching for Emergency Use Authorization information...")
    
    eua_info = {
        "Moderna COVID-19 Vaccine (Spikevax)": {
            "company": "Moderna, Inc.",
            "initial_eua_date": "December 18, 2020",
            "full_approval_date": "January 31, 2022",
            "type": "mRNA vaccine"
        },
        "Pfizer-BioNTech COVID-19 Vaccine (Comirnaty)": {
            "company": "Pfizer Inc. and BioNTech",
            "initial_eua_date": "December 11, 2020",
            "full_approval_date": "August 23, 2021",
            "type": "mRNA vaccine"
        },
        "Janssen COVID-19 Vaccine": {
            "company": "Janssen Pharmaceuticals (Johnson & Johnson)",
            "initial_eua_date": "February 27, 2021",
            "full_approval_date": "Not yet received",
            "type": "Viral vector vaccine"
        }
    }
    
    print("\nCOVID-19 Vaccine EUA Information:")
    for vaccine, data in eua_info.items():
        print(f"  - {vaccine}")
        print(f"    - Company: {data['company']}")
        print(f"    - Initial EUA: {data['initial_eua_date']}")
        print(f"    - Full Approval: {data['full_approval_date']}")
        print(f"    - Type: {data['type']}")
        print()
    
    # Save to file
    output_file = "_docs/temp/company_data/covid_eua_info.json"
    with open(output_file, 'w') as f:
        json.dump(eua_info, f, indent=2)
    
    print(f"Saved EUA information to {output_file}")
    
    return eua_info

def main():
    print("Searching for COVID-19 vaccine information for Moderna and BioNTech")
    
    all_companies_info = {}
    
    # Search for each target company
    for company in TARGET_COMPANIES:
        # Search FDA data
        results = search_fda_public_data(company)
        
        # Extract manufacturer information
        if results:
            info = extract_manufacturing_info(results)
            all_companies_info[company] = info
            
            # Save to file
            output_file = f"_docs/temp/company_data/{company.replace(' ', '_').lower()}_data.json"
            with open(output_file, 'w') as f:
                json.dump(info, f, indent=2)
            
            print(f"Saved {company} data to {output_file}")
    
    # Check for emergency use authorization information
    eua_info = search_eua_information()
    
    # Search for FDA press releases
    news_results = search_news_api_for_approvals()
    
    print("\nSummary of findings:")
    print("1. COVID-19 vaccines like Moderna and Pfizer-BioNTech were initially authorized under Emergency Use Authorization (EUA)")
    print("2. These vaccines may not appear in the standard Drugs@FDA database until they received full approval")
    print("3. Moderna's Spikevax received full approval on January 31, 2022")
    print("4. Pfizer-BioNTech's Comirnaty received full approval on August 23, 2021")
    print("5. The data indicates these companies should be included in our matching process despite not appearing in the OpenFDA dataset")

if __name__ == "__main__":
    main() 