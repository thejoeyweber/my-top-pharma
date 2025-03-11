"""
Docker Run Company Universe

This script generates a SQL script to run inside the Docker container.
"""

import os
import subprocess

def generate_sql_script():
    """Generate a SQL script to run inside the Docker container"""
    sql = """
-- Create the sec_companies table if it doesn't exist
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

-- Insert sample pharmaceutical companies
INSERT INTO sec_companies (cik, name, sic, sic_description, ticker, exchange)
VALUES 
    ('78003', 'PFIZER INC', '2834', 'Pharmaceutical Preparations', 'PFE', NULL),
    ('200406', 'JOHNSON & JOHNSON', '2834', 'Pharmaceutical Preparations', 'JNJ', NULL),
    ('310158', 'MERCK & CO INC', '2834', 'Pharmaceutical Preparations', 'MRK', NULL),
    ('1682852', 'MODERNA INC', '2836', 'Biological Products (No Diagnostic Substances)', 'MRNA', NULL),
    ('318154', 'AMGEN INC', '2836', 'Biological Products (No Diagnostic Substances)', 'AMGN', NULL)
ON CONFLICT (cik) 
DO UPDATE SET
    name = EXCLUDED.name,
    sic = EXCLUDED.sic,
    sic_description = EXCLUDED.sic_description,
    ticker = EXCLUDED.ticker,
    exchange = EXCLUDED.exchange,
    updated_at = CURRENT_TIMESTAMP;

-- Count the number of companies in the table
SELECT COUNT(*) FROM sec_companies;

-- Show all companies in the table
SELECT * FROM sec_companies;
"""
    
    # Write the script to a file
    with open("temp_script.sql", "w") as f:
        f.write(sql)
    
    print("Generated SQL script to run inside Docker container")
    return "temp_script.sql"

def run_in_docker():
    """Run the generated SQL script inside the Docker container"""
    script_path = generate_sql_script()
    
    # Copy the script to the container
    copy_cmd = f"docker cp {script_path} mytoppharma-postgres-1:/tmp/run_company_universe.sql"
    print(f"Copying script to container: {copy_cmd}")
    subprocess.run(copy_cmd, shell=True)
    
    # Run the script inside the container
    run_cmd = "docker exec mytoppharma-postgres-1 psql -U postgres -d toppharma -f /tmp/run_company_universe.sql"
    print(f"Running script inside container: {run_cmd}")
    subprocess.run(run_cmd, shell=True)
    
    # Clean up the temporary script
    os.remove(script_path)
    print("Cleaned up temporary script")

if __name__ == "__main__":
    run_in_docker() 