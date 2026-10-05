"""Backend tests for Jaro Speed Rent (public + admin). Uses live backend via REACT_APP_BACKEND_URL."""
import io
import os
import pytest
import requests
from pathlib import Path

# Load frontend .env to get the real public URL (backend tests must hit the public URL)
FE_ENV = Path("/app/frontend/.env")
BASE_URL = None
for line in FE_ENV.read_text().splitlines():
    if line.startswith("REACT_APP_BACKEND_URL="):
        BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
assert BASE_URL, "REACT_APP_BACKEND_URL not set"
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "jarospeedrent@gmail.com"
ADMIN_PASSWORD = "JaroAdmin2026!"

# A tiny valid PNG (1x1) for upload tests
PNG_1x1 = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
    "890000000d49444154789c6300010000000500010d0a2db40000000049454e44ae426082"
)


# ---------- Fixtures ----------
@pytest.fixture(scope="module")
def public():
    s = requests.Session()
    return s


@pytest.fixture(scope="module")
def admin():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert data.get("role") == "admin"
    # verify cookies set
    assert "access_token" in s.cookies
    return s


# ---------- Health ----------
def test_root(public):
    r = public.get(f"{API}/", timeout=10)
    assert r.status_code == 200
    assert "Jaro" in r.json().get("message", "")


# ---------- Auth ----------
def test_auth_me_unauthenticated(public):
    r = public.get(f"{API}/auth/me", timeout=10)
    assert r.status_code == 401


def test_auth_login_success_sets_cookies(admin):
    # Fixture already asserts; verify /auth/me now works with session
    r = admin.get(f"{API}/auth/me", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "admin"


def test_auth_login_wrong_password(public):
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-password-xyz"}, timeout=10)
    assert r.status_code == 401
    assert "Nieprawidłowy" in r.json().get("detail", "")


def test_bcrypt_hash_format():
    # Direct DB check: admin password hash must start with $2b$ (bcrypt)
    import asyncio
    from motor.motor_asyncio import AsyncIOMotorClient
    async def _check():
        c = AsyncIOMotorClient(os.environ["MONGO_URL"])
        db = c[os.environ["DB_NAME"]]
        u = await db.users.find_one({"email": ADMIN_EMAIL})
        c.close()
        return u
    # Load backend env
    from dotenv import load_dotenv
    load_dotenv("/app/backend/.env", override=False)
    u = asyncio.get_event_loop().run_until_complete(_check())
    assert u is not None, "Admin user not seeded"
    assert u["password_hash"].startswith("$2b$"), f"Non-bcrypt hash: {u['password_hash'][:4]}"


# ---------- Admin auth guard ----------
@pytest.mark.parametrize("method,path", [
    ("GET", "/admin/bookings"),
    ("POST", "/admin/bookings"),
    ("DELETE", "/admin/bookings/000000000000000000000000"),
    ("POST", "/admin/gallery"),
    ("PUT", "/admin/gallery/reorder"),
    ("PATCH", "/admin/gallery/000000000000000000000000"),
    ("DELETE", "/admin/gallery/000000000000000000000000"),
])
def test_admin_endpoints_require_auth(public, method, path):
    r = public.request(method, f"{API}{path}", timeout=10)
    assert r.status_code == 401, f"{method} {path} → {r.status_code}"


# ---------- Bookings public ----------
def test_public_bookings_shape(public):
    r = public.get(f"{API}/bookings", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    for b in data:
        assert set(b.keys()) >= {"id", "start", "end"}
        # dates ISO
        assert len(b["start"]) == 10 and b["start"][4] == "-"


# ---------- Bookings CRUD ----------
def test_admin_booking_create_list_delete(admin, public):
    payload = {"start": "2027-01-10", "end": "2027-01-12", "note": "TEST_pytest"}
    r = admin.post(f"{API}/admin/bookings", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    b = r.json()
    assert b["start"] == "2027-01-10"
    assert b["end"] == "2027-01-12"
    assert b["note"] == "TEST_pytest"
    bid = b["id"]
    assert bid

    # listed in public
    public_list = public.get(f"{API}/bookings").json()
    assert any(x["id"] == bid for x in public_list)

    # listed in admin
    admin_list = admin.get(f"{API}/admin/bookings").json()
    assert any(x["id"] == bid for x in admin_list)

    # delete
    r = admin.delete(f"{API}/admin/bookings/{bid}", timeout=10)
    assert r.status_code == 200
    assert r.json().get("ok") is True

    # gone
    public_list2 = public.get(f"{API}/bookings").json()
    assert not any(x["id"] == bid for x in public_list2)


def test_admin_booking_end_before_start_rejected(admin):
    r = admin.post(f"{API}/admin/bookings", json={"start": "2027-02-10", "end": "2027-02-09", "note": "TEST_bad"}, timeout=10)
    assert r.status_code == 400


# ---------- Seeded bookings (preserve) ----------
def test_seeded_demo_booking_present(public):
    """Main agent seeded a TEST_demo booking 2026-10-14..17 — ensure it is visible on public endpoint."""
    data = public.get(f"{API}/bookings").json()
    hit = [b for b in data if b["start"] == "2026-10-14" and b["end"] == "2026-10-17"]
    assert hit, f"Seeded 2026-10-14..17 booking missing. Have: {data}"


# ---------- Gallery public ----------
def test_public_gallery_has_seeds(public):
    r = public.get(f"{API}/gallery", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 5, "Expected at least 5 seed photos"
    cats = {p["category"] for p in data}
    assert {"bus", "garden"}.issubset(cats)
    for p in data:
        assert set(p.keys()) >= {"id", "category", "src", "caption", "order"}


# ---------- Gallery upload / reorder / caption / delete ----------
@pytest.fixture(scope="module")
def uploaded_photo(admin):
    files = {"files": ("test_pixel.png", io.BytesIO(PNG_1x1), "image/png")}
    data = {"category": "bus"}
    r = admin.post(f"{API}/admin/gallery", files=files, data=data, timeout=60)
    assert r.status_code == 200, r.text
    out = r.json()
    assert isinstance(out, list) and len(out) == 1
    p = out[0]
    assert p["category"] == "bus"
    assert p["src"].startswith("/api/files/")
    yield p
    # cleanup
    admin.delete(f"{API}/admin/gallery/{p['id']}", timeout=10)


def test_upload_photo_served_via_files_endpoint(public, uploaded_photo):
    src = uploaded_photo["src"]
    r = public.get(f"{BASE_URL}{src}", timeout=30)
    assert r.status_code == 200, f"GET {src} → {r.status_code}"
    assert r.headers.get("Content-Type", "").startswith("image/")
    assert len(r.content) > 0


def test_upload_invalid_mime_rejected(admin):
    files = {"files": ("bad.txt", io.BytesIO(b"not an image"), "text/plain")}
    r = admin.post(f"{API}/admin/gallery", files=files, data={"category": "bus"}, timeout=30)
    assert r.status_code == 400


def test_caption_update_and_delete(admin, public):
    # upload, update, verify in listing, delete, verify gone
    files = {"files": ("test2.png", io.BytesIO(PNG_1x1), "image/png")}
    r = admin.post(f"{API}/admin/gallery", files=files, data={"category": "garden"}, timeout=60)
    assert r.status_code == 200
    pid = r.json()[0]["id"]
    try:
        r = admin.patch(f"{API}/admin/gallery/{pid}", json={"caption": "TEST_caption_X"}, timeout=10)
        assert r.status_code == 200
        gal = public.get(f"{API}/gallery").json()
        hit = next((p for p in gal if p["id"] == pid), None)
        assert hit and hit["caption"] == "TEST_caption_X"
    finally:
        r = admin.delete(f"{API}/admin/gallery/{pid}", timeout=10)
        assert r.status_code == 200

    # verify soft delete removes from listing
    gal2 = public.get(f"{API}/gallery").json()
    assert not any(p["id"] == pid for p in gal2)


def test_reorder_persists(admin):
    # upload two photos to garden, reverse order, verify via GET /gallery
    created = []
    for i in range(2):
        files = {"files": (f"ord{i}.png", io.BytesIO(PNG_1x1), "image/png")}
        r = admin.post(f"{API}/admin/gallery", files=files, data={"category": "garden"}, timeout=60)
        assert r.status_code == 200
        created.append(r.json()[0]["id"])
    try:
        reversed_ids = list(reversed(created))
        # Need to send ALL garden ids in intended order — only reorder among them.
        # Fetch all garden photos and build a new order list placing our created in reversed order at end.
        all_photos = admin.get(f"{API}/admin/bookings")  # noqa (we don't have admin gallery list; use public)
        gal = requests.get(f"{API}/gallery").json()
        garden_ids = [p["id"] for p in gal if p["category"] == "garden"]
        # Replace our two ids with reversed version
        others = [i for i in garden_ids if i not in created]
        new_order = others + reversed_ids
        r = admin.put(f"{API}/admin/gallery/reorder", json={"category": "garden", "ids": new_order}, timeout=10)
        assert r.status_code == 200
        # verify
        gal2 = requests.get(f"{API}/gallery").json()
        garden_now = [p["id"] for p in gal2 if p["category"] == "garden"]
        # The two created should appear in reversed order
        idxs = [garden_now.index(x) for x in reversed_ids]
        assert idxs == sorted(idxs), f"Reorder not applied: {garden_now}"
    finally:
        for pid in created:
            admin.delete(f"{API}/admin/gallery/{pid}", timeout=10)


# ---------- CORS ----------
def test_cors_allows_frontend_origin(public):
    # Same-origin preview env: frontend proxies through same ingress as backend.
    # Validate response works with Origin header and allow-credentials is set.
    r = public.get(f"{API}/bookings", headers={"Origin": BASE_URL}, timeout=10)
    assert r.status_code == 200
    assert r.headers.get("access-control-allow-credentials", "").lower() == "true"
