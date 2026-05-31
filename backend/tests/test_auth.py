def test_signup_success(client):
    res = client.post("/api/v1/auth/signup", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "Secret123",
    })
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["email"] == "test@example.com"


def test_signup_duplicate_email(client):
    payload = {"full_name": "Test User", "email": "test@example.com", "password": "Secret123"}
    client.post("/api/v1/auth/signup", json=payload)
    res = client.post("/api/v1/auth/signup", json=payload)
    assert res.status_code == 409


def test_signin_success(client):
    client.post("/api/v1/auth/signup", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "Secret123",
    })
    res = client.post("/api/v1/auth/signin", json={
        "email": "test@example.com",
        "password": "Secret123",
    })
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_signin_wrong_password(client):
    client.post("/api/v1/auth/signup", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "Secret123",
    })
    res = client.post("/api/v1/auth/signin", json={
        "email": "test@example.com",
        "password": "WrongPass999",
    })
    assert res.status_code == 403
