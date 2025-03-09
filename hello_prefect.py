#!/usr/bin/env python
# hello_prefect.py - A simple test flow to verify Prefect is working

from prefect import flow, task
import datetime

@task
def get_current_date():
    """Get the current date and time."""
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@task
def print_hello(name: str, date: str):
    """Print a hello message with the name and current date."""
    message = f"Hello {name}! The current date and time is: {date}"
    print(message)
    return message

@flow(name="hello-flow")
def hello_flow(name: str = "Pharma"):
    """A simple flow that prints a hello message with the current date and time."""
    date = get_current_date()
    result = print_hello(name, date)
    return result

if __name__ == "__main__":
    hello_flow() 