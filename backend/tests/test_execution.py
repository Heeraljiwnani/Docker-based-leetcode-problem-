import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_1_successful_execution():
    """Test 1: Successful Python code execution"""
    payload = {
        "language": "python",
        "code": 'print("Hello World")'
    }
    response = client.post("/execute/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "Hello World" in data["stdout"]
    assert data["exit_code"] == 0
    assert data["stderr"] == ""

def test_2_runtime_error():
    """Test 2: Runtime error handling (Division by zero)"""
    payload = {
        "language": "python",
        "code": 'print(10 / 0)'
    }
    response = client.post("/execute/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "runtime_error"
    assert data["exit_code"] != 0
    assert "ZeroDivisionError" in data["stderr"]

def test_3_infinite_loop_timeout():
    """Test 3: Infinite loop timeout protection"""
    payload = {
        "language": "python",
        "code": 'while True:\n    pass',
        "timeout": 2.0
    }
    response = client.post("/execute/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "timeout"
    assert "timed out" in data["stderr"].lower() or "timeout" in data["status"].lower()
    assert data["exit_code"] == 124

def test_4_multiline_execution():
    """Test 4: Multiple lines execution"""
    payload = {
        "language": "python",
        "code": 'for i in range(3):\n    print(i)'
    }
    response = client.post("/execute/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["exit_code"] == 0
    lines = [line.strip() for line in data["stdout"].strip().split("\n") if line.strip()]
    assert lines == ["0", "1", "2"]

def test_unsupported_language():
    """Test 5: Unsupported language handling"""
    payload = {
        "language": "unsupported_lang",
        "code": 'print("Hello")'
    }
    response = client.post("/execute/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "execution_error"
    assert "Unsupported language" in data["stderr"] or "Unsupported language" in (data.get("error_message") or "")
