"""
Prefect configuration module. This file defines common settings
for Prefect flows and tasks.
"""

import os

# API URL
PREFECT_API_URL = os.environ.get("PREFECT_API_URL", "http://localhost:4200/api")

# Default tags for flows
DEFAULT_TAGS = ["toppharma", "data-pipeline"]

# Default retry configuration
DEFAULT_RETRIES = 3
DEFAULT_RETRY_DELAY_SECONDS = 60

# Default timeout
DEFAULT_TIMEOUT_SECONDS = 3600  # 1 hour

# Default concurrency limits
DEFAULT_CONCURRENCY_LIMIT = 5 