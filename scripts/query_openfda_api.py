#!/usr/bin/env python
"""
Query the OpenFDA API directly to search for specific pharmaceutical companies.
This uses the Drugs@FDA endpoint to search by manufacturer_name and sponsor_name.
"""

import requests
import json
import sys
import urllib.parse

# Base URL for the OpenFDA API
BASE_URL = "https://api.fda.gov/drug/drugsfda.json"

# Companies to search for
COMPANIES_TO_SEARCH = [
    "Johnson & Johnson",
    "Moderna",
    "BioNTech",
    "ADMA Biologics",
    "Adaptive Biotechnologies",
    "Arrowhead Pharmaceuticals",
    "Beam Therapeutics",
    "Zoetis",
    "Pfizer",
    "Merck",
    "Janssen"
]

def search_openfda_by_manufacturer(company_name):
    """
    Search the OpenFDA API for a company by manufacturer_name
    """
    # URL encode the company name for the API query
    encoded_name = urllib.parse.quote(company_name)
    query = f"search=openfda.manufacturer_name:\"{encoded_name}\"&limit=5"
    url = f"{BASE_URL}?{query}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('results', []), data.get('meta', {}).get('results', {}).get('total', 0)
        elif response.status_code == 404:
            # No matches found
            return [], 0
        else:
            # Try a partial match search instead
            return search_openfda_by_partial_manufacturer(company_name)
    except Exception as e:
        print(f"Exception when searching for manufacturer {company_name}: {e}")
        return [], 0

def search_openfda_by_partial_manufacturer(company_name):
    """
    Search the OpenFDA API for a company by partial manufacturer_name
    """
    # For partial search, remove special characters and take first word
    search_term = company_name.split()[0].replace("&", "").replace(",", "")
    
    # URL encode the search term
    encoded_term = urllib.parse.quote(search_term)
    query = f"search=openfda.manufacturer_name:{encoded_term}&limit=5"
    url = f"{BASE_URL}?{query}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('results', []), data.get('meta', {}).get('results', {}).get('total', 0)
        elif response.status_code == 404:
            # No matches found
            return [], 0
        else:
            print(f"Error searching for partial manufacturer {search_term}: {response.status_code}")
            return [], 0
    except Exception as e:
        print(f"Exception when searching for partial manufacturer {search_term}: {e}")
        return [], 0

def search_openfda_by_sponsor(company_name):
    """
    Search the OpenFDA API for a company by sponsor_name
    """
    # URL encode the company name for the API query
    encoded_name = urllib.parse.quote(company_name)
    query = f"search=sponsor_name:\"{encoded_name}\"&limit=5"
    url = f"{BASE_URL}?{query}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('results', []), data.get('meta', {}).get('results', {}).get('total', 0)
        elif response.status_code == 404:
            # No matches found
            return [], 0
        else:
            # Try a partial match search instead
            return search_openfda_by_partial_sponsor(company_name)
    except Exception as e:
        print(f"Exception when searching for sponsor {company_name}: {e}")
        return [], 0

def search_openfda_by_partial_sponsor(company_name):
    """
    Search the OpenFDA API for a company by partial sponsor_name
    """
    # For partial search, remove special characters and take first word
    search_term = company_name.split()[0].replace("&", "").replace(",", "")
    
    # URL encode the search term
    encoded_term = urllib.parse.quote(search_term)
    query = f"search=sponsor_name:{encoded_term}&limit=5"
    url = f"{BASE_URL}?{query}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('results', []), data.get('meta', {}).get('results', {}).get('total', 0)
        elif response.status_code == 404:
            # No matches found
            return [], 0
        else:
            print(f"Error searching for partial sponsor {search_term}: {response.status_code}")
            return [], 0
    except Exception as e:
        print(f"Exception when searching for partial sponsor {search_term}: {e}")
        return [], 0

def extract_company_names(results):
    """
    Extract unique company names from results to identify all variants
    """
    names = set()
    
    for result in results:
        # Get sponsor name
        if 'sponsor_name' in result:
            names.add(result['sponsor_name'])
            
        # Get manufacturer names from openfda section
        if 'openfda' in result and 'manufacturer_name' in result['openfda']:
            for name in result['openfda']['manufacturer_name']:
                names.add(name)
                
    return names

def extract_related_names(results):
    """
    Extract related company names, application numbers and products from results
    """
    related_info = set()
    
    for result in results:
        # Get application number and sponsor name
        app_num = result.get('application_number', 'N/A')
        sponsor = result.get('sponsor_name', 'N/A')
        
        # Look at each product
        for product in result.get('products', []):
            brand_name = product.get('brand_name', 'N/A')
            related_info.add((sponsor, app_num, brand_name))
            
    return related_info

def search_variants(company):
    """
    Search for variants of a company name
    """
    variants = [company]
    
    # Add common variants
    if "Inc." in company:
        variants.append(company.replace("Inc.", "").strip())
    if "&" in company:
        variants.append(company.replace("&", "and"))
    if "Pharmaceuticals" in company:
        variants.append(company.replace("Pharmaceuticals", "Pharma"))
    if "Therapeutics" in company:
        variants.append(company.replace("Therapeutics", "Therap"))
    if "Biologics" in company:
        variants.append(company.replace("Biologics", "Bio"))
        
    # Add first word for common company prefixes
    first_word = company.split()[0]
    if first_word not in variants:
        variants.append(first_word)
        
    return variants

def main():
    print("Querying OpenFDA API for pharmaceutical companies...\n")
    
    for company in COMPANIES_TO_SEARCH:
        print(f"\n{'='*50}")
        print(f"SEARCHING FOR: {company}")
        print(f"{'='*50}")
        
        variants = search_variants(company)
        found_any = False
        all_company_names = set()
        
        for variant in variants:
            # Search by manufacturer
            man_results, man_total = search_openfda_by_manufacturer(variant)
            if man_total > 0:
                found_any = True
                print(f"\nFound {man_total} results as MANUFACTURER for '{variant}':")
                related = extract_related_names(man_results)
                for sponsor, app_num, brand in sorted(related):
                    print(f"  - {brand} (App: {app_num}, Sponsor: {sponsor})")
                if man_total > 5:
                    print(f"  ... and {man_total - 5} more results")
                
                # Add to list of found company names
                all_company_names.update(extract_company_names(man_results))
            
            # Search by sponsor
            sponsor_results, sponsor_total = search_openfda_by_sponsor(variant)
            if sponsor_total > 0:
                found_any = True
                print(f"\nFound {sponsor_total} results as SPONSOR for '{variant}':")
                related = extract_related_names(sponsor_results)
                for sponsor, app_num, brand in sorted(related):
                    print(f"  - {brand} (App: {app_num}, Sponsor: {sponsor})")
                if sponsor_total > 5:
                    print(f"  ... and {sponsor_total - 5} more results")
                
                # Add to list of found company names
                all_company_names.update(extract_company_names(sponsor_results))
        
        if not found_any:
            print(f"\nNo results found for '{company}' or its variants in OpenFDA database.")
        else:
            # Print all unique company names found (useful for identifying aliases)
            print("\nAll company name variants found:")
            for name in sorted(all_company_names):
                print(f"  - {name}")

if __name__ == "__main__":
    main() 