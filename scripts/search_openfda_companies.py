#!/usr/bin/env python
"""
Search OpenFDA companies data for specific company names.
"""

import json
import os
import sys
import re
from pathlib import Path

# Set paths
base_dir = Path(__file__).resolve().parent.parent.parent
openfda_companies_path = base_dir / "_docs" / "temp" / "openfda_companies.json"

# Companies to search for with potential variations
COMPANY_SEARCH = [
    {
        "name": "Johnson & Johnson",
        "variations": ["Johnson", "Janssen", "J&J", "J & J", "JNJ"],
    },
    {
        "name": "Moderna",
        "variations": ["Moderna", "ModernaTX"],
    },
    {
        "name": "BioNTech",
        "variations": ["BioNTech", "Biontech", "BioNTech SE"],
    },
    {
        "name": "ADMA Biologics",
        "variations": ["ADMA", "ADMA Biologics"],
    },
    {
        "name": "Adaptive Biotechnologies",
        "variations": ["Adaptive", "Adaptive Bio", "Adapt", "Adaptimmune"],
    },
    {
        "name": "Arrowhead Pharmaceuticals",
        "variations": ["Arrowhead", "Arrow"],
    },
    {
        "name": "Beam Therapeutics",
        "variations": ["Beam", "Beam Therapeutics", "Beam Therap"],
    },
    {
        "name": "Zoetis",
        "variations": ["Zoetis", "Zoeti"],
    }
]

def find_word_boundary_matches(term, name):
    """Find whole-word matches for a term in a name."""
    term = term.lower()
    name = name.lower()
    
    # Try whole-word match first
    pattern = r'\b' + re.escape(term) + r'\b'
    if re.search(pattern, name):
        return True
    
    # For short terms (3 chars or less), only allow exact matches
    if len(term) <= 3:
        return term == name
    
    # For longer terms, also check for starts-with
    if len(term) > 3:
        pattern = r'\b' + re.escape(term)
        if re.search(pattern, name):
            return True
    
    return False

def main():
    """Search for companies in the OpenFDA dataset."""
    # Load OpenFDA companies
    try:
        with open(openfda_companies_path, 'r') as f:
            openfda_companies = json.load(f)
            print(f"Loaded {len(openfda_companies)} OpenFDA companies")
    except Exception as e:
        print(f"Error loading OpenFDA companies: {e}")
        return
    
    # Search for each company and its variations
    for company in COMPANY_SEARCH:
        print(f"\nSearching for '{company['name']}':")
        
        all_matches = []
        for variation in company['variations']:
            # Try substring match first
            substring_matches = [
                c for c in openfda_companies 
                if variation.lower() in c['company_name'].lower()
            ]
            
            # Then try word boundary matches
            word_matches = [
                c for c in openfda_companies
                if find_word_boundary_matches(variation, c['company_name']) 
                and c not in substring_matches
            ]
            
            if substring_matches:
                print(f"  Matches for variation '{variation}':")
                for c in sorted(substring_matches, key=lambda x: x['product_count'], reverse=True):
                    print(f"    - {c['company_name']} (products: {c['product_count']})")
                all_matches.extend(substring_matches)
            
            if word_matches:
                print(f"  Additional word boundary matches for '{variation}':")
                for c in sorted(word_matches, key=lambda x: x['product_count'], reverse=True):
                    print(f"    - {c['company_name']} (products: {c['product_count']})")
                all_matches.extend(word_matches)
        
        if not all_matches:
            print("  No matches found with any variation")
        else:
            print(f"  Total unique matches: {len(set(c['company_name'] for c in all_matches))}")
    
    # Look for all companies with "Biologic" in the name for ADMA
    biologics_companies = [
        c for c in openfda_companies
        if "biologic" in c['company_name'].lower()
    ]
    print("\nAll companies with 'Biologic' in the name:")
    for c in sorted(biologics_companies, key=lambda x: x['product_count'], reverse=True)[:20]:
        print(f"  - {c['company_name']} (products: {c['product_count']})")
    if len(biologics_companies) > 20:
        print(f"  ... and {len(biologics_companies) - 20} more")

if __name__ == "__main__":
    main() 