def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "healthy"}


def test_login_patient_success(client):
    res = client.post(
        "/api/v1/auth/login",
        json={"username": "john.tan", "password": "demo123"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["role"] == "PATIENT"
    assert data["user"]["name"] == "John Tan"
    assert data["user"]["patient_number"] == "P00010001"


def test_login_doctor_success(client):
    res = client.post(
        "/api/v1/auth/login",
        json={"username": "sarah.lim", "password": "demo123"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "DOCTOR"
    assert "Sarah Lim" in data["user"]["name"]
    assert data["user"]["doctor_number"] == "D00021"


def test_login_invalid_password(client):
    res = client.post(
        "/api/v1/auth/login",
        json={"username": "john.tan", "password": "wrongpassword"}
    )
    assert res.status_code == 401
    assert "Invalid username or password" in res.json()["detail"]


def test_login_nonexistent_user(client):
    res = client.post(
        "/api/v1/auth/login",
        json={"username": "nobody", "password": "password"}
    )
    assert res.status_code == 401


def test_me_endpoint(client, patient_headers):
    res = client.get("/api/v1/auth/me", headers=patient_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["username"] == "john.tan"
    assert data["role"] == "PATIENT"
    assert data["patient_number"] == "P00010001"
