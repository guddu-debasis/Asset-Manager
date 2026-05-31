def _auth_headers(client):
    client.post("/api/v1/auth/signup", json={
        "full_name": "Test User", "email": "t@t.com", "password": "Secret123"
    })
    res = client.post("/api/v1/auth/signin", json={"email": "t@t.com", "password": "Secret123"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_section(client):
    headers = _auth_headers(client)
    res = client.post("/api/v1/sections", json={"name": "Electronics", "icon": "cpu"}, headers=headers)
    assert res.status_code == 201
    assert res.json()["name"] == "Electronics"


def test_list_sections(client):
    headers = _auth_headers(client)
    client.post("/api/v1/sections", json={"name": "Car"}, headers=headers)
    client.post("/api/v1/sections", json={"name": "Kitchen"}, headers=headers)
    res = client.get("/api/v1/sections", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) == 2


def test_delete_section(client):
    headers = _auth_headers(client)
    create = client.post("/api/v1/sections", json={"name": "Temp"}, headers=headers)
    sid = create.json()["id"]
    res = client.delete(f"/api/v1/sections/{sid}", headers=headers)
    assert res.status_code == 200
