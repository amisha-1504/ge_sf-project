import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "project" in data

def test_get_categories():
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_admin_login_and_create_product():
    # Login
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@gesf.com", "password": "admin123"}
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch Categories to get a subcategory ID
    cat_res = client.get("/api/v1/categories")
    categories = cat_res.json()
    assert len(categories) > 0
    sub_id = categories[0]["subcategories"][0]["id"]

    test_slug = f"test-suite-cooler-{uuid.uuid4().hex[:6]}"
    # Create Product
    prod_data = {
        "subcategory_id": sub_id,
        "title": "Test Suite Cooler",
        "slug": test_slug,
        "description": "High performance test cooler for automated verification",
        "price": 8500.0,
        "dimensions": "48x24x24 inches",
        "material": "Galvanized Steel",
        "in_stock": True,
        "is_featured": True
    }
    create_res = client.post("/api/v1/products", json=prod_data, headers=headers)
    assert create_res.status_code == 201
    created_prod = create_res.json()
    assert created_prod["title"] == "Test Suite Cooler"
    assert created_prod["slug"] == test_slug

    # Verify Product via Public API
    get_res = client.get(f"/api/v1/products/{test_slug}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == created_prod["id"]

    # Clean up test product
    client.delete(f"/api/v1/products/{created_prod['id']}", headers=headers)

def test_submit_service_request():
    req_data = {
        "customer_name": "Ramesh Kumar",
        "phone_number": "9876543210",
        "address": "123 Main Street, Sector 4",
        "service_type": "almirah_lock",
        "issue_description": "Godrej Almirah lock jammed, key not turning"
    }
    res = client.post("/api/v1/services/request", json=req_data)
    assert res.status_code == 201
    assert res.json()["customer_name"] == "Ramesh Kumar"
    assert res.json()["status"] == "pending"

def test_submit_exchange_request():
    req_data = {
        "customer_name": "Suresh Patel",
        "phone_number": "9123456789",
        "item_type": "Plastic Chairs",
        "quantity": 4,
        "condition_details": "Slightly faded blue plastic chairs, no structural cracks"
    }
    res = client.post("/api/v1/exchanges/request", json=req_data)
    assert res.status_code == 201
    assert res.json()["quantity"] == 4
    assert res.json()["status"] == "submitted"
