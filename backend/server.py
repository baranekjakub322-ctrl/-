from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
from datetime import datetime, timezone, timedelta, date
from typing import Annotated, Optional, List, Literal

import bcrypt
import jwt
import requests
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Form, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, BeforeValidator, ConfigDict
from starlette.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

app = FastAPI()
api = APIRouter(prefix="/api")

# ---------- Mongo base models ----------
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc):
        return cls.model_validate(doc)

    def to_mongo(self):
        data = self.model_dump(by_alias=True, exclude={"id"})
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data


class Booking(BaseDocument):
    start: str
    end: str
    note: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Photo(BaseDocument):
    category: Literal["bus", "garden"]
    url: Optional[str] = None
    storage_path: Optional[str] = None
    content_type: Optional[str] = None
    caption: str = ""
    order: int = 0
    is_deleted: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------- Auth ----------
JWT_ALGORITHM = "HS256"


def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode(), h.encode())


def make_token(user_id: str, email: str, kind: str, delta: timedelta) -> str:
    payload = {"sub": user_id, "email": email, "type": kind, "exp": datetime.now(timezone.utc) + delta}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie("access_token", make_token(user_id, email, "access", timedelta(hours=12)),
                        httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    response.set_cookie("refresh_token", make_token(user_id, email, "refresh", timedelta(days=7)),
                        httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        h = request.headers.get("Authorization", "")
        if h.startswith("Bearer "):
            token = h[7:]
    if not token:
        raise HTTPException(401, "Brak autoryzacji")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Sesja wygasła")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Nieprawidłowy token")
    if payload.get("type") != "access":
        raise HTTPException(401, "Nieprawidłowy token")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(401, "Użytkownik nie istnieje")
    return {"id": str(user["_id"]), "email": user["email"], "name": user.get("name", ""), "role": user.get("role")}


class LoginIn(BaseModel):
    email: str
    password: str


@api.post("/auth/login")
async def login(body: LoginIn, request: Request, response: Response):
    email = body.email.strip().lower()
    ident = f"{request.client.host if request.client else 'x'}:{email}"
    att = await db.login_attempts.find_one({"identifier": ident})
    now = datetime.now(timezone.utc)
    if att and att.get("count", 0) >= 5 and att.get("locked_until") and datetime.fromisoformat(att["locked_until"]) > now:
        raise HTTPException(429, "Zbyt wiele prób. Spróbuj ponownie za 15 minut.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        count = (att.get("count", 0) if att else 0) + 1
        upd = {"count": count}
        if count >= 5:
            upd["locked_until"] = (now + timedelta(minutes=15)).isoformat()
        await db.login_attempts.update_one({"identifier": ident}, {"$set": upd}, upsert=True)
        raise HTTPException(401, "Nieprawidłowy e-mail lub hasło")
    await db.login_attempts.delete_many({"identifier": ident})
    set_auth_cookies(response, str(user["_id"]), email)
    return {"id": str(user["_id"]), "email": email, "name": user.get("name", ""), "role": user.get("role")}


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/", secure=True, samesite="none")
    response.delete_cookie("refresh_token", path="/", secure=True, samesite="none")
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(401, "Brak tokenu")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Nieprawidłowy token")
    if payload.get("type") != "refresh":
        raise HTTPException(401, "Nieprawidłowy token")
    set_auth_cookies(response, payload["sub"], payload.get("email", ""))
    return {"ok": True}


# ---------- Object storage ----------
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
APP_NAME = "jaro-speed-rent"
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    r = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ.get("EMERGENT_LLM_KEY")}, timeout=30)
    r.raise_for_status()
    storage_key = r.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    r = requests.put(f"{STORAGE_URL}/objects/{path}",
                     headers={"X-Storage-Key": init_storage(), "Content-Type": content_type}, data=data, timeout=120)
    if r.status_code == 404:
        r = requests.put(f"{STORAGE_URL}/objects/{path}",
                         headers={"X-Storage-Key": init_storage(force=True), "Content-Type": content_type}, data=data, timeout=120)
    r.raise_for_status()
    return r.json()


def get_object(path: str):
    r = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage()}, timeout=60)
    r.raise_for_status()
    return r.content, r.headers.get("Content-Type", "application/octet-stream")


# ---------- Bookings ----------
class BookingIn(BaseModel):
    start: date
    end: date
    note: str = ""


@api.get("/bookings")
async def list_bookings():
    docs = await db.bookings.find().sort("start", 1).to_list(2000)
    return [{"id": b.id, "start": b.start, "end": b.end} for b in map(Booking.from_mongo, docs)]


@api.get("/admin/bookings")
async def admin_bookings(user: dict = Depends(get_current_user)):
    docs = await db.bookings.find().sort("start", 1).to_list(2000)
    return [Booking.from_mongo(d).model_dump() for d in docs]


@api.post("/admin/bookings")
async def add_booking(body: BookingIn, user: dict = Depends(get_current_user)):
    if body.end < body.start:
        raise HTTPException(400, "Data końcowa nie może być wcześniejsza niż początkowa")
    b = Booking(start=body.start.isoformat(), end=body.end.isoformat(), note=body.note.strip())
    res = await db.bookings.insert_one(b.to_mongo())
    b.id = str(res.inserted_id)
    return b.model_dump()


@api.delete("/admin/bookings/{booking_id}")
async def delete_booking(booking_id: str, user: dict = Depends(get_current_user)):
    res = await db.bookings.delete_one({"_id": ObjectId(booking_id)})
    if not res.deleted_count:
        raise HTTPException(404, "Nie znaleziono")
    return {"ok": True}


# ---------- Gallery ----------
SEED_PHOTOS = [
    ("bus", "/img/bus.webp", "Ford Tourneo Custom — 8 miejsc"),
    ("bus", "/img/kokpit.webp", "Kokpit z automatyczną skrzynią"),
    ("bus", "/img/bagaznik.webp", "Przestrzeń bagażowa"),
    ("garden", "/img/aerator.webp", "Aerator spalinowy rurkowy Weibang"),
    ("garden", "/img/wertykulator.webp", "Wertykulator spalinowy Weibang"),
]
ALLOWED_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/heic": "heic"}


def photo_out(p: Photo) -> dict:
    src = p.url if p.url else f"/api/files/{p.storage_path}"
    return {"id": p.id, "category": p.category, "src": src, "caption": p.caption, "order": p.order}


@api.get("/gallery")
async def gallery():
    docs = await db.photos.find({"is_deleted": False}).sort([("category", 1), ("order", 1)]).to_list(2000)
    return [photo_out(Photo.from_mongo(d)) for d in docs]


@api.post("/admin/gallery")
async def upload_photos(category: Literal["bus", "garden"] = Form(...), files: List[UploadFile] = File(...),
                        user: dict = Depends(get_current_user)):
    last = await db.photos.find({"category": category, "is_deleted": False}).sort("order", -1).limit(1).to_list(1)
    order = (last[0]["order"] + 1) if last else 0
    out = []
    for f in files:
        ctype = (f.content_type or "").lower()
        if ctype not in ALLOWED_TYPES:
            raise HTTPException(400, f"Nieobsługiwany format pliku: {f.filename}")
        data = await f.read()
        if len(data) > 15 * 1024 * 1024:
            raise HTTPException(400, f"Plik za duży (max 15 MB): {f.filename}")
        path = f"{APP_NAME}/gallery/{category}/{uuid.uuid4()}.{ALLOWED_TYPES[ctype]}"
        result = put_object(path, data, ctype)
        p = Photo(category=category, storage_path=result["path"], content_type=ctype, order=order)
        res = await db.photos.insert_one(p.to_mongo())
        p.id = str(res.inserted_id)
        out.append(photo_out(p))
        order += 1
    return out


class ReorderIn(BaseModel):
    category: Literal["bus", "garden"]
    ids: List[str]


@api.put("/admin/gallery/reorder")
async def reorder(body: ReorderIn, user: dict = Depends(get_current_user)):
    for i, pid in enumerate(body.ids):
        await db.photos.update_one({"_id": ObjectId(pid), "category": body.category}, {"$set": {"order": i}})
    return {"ok": True}


class PhotoPatch(BaseModel):
    caption: str


@api.patch("/admin/gallery/{photo_id}")
async def update_photo(photo_id: str, body: PhotoPatch, user: dict = Depends(get_current_user)):
    res = await db.photos.update_one({"_id": ObjectId(photo_id)}, {"$set": {"caption": body.caption.strip()[:140]}})
    if not res.matched_count:
        raise HTTPException(404, "Nie znaleziono")
    return {"ok": True}


@api.delete("/admin/gallery/{photo_id}")
async def delete_photo(photo_id: str, user: dict = Depends(get_current_user)):
    res = await db.photos.update_one({"_id": ObjectId(photo_id)}, {"$set": {"is_deleted": True}})
    if not res.matched_count:
        raise HTTPException(404, "Nie znaleziono")
    return {"ok": True}


@api.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.photos.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(404, "Nie znaleziono pliku")
    data, ctype = get_object(path)
    return Response(content=data, media_type=record.get("content_type") or ctype,
                    headers={"Cache-Control": "public, max-age=86400"})


@api.get("/")
async def root():
    return {"message": "Jaro Speed Rent API"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ['CORS_ORIGINS'].split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    email = os.environ["ADMIN_EMAIL"].lower()
    pwd = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({"email": email, "password_hash": hash_password(pwd), "name": "Administrator",
                                   "role": "admin", "created_at": datetime.now(timezone.utc).isoformat()})
    elif not verify_password(pwd, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(pwd)}})
    if await db.photos.count_documents({}) == 0:
        counters = {"bus": 0, "garden": 0}
        for cat, url, cap in SEED_PHOTOS:
            await db.photos.insert_one(Photo(category=cat, url=url, caption=cap, order=counters[cat]).to_mongo())
            counters[cat] += 1
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
