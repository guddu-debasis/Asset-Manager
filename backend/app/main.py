from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.api.v1 import auth, users, sections, items, uploads

app = FastAPI(
    title="Asset Tracker API",
    description="Personal Asset Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static file serving for uploaded photos ─────────────
os.makedirs(settings.STORAGE_ROOT, exist_ok=True)
app.mount("/storage", StaticFiles(directory=settings.STORAGE_ROOT), name="storage")

# ─── Routers ─────────────────────────────────────────────
app.include_router(auth.router,     prefix="/api/v1/auth",     tags=["Auth"])
app.include_router(users.router,    prefix="/api/v1/users",    tags=["Users"])
app.include_router(sections.router, prefix="/api/v1/sections", tags=["Sections"])
app.include_router(items.router,    prefix="/api/v1/items",    tags=["Items"])
app.include_router(uploads.router,  prefix="/api/v1/uploads",  tags=["Uploads"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "version": "1.0.0"}
