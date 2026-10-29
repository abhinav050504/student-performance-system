from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class UserModel(Base):
    """Faculty / Admin user authentication record"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    role = Column(String(30), default="Faculty Member")  # Faculty Member, Mentor, Administrator
    created_at = Column(DateTime, default=datetime.utcnow)

class StudentModel(Base):
    """Core student institutional profile (Demographics & Baseline)"""
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(String(30), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    department = Column(String(80), default="Computer Science & Engineering")
    semester = Column(Integer, default=7)
    parental_education = Column(String(30), default="Secondary")  # Primary, Secondary, Higher
    internet_access = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    records = relationship("AcademicRecordModel", back_populates="student", cascade="all, delete-orphan")
    predictions = relationship("PredictionLogModel", back_populates="student", cascade="all, delete-orphan")

class AcademicRecordModel(Base):
    """Academic assessments, attendance, and behaviour features"""
    __tablename__ = "academic_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(String(30), ForeignKey("students.student_id"), nullable=False)
    
    attendance_rate = Column(Float, nullable=False)  # 0.0 to 100.0%
    study_hours_per_week = Column(Float, default=5.0)
    past_failures = Column(Integer, default=0)
    assignment_rate = Column(Float, default=70.0)    # 0.0 to 100.0%
    
    midterm1_score = Column(Float, nullable=False)   # G1 (0 to 20)
    midterm2_score = Column(Float, nullable=False)   # G2 (0 to 20)
    final_score = Column(Float, nullable=True)       # G3 (0 to 20) Target, nullable before semester close
    
    recorded_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentModel", back_populates="records")

class PredictionLogModel(Base):
    """Auditable log of ML predictions and diagnostic explainability outputs"""
    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(String(30), ForeignKey("students.student_id"), nullable=False)
    
    model_version = Column(String(50), default="RandomForest_v1.0")
    predicted_final_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)  # High Risk, Medium Risk, Low Risk
    risk_probability = Column(Float, nullable=False) # 0 to 100%
    
    top_risk_factors = Column(Text, nullable=True)   # JSON string or comma-separated
    recommendations = Column(Text, nullable=True)    # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentModel", back_populates="predictions")
