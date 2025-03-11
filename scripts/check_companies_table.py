"""
Check Companies Table

This script checks the companies table in the database.
"""

import subprocess

def execute_query(query):
    """Execute a SQL query in the PostgreSQL Docker container"""
    command = f"docker exec mytoppharma-postgres-1 psql -U postgres -d toppharma -c \"{query}\""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout

def main():
    """Check the companies table"""
    print("Checking companies table...")
    
    # Check available tables
    print("Executing query: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    tables = execute_query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    print(tables)
    
    # Count companies
    print("Executing query: SELECT COUNT(*) FROM companies;")
    count = execute_query("SELECT COUNT(*) FROM companies;")
    print(f"Companies table has {count.strip().split()[-1]} rows")
    
    # Get sample companies
    print("Executing query: SELECT company_id, name, ticker_symbol FROM companies LIMIT 5;")
    companies = execute_query("SELECT company_id, name, ticker_symbol FROM companies LIMIT 5;")
    
    # Print sample companies
    print("\nSample companies:")
    for line in companies.strip().split('\n')[2:-1]:  # Skip header and footer
        parts = [part.strip() for part in line.split('|')]
        if len(parts) >= 3:
            name = parts[1]
            ticker = parts[2] if parts[2] else "N/A"
            print(f"  - {name} ({ticker})")

if __name__ == "__main__":
    main() 