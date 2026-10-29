from fastapi import APIRouter
from app.api.endpoints import students, predictions, auth

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(students.router)
api_router.include_router(predictions.router)
