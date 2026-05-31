from decimal import Decimal


def _setup(client):
    client.post("/api/v1/auth/signup", json={
        "full_name": "Test User", "email": "t@t.com", "password": "Secret123"
    })
    res = client.post("/api/v1/auth/signin", json={"email": "t@t.com", "password": "Secret123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    section = client.post("/api/v1/sections", json={"name": "Electronics"}, headers=headers).json()
    return headers, section["id"]


def test_create_item(client):
    headers, section_id = _setup(client)
    res = client.post("/api/v1/items", json={
        "section_id": section_id,
        "name": "MacBook Pro",
        "buying_price": "1299.99",
        "purchase_year": 2023,
        "condition": "excellent",
    }, headers=headers)
    assert res.status_code == 201
    assert res.json()["name"] == "MacBook Pro"


def test_list_items_by_section(client):
    headers, section_id = _setup(client)
    client.post("/api/v1/items", json={"section_id": section_id, "name": "Item A"}, headers=headers)
    client.post("/api/v1/items", json={"section_id": section_id, "name": "Item B"}, headers=headers)
    res = client.get(f"/api/v1/items?section_id={section_id}", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) == 2


def test_update_item(client):
    headers, section_id = _setup(client)
    item = client.post("/api/v1/items", json={"section_id": section_id, "name": "Old Name"}, headers=headers).json()
    res = client.patch(f"/api/v1/items/{item['id']}", json={"name": "New Name"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["name"] == "New Name"
