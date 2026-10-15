"""
AI-Powered Student Performance Analytics and Prediction System
FastAPI Backend Application Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.api.router import api_router
from app.db.seed_data import init_and_seed_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database tables and seed sample cohort data
    init_and_seed_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Modular REST API for student analytics, relational records, and leakage-aware classical ML prediction",
    lifespan=lifespan
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include master API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "database": "SQLite (SQLAlchemy ORM)",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
