"""
Prefect Configuration for Top Pharma

This module contains configuration settings for Prefect workflows.
It centralizes configuration options and allows for easy updates.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Prefect API settings
PREFECT_API_URL = os.getenv("PREFECT_API_URL", "http://127.0.0.1:4200/api")
PREFECT_API_KEY = os.getenv("PREFECT_API_KEY", "")

# Concurrency settings
MAX_CONCURRENT_TASKS = int(os.getenv("MAX_CONCURRENT_TASKS", "10"))
MAX_CONCURRENT_FLOWS = int(os.getenv("MAX_CONCURRENT_FLOWS", "5"))

# Storage settings
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "top-pharma-data-lake")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", "")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", "")
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL", "")  # Leave empty for AWS S3

# Database settings
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "toppharma")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

# Flow-specific settings
DEFAULT_DATA_RETENTION_DAYS = int(os.getenv("DEFAULT_DATA_RETENTION_DAYS", "90"))
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Notification settings (for alerting on flow failures)
NOTIFICATION_EMAIL = os.getenv("NOTIFICATION_EMAIL", "")
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "")

# External API rate limits (requests per minute)
SEC_EDGAR_RATE_LIMIT = int(os.getenv("SEC_EDGAR_RATE_LIMIT", "10"))
OPENCORPORATES_RATE_LIMIT = int(os.getenv("OPENCORPORATES_RATE_LIMIT", "60"))
FDA_RATE_LIMIT = int(os.getenv("FDA_RATE_LIMIT", "240"))
CLINICALTRIALS_RATE_LIMIT = int(os.getenv("CLINICALTRIALS_RATE_LIMIT", "60"))

# Function to get database connection string
def get_db_connection_string():
    """Return the PostgreSQL connection string from environment variables"""
    return f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}" 