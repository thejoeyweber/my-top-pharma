"""
Execute SQL queries inside the PostgreSQL Docker container

This script uses the Docker Python SDK to execute SQL queries inside the PostgreSQL container.
This is a workaround for direct connection issues from the host machine.
"""

import subprocess
import sys
import json
import re

def run_query(query):
    """
    Run a SQL query inside the PostgreSQL Docker container
    
    Args:
        query (str): SQL query to execute
        
    Returns:
        list or dict: Query results
    """
    print(f"Executing query: {query}")
    
    # Get column names from the query
    column_match = re.search(r"SELECT\s+(.*?)\s+FROM", query, re.IGNORECASE)
    columns = []
    if column_match:
        column_str = column_match.group(1)
        if column_str.strip() != "*":
            columns = [col.strip() for col in column_str.split(",")]
    
    # Construct the command to run inside the container
    docker_cmd = [
        "docker", "exec", "mytoppharma-postgres-1",
        "psql", "-U", "postgres", "-d", "toppharma",
        "-t", "-A", "-c", query
    ]
    
    try:
        # Run the command and capture the output
        result = subprocess.run(docker_cmd, capture_output=True, text=True, check=True)
        
        # Process the output
        output = result.stdout.strip()
        
        # For simple count queries
        if query.strip().lower().startswith("select count"):
            try:
                count = int(output)
                return {"count": count}
            except ValueError:
                pass
        
        # For more complex queries, parse the output
        lines = output.split("\n")
        results = []
        
        for line in lines:
            if not line.strip():
                continue
                
            values = line.split("|")
            
            if not columns:
                # If we couldn't extract column names, just return the values
                results.append(values)
            else:
                # Create a dictionary with column names as keys
                row = {}
                for i, col in enumerate(columns):
                    if i < len(values):
                        row[col] = values[i]
                results.append(row)
        
        return results
    except subprocess.CalledProcessError as e:
        print(f"Error executing query: {e}")
        print(f"Error output: {e.stderr}")
        return None

def get_companies():
    """Get all companies from the database"""
    return run_query("SELECT * FROM sec_companies;")

def get_company_by_ticker(ticker):
    """Get a company by its ticker symbol"""
    return run_query(f"SELECT * FROM sec_companies WHERE ticker = '{ticker}';")

def get_company_count():
    """Get the number of companies in the database"""
    result = run_query("SELECT COUNT(*) FROM sec_companies;")
    return result["count"] if isinstance(result, dict) and "count" in result else 0

if __name__ == "__main__":
    # Example usage
    query = "SELECT COUNT(*) FROM sec_companies;"
    if len(sys.argv) > 1:
        query = sys.argv[1]
        
    results = run_query(query)
    
    if results:
        print(f"Query results:")
        print(json.dumps(results, indent=2))
    else:
        print("Query returned no results or failed.") 