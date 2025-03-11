"""
Update Companies from SEC

This script updates the companies table with data from the sec_companies table.
"""

import os
import subprocess

def generate_sql_script():
    """Generate a SQL script to update the companies table"""
    sql = """
-- Create the companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ticker_symbol VARCHAR(10),
    description TEXT,
    headquarters VARCHAR(255),
    ownership_type VARCHAR(50),
    founded_date DATE,
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert companies from sec_companies table
INSERT INTO companies (name, ticker_symbol, description, headquarters)
SELECT 
    sc.name, 
    sc.ticker, 
    'Company in the ' || sc.sic_description || ' industry', 
    'Unknown'
FROM sec_companies sc
LEFT JOIN companies c ON c.ticker_symbol = sc.ticker
WHERE c.company_id IS NULL AND sc.ticker IS NOT NULL
RETURNING company_id, name, ticker_symbol;

-- Count the number of companies in the table
SELECT COUNT(*) FROM companies;

-- Show all companies in the table
SELECT * FROM companies;
"""
    
    # Write the script to a file
    with open("temp_update_script.sql", "w") as f:
        f.write(sql)
    
    print("Generated SQL script to update companies table")
    return "temp_update_script.sql"

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