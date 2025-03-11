"""
Update Main Companies Table

This script updates the main companies table with data from the SEC companies table.
It executes SQL inside the Docker container using a generated SQL script.
"""

import os
import subprocess

def generate_sql_script():
    """Generate a SQL script to update the main companies table"""
    sql = """
-- Create the main companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ticker_symbol VARCHAR(10),
    headquarters VARCHAR(255),
    description TEXT,
    website_url VARCHAR(255),
    logo_url VARCHAR(255),
    founded_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert/update data from sec_companies into the main companies table
INSERT INTO companies (name, ticker_symbol)
SELECT 
    name, 
    ticker 
FROM 
    sec_companies
ON CONFLICT (company_id) 
DO UPDATE SET
    name = EXCLUDED.name,
    ticker_symbol = EXCLUDED.ticker_symbol,
    updated_at = CURRENT_TIMESTAMP;

-- Count the number of companies in both tables
SELECT 'SEC Companies' AS table, COUNT(*) FROM sec_companies
UNION ALL
SELECT 'Main Companies' AS table, COUNT(*) FROM companies;

-- Show sample data from the main companies table
SELECT company_id, name, ticker_symbol FROM companies LIMIT 5;
"""
    
    # Write the script to a file
    with open("temp_update_companies.sql", "w") as f:
        f.write(sql)
    
    print("Generated SQL script to update main companies table")
    return "temp_update_companies.sql"

def run_in_docker():
    """Run the generated SQL script inside the Docker container"""
    script_path = generate_sql_script()
    
    # Copy the script to the container
    copy_cmd = f"docker cp {script_path} mytoppharma-postgres-1:/tmp/update_companies.sql"
    print(f"Copying script to container: {copy_cmd}")
    subprocess.run(copy_cmd, shell=True)
    
    # Run the script inside the container
    run_cmd = "docker exec mytoppharma-postgres-1 psql -U postgres -d toppharma -f /tmp/update_companies.sql"
    print(f"Running script inside container: {run_cmd}")
    subprocess.run(run_cmd, shell=True)
    
    # Clean up the temporary script
    os.remove(script_path)
    print("Cleaned up temporary script")

if __name__ == "__main__":
    run_in_docker() 