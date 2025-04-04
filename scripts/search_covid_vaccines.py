#!/usr/bin/env python
"""
Search the OpenFDA API for COVID-19 vaccines and other biologics
to locate Moderna, BioNTech, and other companies missing from our data.
"""

import requests
import json
import urllib.parse
import re

# Base URL for OpenFDA API
BASE_URL = "https://api.fda.gov/drug/drugsfda.json"

def search_by_brand_name(brand_term):
    """Search for drugs by brand name"""
    encoded_term = urllib.parse.quote(brand_term)
    query = f"search=products.brand_name:{encoded_term}&limit=5"
    url = f"{BASE_URL}?{query}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('results', []), data.get('meta', {}).get('results', {}).get('total', 0)
        elif response.status_code == 404:
            return [], 0
        else:
            print(f"Error searching for brand {brand_term}: {response.status_code}")
            return [], 0
    except Exception as e:
        print(f"Exception when searching for brand {brand_term}: {e}")
        return [], 0

def search_by_application_type(app_type):
    """Search for drugs by application type (e.g., BLA for biologics)"""
    query = f"search=application_number:{app_type}*&limit=50"
    url = f"{BASE_URL}?{query}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('results', []), data.get('meta', {}).get('results', {}).get('total', 0)
        elif response.status_code == 404:
            return [], 0
        else:
            print(f"Error searching for application type {app_type}: {response.status_code}")
            return [], 0
    except Exception as e:
        print(f"Exception when searching for application type {app_type}: {e}")
        return [], 0

def search_by_substance(substance_term):
    """Search for drugs by active substance"""
    encoded_term = urllib.parse.quote(substance_term)
    query = f"search=openfda.substance_name:{encoded_term}&limit=5"
    url = f"{BASE_URL}?{query}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('results', []), data.get('meta', {}).get('results', {}).get('total', 0)
        elif response.status_code == 404:
            return [], 0
        else:
            print(f"Error searching for substance {substance_term}: {response.status_code}")
            return [], 0
    except Exception as e:
        print(f"Exception when searching for substance {substance_term}: {e}")
        return [], 0

def extract_product_info(results):
    """Extract key information from search results"""
    products_info = []
    
    for result in results:
        app_num = result.get('application_number', 'N/A')
        sponsor = result.get('sponsor_name', 'N/A')
        
        # Get openfda data if available
        openfda = result.get('openfda', {})
        manufacturer_names = openfda.get('manufacturer_name', ['N/A'])
        substance_names = openfda.get('substance_name', ['N/A'])
        
        # Get product details
        for product in result.get('products', []):
            brand_name = product.get('brand_name', 'N/A')
            active_ingredients = []
            for ingredient in product.get('active_ingredients', []):
                if isinstance(ingredient, dict):
                    name = ingredient.get('name', 'N/A')
                    strength = ingredient.get('strength', 'N/A')
                    active_ingredients.append(f"{name} {strength}")
            
            dosage_form = product.get('dosage_form', 'N/A')
            route = product.get('route', 'N/A')
            
            products_info.append({
                'application_number': app_num,
                'sponsor': sponsor,
                'brand_name': brand_name,
                'manufacturers': manufacturer_names,
                'active_ingredients': active_ingredients,
                'substances': substance_names,
                'dosage_form': dosage_form,
                'route': route
            })
    
    return products_info

def search_covid_vaccines():
    """Search for COVID-19 vaccines"""
    print("\n=== SEARCHING FOR COVID-19 VACCINES ===\n")
    
    # Search terms related to COVID vaccines
    vaccine_terms = [
        "COVID", "SARS-CoV-2", "Coronavirus", "mRNA",
        "Moderna", "Spikevax", "Comirnaty", "BioNTech"
    ]
    
    all_products = []
    
    # Search by brand name
    for term in vaccine_terms:
        results, total = search_by_brand_name(term)
        if total > 0:
            print(f"Found {total} results for brand name '{term}'")
            products = extract_product_info(results)
            all_products.extend(products)
        else:
            print(f"No results found for brand name '{term}'")
    
    # Search by substance name
    for term in vaccine_terms:
        results, total = search_by_substance(term)
        if total > 0:
            print(f"Found {total} results for substance '{term}'")
            products = extract_product_info(results)
            all_products.extend(products)
        else:
            print(f"No results found for substance '{term}'")
    
    return all_products

def search_biologics():
    """Search for biologics license applications"""
    print("\n=== SEARCHING FOR BIOLOGICS (BLA) ===\n")
    
    # BLA = Biologics License Application
    results, total = search_by_application_type("BLA")
    
    if total > 0:
        print(f"Found {total} BLA applications")
        products = extract_product_info(results)
        
        # Print summary of biologics manufacturers
        manufacturers = {}
        for product in products:
            for manufacturer in product['manufacturers']:
                if manufacturer not in manufacturers:
                    manufacturers[manufacturer] = []
                manufacturers[manufacturer].append(product['brand_name'])
        
        print("\nBiologics manufacturers:")
        for manufacturer, brands in sorted(manufacturers.items()):
            unique_brands = sorted(set(brands))
            print(f"  - {manufacturer}: {len(unique_brands)} products")
        
        return products
    else:
        print("No BLA applications found")
        return []

def main():
    print("Searching OpenFDA API for COVID-19 vaccines and biologics...")
    
    # Search for COVID-19 vaccines
    covid_products = search_covid_vaccines()
    
    # Search for biologics
    biologics_products = search_biologics()
    
    # Combine results and analyze
    all_products = covid_products + biologics_products
    
    if all_products:
        print("\n=== DETAILED PRODUCTS INFO ===\n")
        for product in all_products:
            print(f"Brand: {product['brand_name']}")
            print(f"  Application: {product['application_number']}")
            print(f"  Sponsor: {product['sponsor']}")
            print(f"  Manufacturers: {', '.join(product['manufacturers'])}")
            print(f"  Active Ingredients: {', '.join(product['active_ingredients'])}")
            print(f"  Substances: {', '.join(product['substances'])}")
            print(f"  Dosage Form: {product['dosage_form']}")
            print(f"  Route: {product['route']}")
            print()
    else:
        print("\nNo products found matching search criteria.")

if __name__ == "__main__":
    main() 