from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_theme_settings_public():
    res = client.get("/api/v1/settings/theme")
    assert res.status_code == 200
    data = res.json()
    assert data["key"] == "theme_config"
    assert "dark" in data["config"]
    assert "light" in data["config"]
    assert data["config"]["dark"]["primary"].startswith("#")
    assert data["config"]["light"]["primary"].startswith("#")

def test_update_theme_settings_requires_auth():
    payload = {
        "dark": {
            "primary": "#10b981",
            "primaryGradientEnd": "#059669",
            "accentSecondary": "#34d399",
            "bgPrimary": "#064e3b",
            "bgCard": "#022c22",
            "textPrimary": "#ecfdf5",
        },
        "light": {
            "primary": "#10b981",
            "primaryGradientEnd": "#059669",
            "accentSecondary": "#059669",
            "bgPrimary": "#f0fdf4",
            "bgCard": "#ffffff",
            "textPrimary": "#064e3b",
        },
    }
    # Without token
    res = client.put("/api/v1/settings/theme", json=payload)
    assert res.status_code in (401, 403)

    # With admin login
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@gesf.com", "password": "admin123"},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    update_res = client.put("/api/v1/settings/theme", json=payload, headers=headers)
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["config"]["dark"]["primary"] == "#10b981"

    # Reset back
    reset_res = client.post("/api/v1/settings/theme/reset", headers=headers)
    assert reset_res.status_code == 200
    assert reset_res.json()["config"]["dark"]["primary"] == "#f59e0b"
