from prefect import flow, task

@task
def say_hello():
    print("Hello from Prefect!")
    return "Hello world!"

@flow(name="Test Flow")
def test_flow():
    result = say_hello()
    print(f"Task result: {result}")
    return result

if __name__ == "__main__":
    test_flow() 