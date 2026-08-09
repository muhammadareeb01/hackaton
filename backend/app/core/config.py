from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Smart Civic Services"
    @property
    def BACKEND_CORS_ORIGINS(self) -> list[str]:
        origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,https://hackaton-j9fm.vercel.app,https://aismartcity.vercel.app")
        return [origin.strip() for origin in origins.split(",")]
    
    # MySQL Database Config (User must update .env)
    DB_USER: str = "root"
    DB_PASSWORD: str = "root"
    DB_HOST: str = "localhost"
    DB_PORT: str = "3306"
    DB_NAME: str = "smartcity"
    
    # If DB_URL is explicitly set in env, use it. Otherwise, fallback to SQLite for easy deployment
    DB_URL: str = "sqlite:///./database.db"
    
    ENCRYPTION_KEY: str = "uO_N8yHj9T6J8jF5_5D2s6Fz4-B9uN7t_gJ3Ym7x9kA="
    JWT_SECRET: str = "super-secret-key-change-in-prod"
    GEMINI_API_KEY: Optional[str] = None
    RESEND_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
