from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4o-mini"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    RETRIEVAL_TOP_K: int = 10
    RETRIEVAL_CONFIDENCE_THRESHOLD: float = 0.01  # minimum average RRF score to proceed
    LOG_LEVEL: str = "INFO"

    # Comma-separated list of allowed CORS origins
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # Firebase credentials — provide exactly one of these two
    FIREBASE_CREDENTIALS_JSON: str | None = None   # full JSON string of service account
    FIREBASE_CREDENTIALS_PATH: str | None = None   # path to serviceAccountKey.json file

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
