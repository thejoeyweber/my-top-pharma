import os
import sys
import json

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db_client import execute_query

def query_companies():
    """Query the companies table and display the results"""
    print("Querying companies table...")
    
    companies = execute_query("SELECT * FROM companies")
    
    if not companies:
        print("No companies found in the database!")
        return
    
    print("\nCompanies in the database:")
    print("-" * 80)
    for company in companies:
        print(f"ID: {company['company_id']}")
        print(f"Name: {company['name']}")
        print(f"Ticker: {company['ticker_symbol']}")
        print(f"HQ: {company['headquarters']}")
        print(f"Description: {company['description']}")
        print("-" * 80)
    
    # Also output as JSON for easier reading
    print("\nCompanies as JSON:")
    print(json.dumps(companies, indent=2, default=str))

if __name__ == "__main__":
    query_companies() 