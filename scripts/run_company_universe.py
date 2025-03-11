"""
Run Company Universe Flow

This script runs the company universe flow with hardcoded database connection parameters.
"""

import os
import sys
import psycopg2
import json
from datetime import datetime

# Add the parent directory to the path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_companies_by_sic(sic_code):
    """
    Get a list of companies with the specified SIC code from SEC EDGAR.
    This is a simplified version that returns sample data.
    """
    print(f"Fetching companies with SIC code {sic_code}")
    
    # Return sample data for testing
    if sic_code == '2834':  # Pharmaceutical Preparations
        return [
            {
                "name": "PFIZER INC",
                "cik": "78003",
                "ticker": "PFE",
                "sic": "2834",
                "sic_description": "Pharmaceutical Preparations",
                "exchange": None
            },
            {
                "name": "JOHNSON & JOHNSON",
                "cik": "200406",
                "ticker": "JNJ",
                "sic": "2834",
                "sic_description": "Pharmaceutical Preparations",
                "exchange": None
            },
            {
                "name": "MERCK & CO INC",
                "cik": "310158",
                "ticker": "MRK",
                "sic": "2834",
                "sic_description": "Pharmaceutical Preparations",
                "exchange": None
            }
        ]
    elif sic_code == '2836':  # Biological Products
        return [
            {
                "name": "MODERNA INC",
                "cik": "1682852",
                "ticker": "MRNA",
                "sic": "2836",
                "sic_description": "Biological Products (No Diagnostic Substances)",
                "exchange": None
            },
            {
                "name": "AMGEN INC",
                "cik": "318154",
                "ticker": "AMGN",
                "sic": "2836",
                "sic_description": "Biological Products (No Diagnostic Substances)",
                "exchange": None
            }
        ]
    else:
        return []

def run_company_universe_flow():
    """Run the company universe flow with hardcoded database connection parameters"""
    print("Running company universe flow...")
    
    # Target SIC codes for pharmaceutical and biotech companies
    target_sic_codes = ['2834', '2836', '2833', '2835', '8731']
    
    # Fetch companies for each SIC code
    all_companies = []
    for sic_code in target_sic_codes:
        companies = get_companies_by_sic(sic_code)
        all_companies.extend(companies)
        print(f"Found {len(companies)} companies with SIC code {sic_code}")
    
    # Remove duplicates based on CIK
    unique_companies = {}
    for company in all_companies:
        if "cik" in company:
            unique_companies[company["cik"]] = company
    
    all_companies_list = list(unique_companies.values())
    print(f"Found {len(all_companies_list)} unique companies across all SIC codes")
    
    # Connect to the database
    try:
        print("Connecting to database...")
        conn = psycopg2.connect(
            dbname='toppharma',
            user='postgres',
            password='password',
            host='localhost',
            port=5432
        )
        print("Connected to database successfully")
        
        # Create the sec_companies table if it doesn't exist
        with conn.cursor() as cur:
            print("Creating sec_companies table if it doesn't exist...")
            cur.execute("""
                CREATE TABLE IF NOT EXISTS sec_companies (
                    id SERIAL PRIMARY KEY,
                    cik VARCHAR(10) UNIQUE NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    sic VARCHAR(4),
                    sic_description TEXT,
                    ticker VARCHAR(10),
                    exchange VARCHAR(20),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            print("Table created or already exists")
        
        # Insert companies into the database
        with conn.cursor() as cur:
            print("Inserting companies into the database...")
            for company in all_companies_list:
                try:
                    cur.execute("""
                        INSERT INTO sec_companies (cik, name, sic, sic_description, ticker, exchange)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (cik) 
                        DO UPDATE SET
                            name = EXCLUDED.name,
                            sic = EXCLUDED.sic,
                            sic_description = EXCLUDED.sic_description,
                            ticker = EXCLUDED.ticker,
                            exchange = EXCLUDED.exchange,
                            updated_at = CURRENT_TIMESTAMP
                    """, (
                        company["cik"],
                        company["name"],
                        company["sic"],
                        company["sic_description"],
                        company["ticker"],
                        company["exchange"]
                    ))
                except Exception as e:
                    print(f"Error inserting company {company['name']}: {e}")
            
            conn.commit()
            print("Companies inserted successfully")
        
        # Count the number of companies in the database
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM sec_companies")
            count = cur.fetchone()[0]
            print(f"There are now {count} companies in the sec_companies table")
        
        conn.close()
        print("Database connection closed")
        
        print("Company universe flow completed successfully!")
        return True
    except Exception as e:
        print(f"Error running company universe flow: {e}")
        return False

if __name__ == "__main__":
    run_company_universe_flow() 