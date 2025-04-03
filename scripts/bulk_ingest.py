#!/usr/bin/env python3
import argparse
import yaml
import requests
import os
import logging
from supabase import create_client, Client
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables from .env file relative to the app directory
# Assuming the script is run from the 'app' directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local')) # Load from .env.local
# If running from root, might need: load_dotenv(dotenv_path=os.path.join('app', '.env.local'))

def load_config(path: str = "scripts/feeds.yml"):
    """Loads feed configuration from a YAML file relative to the app directory."""
    # Adjust path relative to the script's location in app/scripts
    config_path = os.path.join(os.path.dirname(__file__), path)
    try:
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
            logging.info(f"Loaded configuration from {config_path}")
            if "feeds" not in config or not isinstance(config["feeds"], list):
                logging.error(f"Invalid configuration format in {config_path}. Expected a 'feeds' list.")
                return None
            return config
    except FileNotFoundError:
        logging.error(f"Configuration file not found at {config_path}")
        return None
    except yaml.YAMLError as e:
        logging.error(f"Error parsing YAML file {config_path}: {e}")
        return None

def download_file(url: str, local_path: str):
    """Downloads a file from a URL to a local path."""
    logging.info(f"Attempting to download from {url}...")
    try:
        with requests.get(url, stream=True, timeout=60) as r: # Added timeout
            r.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
            with open(local_path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        logging.info(f"Successfully downloaded file to {local_path}")
        return True
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to download file from {url}: {e}")
        return False
    except IOError as e:
        logging.error(f"Failed to write file to {local_path}: {e}")
        return False

def upload_to_supabase(supabase: Client, bucket: str, storage_path: str, local_path: str, content_type: str = "application/zip"):
    """Uploads a local file to Supabase Storage."""
    logging.info(f"Attempting to upload {local_path} to Supabase Storage bucket '{bucket}' at path '{storage_path}'...")
    try:
        with open(local_path, "rb") as f:
            # Ensure content-type is passed correctly in file_options
            res = supabase.storage.from_(bucket).upload(
                path=storage_path,
                file=f,
                file_options={"content-type": content_type, "upsert": "true"} # Use upsert=true to overwrite
            )
        # Check Supabase response for success (adjust based on actual client behavior)
        logging.info(f"Successfully uploaded file to Supabase Storage: {bucket}/{storage_path}")
        return True
    except Exception as e: # Catch potential Supabase client errors
        logging.error(f"Failed to upload file to Supabase Storage: {e}")
        return False
    finally:
        # Clean up the local temporary file
        if os.path.exists(local_path):
            try:
                os.remove(local_path)
                logging.info(f"Removed temporary local file: {local_path}")
            except OSError as e:
                logging.error(f"Error removing temporary file {local_path}: {e}")


def main(feed_name: str | None = None):
    config = load_config()
    if not config:
        return

    # Use the correct environment variable names from .env.local
    supabase_url = os.getenv("PUBLIC_LOCAL_SUPABASE_URL")
    supabase_key = os.getenv("PUBLIC_LOCAL_SUPABASE_SERVICE_ROLE_KEY") # Use service role key for backend operations

    if not supabase_url or not supabase_key:
        logging.error("Missing PUBLIC_LOCAL_SUPABASE_URL or PUBLIC_LOCAL_SUPABASE_SERVICE_ROLE_KEY environment variables (ensure .env.local is in the 'app' directory).")
        return

    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        logging.info("Supabase client created successfully.")
    except Exception as e:
        logging.error(f"Failed to create Supabase client: {e}")
        return

    all_feeds = config["feeds"]
    feeds_to_process = []

    if feed_name:
        feed = next((f for f in all_feeds if f.get("name") == feed_name), None)
        if feed:
            feeds_to_process.append(feed)
        else:
            logging.error(f"Feed '{feed_name}' not found in configuration.")
            return
    else:
        feeds_to_process = all_feeds

    for feed in feeds_to_process:
        feed_id = feed.get("name", "Unnamed Feed")
        logging.info(f"--- Processing feed: {feed_id} ---")
        url = feed.get("url")
        bucket = feed.get("storage_bucket")
        storage_path = feed.get("storage_path")

        if not all([url, bucket, storage_path]):
            logging.warning(f"Skipping feed '{feed_id}' due to missing configuration (url, storage_bucket, or storage_path).")
            continue

        # Define a temporary local path for download relative to the app directory
        # Assuming script is run from within the 'app' directory
        local_temp_dir = os.path.join(os.path.dirname(__file__), '..', "temp_downloads")
        os.makedirs(local_temp_dir, exist_ok=True) # Ensure temp dir exists
        local_filename = os.path.basename(storage_path) # Get filename from storage path
        local_file_path = os.path.join(local_temp_dir, local_filename)

        if download_file(url, local_file_path):
            upload_to_supabase(supabase, bucket, storage_path, local_file_path)
        else:
            logging.error(f"Skipping upload for feed '{feed_id}' due to download failure.")
        logging.info(f"--- Finished processing feed: {feed_id} ---")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download bulk data files and upload them to Supabase Storage.")
    parser.add_argument("--feed-name", help="Name of the specific feed to ingest (from feeds.yml)", default=None)
    args = parser.parse_args()

    # Determine the execution context (running from root or app/scripts)
    # This affects relative paths for .env and temp_downloads
    # For simplicity, assuming the script is run from the 'app' directory context:
    # cd app
    # python scripts/bulk_ingest.py
    main(args.feed_name) 