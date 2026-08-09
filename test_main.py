import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import Base, get_db

TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    )
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def overrride_get_db():
    db = TestingSessionLocal()
    try:
        yield db

    finally:
        db.close()

app.dependency_overrides[get_db] = overrride_get_db

@pytest.fixture(autouse=True)
def setup_and_teardown():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, this is my equipment monitor API"}

def test_create_equipment():
    response = client.post(
        "/equipment",
        json={"name": "Pump-1", "equipment_type": "pump", "min_expected": 20.0, "max_expected": 80.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Pump-1"
    assert data["id"] == 1

def test_add_reading_to_nonexistent_equipment_returns_404():
    response = client.post("/equipment/999/readings", json={"value":50.0, "unit": "psi"})
    assert response.status_code == 404

def test_status_flags_anomaly_above_range():
    equipment_response = client.post(
        "/equipment",
        json={"name": "Compressor-A", "equipment_type": "compressor", "min_expected": 100.0, "max_expected": 200.0},
    )

    equipment_id = equipment_response.json()["id"]

    client.post(f"/equipment/{equipment_id}/readings", json={"value": 250.0, "unit": "psi"})

    status_response = client.get(f"/equipment/{equipment_id}/status")
    assert status_response.status_code == 200
    assert status_response.json()["is_anomalous"] is True

def test_status_normal_reading_not_flagged():
    equipment_response = client.post(
        "/equipment",
        json={"name": "Compressor-B", "equipment_type": "compressor", "min_expected": 100.0, "max_expected": 200.0},
    )
    equipment_id = equipment_response.json()["id"]

    client.post(f"/equipment/{equipment_id}/readings", json={"value": 150.0, "unit": "psi"})

    status_response = client.get(f"/equipment/{equipment_id}/status")
    assert status_response.json()["is_anomalous"] is False