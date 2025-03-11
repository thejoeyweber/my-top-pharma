"""
Database Utilities for Top Pharma

This module provides utility functions for interacting with the PostgreSQL database.
"""

import os
import sys
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

# Add parent directory to path to allow imports from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import prefect_config

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@contextmanager
def get_db_connection():
    """
    Context manager for database connections.
    Ensures connections are properly closed after use.
    
    Yields:
        psycopg2.connection: A PostgreSQL database connection
    """
    conn = None
    try:
        # Connect to the PostgreSQL database
        logger.info(f"Connecting to database at {prefect_config.DB_HOST}:{prefect_config.DB_PORT}")
        conn = psycopg2.connect(
            host=prefect_config.DB_HOST,
            port=prefect_config.DB_PORT,
            dbname=prefect_config.DB_NAME,
            user=prefect_config.DB_USER,
            password=prefect_config.DB_PASSWORD
        )
        yield conn
    except psycopg2.OperationalError as e:
        logger.error(f"Database connection error: {e}")
        logger.error("\nTroubleshooting PostgreSQL connection issues:")
        logger.error("1. Check if PostgreSQL container is running:")
        logger.error("   docker ps | findstr postgres")
        logger.error(f"2. Ensure host ({prefect_config.DB_HOST}) is correct:")
        logger.error("   - When running from host machine: use 'localhost'")
        logger.error("   - When running inside Docker: use 'postgres'")
        logger.error(f"3. Verify port ({prefect_config.DB_PORT}) is correctly mapped in docker-compose.yml")
        logger.error(f"4. Check credentials (user:{prefect_config.DB_USER}, db:{prefect_config.DB_NAME})")
        logger.error("5. Try connecting manually with:")
        logger.error(f"   docker exec -it mytoppharma-postgres-1 psql -U {prefect_config.DB_USER} -d {prefect_config.DB_NAME}")
        raise
    except psycopg2.Error as e:
        logger.error(f"Database connection error: {e}")
        raise
    finally:
        if conn is not None:
            conn.close()
            logger.debug("Database connection closed")

@contextmanager
def get_db_cursor(commit=False):
    """
    Context manager for database cursors.
    
    Args:
        commit (bool): Whether to commit the transaction after operations
    
    Yields:
        psycopg2.cursor: A cursor for executing queries
    """
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        try:
            yield cursor
            if commit:
                conn.commit()
        except Exception as e:
            conn.rollback()
            logger.error(f"Database operation error: {e}")
            raise
        finally:
            cursor.close()

def execute_query(query, params=None, commit=True, fetch=True):
    """
    Execute a SQL query and optionally fetch results.
    
    Args:
        query (str): The SQL query to execute
        params (tuple, optional): Parameters for the query
        commit (bool): Whether to commit the transaction
        fetch (bool): Whether to fetch and return results
    
    Returns:
        list or None: Query results if fetch=True, None otherwise
    """
    try:
        with get_db_cursor(commit=commit) as cursor:
            cursor.execute(query, params or ())
            
            if fetch:
                results = cursor.fetchall()
                logger.debug(f"Query returned {len(results)} results")
                return results
            return None
    except Exception as e:
        logger.error(f"Query execution failed: {e}")
        logger.error(f"Query: {query}")
        if params:
            logger.error(f"Parameters: {params}")
        raise

def execute_queries(queries, params_list=None, commit=True):
    """
    Execute multiple SQL queries in a single transaction.
    
    Args:
        queries (list): List of SQL queries
        params_list (list, optional): List of parameter tuples for each query
        commit (bool): Whether to commit the transaction
    
    Returns:
        bool: True if all queries succeeded
    """
    if params_list is None:
        params_list = [None] * len(queries)
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            for i, query in enumerate(queries):
                cursor.execute(query, params_list[i] or ())
            
            if commit:
                conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            logger.error(f"Database transaction error: {e}")
            raise
        finally:
            cursor.close()

def check_table_exists(table_name):
    """
    Check if a table exists in the database.
    
    Args:
        table_name (str): Name of the table to check
    
    Returns:
        bool: True if the table exists, False otherwise
    """
    query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = %s
        );
    """
    with get_db_cursor() as cursor:
        cursor.execute(query, (table_name,))
        result = cursor.fetchone()
        return result['exists'] if result else False 