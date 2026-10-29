from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import hashlib

from app.core.database import get_db
from app.db.models import UserModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = "SUPER_SECURE_JWT_SECRET_EDUPREDICT_AI_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "Faculty Member"

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

def hash_password(password: str) -> str:
    """Simple robust SHA-256 with salt"""
    return hashlib.sha256((password + "edu_salt_salt").encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=AuthResponse)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )

    user = UserModel(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    user_info = {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role
    }

    token = create_access_token(user_info)

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=user_info
    )

@router.post("/login", response_model=AuthResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials"
        )

    user_info = {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role
    }

    token = create_access_token(user_info)

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=user_info
    )
