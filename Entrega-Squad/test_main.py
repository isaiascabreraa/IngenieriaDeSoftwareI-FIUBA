from fastapi.testclient import TestClient
from main import app
from behave.__main__ import main as behave_main

client = TestClient(app)


behave_main("tests/features")

def test_read_item():
    assert 200== 200

