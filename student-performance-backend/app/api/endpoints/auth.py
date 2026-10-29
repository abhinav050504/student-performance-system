from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import hashlib
import json

from app.core.database import get_db
from app.db.models import UserModel, StudentModel, AcademicRecordModel, PredictionLogModel
from app.ml.model_service import score_student

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = "SUPER_SECURE_JWT_SECRET_EDUPREDICT_AI_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    account_type: str = "faculty" # "faculty" or "student"
    role: str = "Faculty Member"
    student_id: str = "" # Required if student

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

    # 1. Create User Authentication Record
    assigned_role = "Student" if payload.account_type == "student" else payload.role
    user = UserModel(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=assigned_role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. If registering as student, link or register student profile & baseline records
    student_record_id = payload.student_id.strip() if payload.student_id else f"STU-{user.id:04d}"
    if payload.account_type == "student":
        existing_student = db.query(StudentModel).filter(StudentModel.email == payload.email).first()
        if not existing_student:
            new_student = StudentModel(
                student_id=student_record_id,
                name=payload.full_name,
                email=payload.email,
                department="Computer Science & Engineering",
                semester=7,
                parental_education="Secondary",
                internet_access=True
            )
            db.add(new_student)
            db.commit()

            # Add default initial academic record
            rec = AcademicRecordModel(
                student_id=student_record_id,
                attendance_rate=80.0,
                study_hours_per_week=8.0,
                past_failures=0,
                assignment_rate=85.0,
                midterm1_score=12.0,
                midterm2_score=13.0
            )
            db.add(rec)
            db.commit()

            # Compute initial ML prediction
            score, risk, prob, drivers, recs = score_student(12.0, 13.0, 80.0, 8.0, 0, 85.0)
            pred = PredictionLogModel(
                student_id=student_record_id,
                model_version="RandomForest_v1.0",
                predicted_final_score=score,
                risk_level=risk,
                risk_probability=prob,
                top_risk_factors=json.dumps(drivers),
                recommendations=json.dumps(recs)
            )
            db.add(pred)
            db.commit()

    user_info = {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role,
        "account_type": payload.account_type,
        "student_id": student_record_id if payload.account_type == "student" else None
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

    # Check if student
    student_entry = db.query(StudentModel).filter(StudentModel.email == user.email).first()

    user_info = {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role,
        "account_type": "student" if user.role == "Student" else "faculty",
        "student_id": student_entry.student_id if student_entry else None
    }

    token = create_access_token(user_info)

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=user_info
    )
