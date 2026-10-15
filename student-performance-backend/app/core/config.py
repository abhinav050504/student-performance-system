from typing import List

class Settings:
    PROJECT_NAME: str = "AI Student Performance Analytics API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./students_database.db"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "*"
    ]

settings = Settings()
