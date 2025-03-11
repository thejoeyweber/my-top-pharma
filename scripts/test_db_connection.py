"""
Simple script to test PostgreSQL connection directly
"""

import psycopg2
import sys

def test_connection():
    print("Testing direct connection to PostgreSQL...")
    
    # Try different connection parameters
    connection_params = [
        {
            "host": "localhost",
            "port": 5432,
            "dbname": "toppharma",
            "user": "postgres",
            "password": "postgres"
        },
        {
            "host": "localhost",
            "port": 5432,
            "dbname": "toppharma",
            "user": "test_user",
            "password": "test_password"
        },
        {
            "host": "localhost",
            "port": 5432,
            "dbname": "toppharma",
            "user": "postgres",
            "password": "password"
        },
        {
            "host": "localhost",
            "port": 5432,
            "dbname": "toppharma",
            "user": "postgres",
            "password": ""
        },
        {
            "host": "127.0.0.1",
            "port": 5432,
            "dbname": "toppharma",
            "user": "postgres",
            "password": "postgres"
        },
        {
            "host": "127.0.0.1",
            "port": 5432,
            "dbname": "toppharma",
            "user": "test_user",
            "password": "test_password"
        },
        {
            "host": "127.0.0.1",
            "port": 5432,
            "dbname": "toppharma",
            "user": "postgres",
            "password": "password"
        },
        {
            "host": "127.0.0.1",
            "port": 5432,
            "dbname": "toppharma",
            "user": "postgres",
            "password": ""
        }
    ]
    
    for params in connection_params:
        try:
            print(f"Trying connection with: {params}")
            conn = psycopg2.connect(**params)
            
            cursor = conn.cursor()
            cursor.execute("SELECT 1 as test")
            result = cursor.fetchone()
            print(f"Connection successful! Test query result: {result}")
            cursor.close()
            conn.close()
            print("Found working connection parameters!")
            return True
        except Exception as e:
            print(f"Connection error: {e}")
            print("Trying next set of parameters...\n")
    
    print("Failed to connect with any of the parameters.")
    return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1) 