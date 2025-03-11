"""
Start Prefect Agent

This script starts a Prefect agent to process deployments from the specified work queue.
The agent listens for scheduled or manually triggered flow runs and executes them.
"""

import os
import sys
import subprocess
import time
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_prefect_version():
    """Check the installed Prefect version"""
    try:
        import prefect
        logger.info(f"Prefect version: {prefect.__version__}")
        return True
    except ImportError:
        logger.error("Prefect not installed. Please install with: pip install prefect")
        return False
    except Exception as e:
        logger.error(f"Error checking Prefect version: {e}")
        return False

def start_agent(queue_name="default"):
    """Start a Prefect agent to process deployments from the specified queue"""
    logger.info(f"Starting Prefect agent for queue '{queue_name}'")
    
    # Command to start the agent (using the same Python process)
    cmd = ["prefect", "agent", "start", "-q", queue_name]
    
    try:
        # Print the command for reference
        logger.info(f"Running command: {' '.join(cmd)}")
        
        # Run the agent, forwarding output to console
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Stream the output
        logger.info("Agent started. Streaming output:")
        for line in process.stdout:
            print(line, end='')
        
        # Wait for the process to complete
        return_code = process.wait()
        if return_code != 0:
            logger.error(f"Agent process exited with code {return_code}")
            return False
            
        return True
        
    except KeyboardInterrupt:
        logger.info("Received interrupt signal, shutting down agent...")
        process.terminate()
        try:
            process.wait(timeout=5)
            logger.info("Agent gracefully terminated")
        except subprocess.TimeoutExpired:
            logger.warning("Agent failed to terminate gracefully, forcing...")
            process.kill()
        return True
        
    except Exception as e:
        logger.error(f"Error starting agent: {e}")
        return False

if __name__ == "__main__":
    logger.info("Starting Prefect agent")
    
    # Check Prefect version first
    if not check_prefect_version():
        logger.error("Prefect version check failed. Please ensure Prefect is installed correctly.")
        sys.exit(1)
    
    # Verify Prefect server is running
    try:
        logger.info("Checking if Prefect API is available...")
        import requests
        response = requests.get("http://localhost:4200/api/health")
        if response.status_code == 200:
            logger.info("✓ Prefect API is available")
        else:
            logger.warning(f"! Prefect API returned status code {response.status_code}")
    except Exception as e:
        logger.warning(f"! Could not connect to Prefect API: {e}")
        logger.warning("Make sure the Prefect server container is running: docker ps | grep prefect")
    
    # Determine which queue to use (default or specified on command line)
    queue = "default"
    if len(sys.argv) > 1:
        queue = sys.argv[1]
    
    # Keep trying to restart the agent if it fails
    while True:
        success = start_agent(queue)
        if not success:
            logger.error("Agent failed to start or crashed. Restarting in 10 seconds...")
            time.sleep(10)
        else:
            break 