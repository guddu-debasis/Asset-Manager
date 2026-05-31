from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
from typing import List


class Settings(BaseSettings):

    # ─── Database ─────────────────────────────────────────
    DATABASE_URL: str = "mysql+pymysql://asset_user:asset_password@localhost:3306/asset_tracker"

    # ─── JWT ──────────────────────────────────────────────
    SECRET_KEY: str = "change-this-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # ─── Storage ──────────────────────────────────────────
    STORAGE_ROOT: str = "./storage"

    # ─── App ──────────────────────────────────────────────
    APP_NAME: str = "Asset Tracker"
    DEBUG: bool = False
    FRONTEND_URL: str = "http://localhost:5173"

    # ─── CORS ─────────────────────────────────────────────
    # Comma-separated list of allowed origins
    # e.g. "http://localhost:5173,https://asset-tracker.vercel.app"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_origins(cls, v: str) -> str:
        return v.strip()

    def get_allowed_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    # ─── Email ────────────────────────────────────────────
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_FROM_NAME: str = "Asset Tracker"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
