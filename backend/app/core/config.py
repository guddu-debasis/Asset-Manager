from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    
    DATABASE_URL: str = "mysql+pymysql://asset_user:asset_password@localhost:3306/asset_tracker"

    
    SECRET_KEY: str = "change-this-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  

    
    RESET_TOKEN_EXPIRE_MINUTES: int = 30  

    
    STORAGE_ROOT: str = "./storage"

    
    APP_NAME: str = "Asset Tracker"
    DEBUG: bool = False
    FRONTEND_URL: str = "http://localhost:5173"

    
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
