from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# ----------------- Student Schemas -----------------
class StudentBase(BaseModel):
    student_id: str = Field(..., description="Institutional student ID (e.g. 210097010001)")
    name: str = Field(..., description="Student full name")
    email: str = Field(..., description="Student institutional email")
    department: str = Field("Computer Science & Engineering", description="Department")
    semester: int = Field(7, description="Current semester")
    parental_education: str = Field("Secondary", description="Primary, Secondary, or Higher")
    internet_access: bool = Field(True, description="Internet availability at residence")

class StudentCreate(StudentBase):
    # Initial academic record upon registration
    attendance_rate: float = Field(..., ge=0, le=100)
    study_hours_per_week: float = Field(..., ge=0, le=60)
    past_failures: int = Field(0, ge=0, le=10)
    assignment_rate: float = Field(75.0, ge=0, le=100)
    midterm1_score: float = Field(..., ge=0, le=20)
    midterm2_score: float = Field(..., ge=0, le=20)

class StudentResponse(StudentBase):
    id: int
    created_at: datetime
    # Current latest academic indicators
    attendance_rate: float
    study_hours_per_week: float
    past_failures: int
    assignment_rate: float
    midterm1_score: float
    midterm2_score: float
    final_score: Optional[float] = None
    # Current active ML prediction
    predicted_final_score: float
    risk_level: str
    risk_probability: float
    top_risk_factors: List[str] = []
    recommendations: List[str] = []

    class Config:
        from_attributes = True

# ----------------- ML Prediction Schemas -----------------
class DirectPredictionRequest(BaseModel):
    midterm1_score: float = Field(..., ge=0, le=20)
    midterm2_score: float = Field(..., ge=0, le=20)
    attendance_rate: float = Field(..., ge=0, le=100)
    study_hours_per_week: float = Field(..., ge=0, le=60)
    past_failures: int = Field(0, ge=0, le=10)
    assignment_rate: float = Field(80.0, ge=0, le=100)
    internet_access: bool = True
    parental_education: int = Field(2, ge=1, le=3)

class DirectPredictionResponse(BaseModel):
    predicted_final_score: float
    risk_level: str
    risk_probability: float
    key_drivers: List[str]
    recommendations: List[str]

# ----------------- Analytics Schemas -----------------
class ClassOverviewStats(BaseModel):
    total_students: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    average_attendance: float
    average_predicted_score: float
    grade_distribution: List[dict]
