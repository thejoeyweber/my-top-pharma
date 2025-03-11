"""
Register Prefect Flows

This script registers Prefect flows with the Prefect server.
"""

import os
import sys
import subprocess
import logging
import time

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_prefect_server():
    """
    Check if the Prefect server is running
    
    Returns:
        bool: True if Prefect server is running
    """
    try:
        # Try to access the Prefect API
        result = subprocess.run(
            ["prefect", "config", "view"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        
        if "PREFECT_API_URL" in result.stdout:
            logger.info("Prefect server is running")
            return True
        else:
            logger.warning("Prefect server is not properly configured")
            return False
    except subprocess.CalledProcessError:
        logger.error("Failed to check Prefect server status")
        return False

def register_company_universe_flow():
    """
    Register the SEC EDGAR company universe flow
    
    Returns:
        bool: True if registration succeeded
    """
    logger.info("Registering SEC EDGAR company universe flow")
    
    try:
        # Build the deployment
        result = subprocess.run(
            [
                "prefect", "deployment", "build",
                "flows/sec_edgar/company_universe_flow.py:company_universe_flow",
                "-n", "Company Universe",
                "-q", "default",
                "--skip-upload"
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        
        logger.info("Built deployment successfully")
        
        # Apply the deployment
        apply_result = subprocess.run(
            ["prefect", "deployment", "apply", "company_universe_flow-deployment.yaml"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        
        logger.info(f"Applied deployment successfully: {apply_result.stdout}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to register flow: {e}")
        logger.error(f"Stdout: {e.stdout}")
        logger.error(f"Stderr: {e.stderr}")
        return False

def register_all_flows():
    """
    Register all Prefect flows
    
    Returns:
        bool: True if all registrations succeeded
    """
    if not check_prefect_server():
        logger.error("Prefect server is not running, cannot register flows")
        return False
    
    # Register company universe flow
    if not register_company_universe_flow():
        logger.error("Failed to register company universe flow")
        return False
    
    logger.info("Successfully registered all flows")
    return True

def start_agent():
    """
    Start a Prefect agent to process work queues
    
    Returns:
        subprocess.Popen: Process object for the agent
    """
    logger.info("Starting Prefect agent")
    
    try:
        # Start agent in a new process
        agent_process = subprocess.Popen(
            ["prefect", "agent", "start", "-q", "default"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a bit to allow agent to connect
        time.sleep(2)
        
        # Check if agent is still running
        if agent_process.poll() is None:
            logger.info("Prefect agent started successfully")
            return agent_process
        else:
            stdout, stderr = agent_process.communicate()
            logger.error(f"Agent failed to start: {stderr}")
            return None
    except Exception as e:
        logger.error(f"Failed to start agent: {e}")
        return None

if __name__ == "__main__":
    # Register all flows
    if register_all_flows():
        logger.info("Flow registration complete")
        
        # Ask if user wants to start agent
        start_agent_input = input("Do you want to start a Prefect agent? (y/n): ")
        if start_agent_input.lower() in ['y', 'yes']:
            agent = start_agent()
            if agent:
                logger.info("Agent is running. Press Ctrl+C to stop.")
                try:
                    agent.wait()
                except KeyboardInterrupt:
                    agent.terminate()
                    logger.info("Agent stopped")
        else:
            logger.info("No agent started. Run 'prefect agent start -q default' to start an agent.")
    else:
        logger.error("Flow registration failed") 