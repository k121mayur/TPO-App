from pathlib import Path
from pydantic import BaseSettings, Field, validator


class Settings(BaseSettings):
    APP_NAME: str = "Green Jobs API"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@db:5432/greenjobs",
        env="DATABASE_URL",
    )
    JWT_SECRET: str = Field(default="change-me-secret", env="JWT_SECRET")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    CORS_ORIGINS: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])

    class Config:
        env_file = str(Path(__file__).resolve().parents[2] / ".env")
        env_file_encoding = "utf-8"

    @validator("CORS_ORIGINS", pre=True)
    def assemble_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


settings = Settings()
