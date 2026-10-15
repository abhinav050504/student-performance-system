from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.core.database import get_db
from app.db.models import StudentModel, AcademicRecordModel, PredictionLogModel
from app.schemas.student import StudentCreate, StudentResponse
from app.ml.model_service import score_student

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/", response_model=List[StudentResponse])
def get_students(
    risk: Optional[str] = Query(None, description="Filter by High Risk, Medium Risk, Low Risk"),
    search: Optional[str] = Query(None, description="Search by name, roll number, or email"),
    db: Session = Depends(get_db)
):
    query = db.query(StudentModel)
    
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (StudentModel.name.ilike(search_fmt)) |
            (StudentModel.student_id.ilike(search_fmt)) |
            (StudentModel.email.ilike(search_fmt))
        )
    
    students = query.all()
    results = []

    for s in students:
        # Get latest academic record
        rec = db.query(AcademicRecordModel).filter(AcademicRecordModel.student_id == s.student_id).order_by(AcademicRecordModel.id.desc()).first()
        pred = db.query(PredictionLogModel).filter(PredictionLogModel.student_id == s.student_id).order_by(PredictionLogModel.id.desc()).first()

        if not rec:
            continue

        if risk and pred and pred.risk_level.lower() != risk.lower():
            continue

        top_factors = json.loads(pred.top_risk_factors) if pred and pred.top_risk_factors else []
        recs = json.loads(pred.recommendations) if pred and pred.recommendations else []

        results.append(StudentResponse(
            id=s.id,
            student_id=s.student_id,
            name=s.name,
            email=s.email,
            department=s.department,
            semester=s.semester,
            parental_education=s.parental_education,
            internet_access=s.internet_access,
            created_at=s.created_at,
            attendance_rate=rec.attendance_rate,
            study_hours_per_week=rec.study_hours_per_week,
            past_failures=rec.past_failures,
            assignment_rate=rec.assignment_rate,
            midterm1_score=rec.midterm1_score,
            midterm2_score=rec.midterm2_score,
            final_score=rec.final_score,
            predicted_final_score=pred.predicted_final_score if pred else 10.0,
            risk_level=pred.risk_level if pred else "Medium Risk",
            risk_probability=pred.risk_probability if pred else 50.0,
            top_risk_factors=top_factors,
            recommendations=recs
        ))

    return results

@router.post("/", response_model=StudentResponse)
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    # Check if student exists
    existing = db.query(StudentModel).filter(
        (StudentModel.student_id == payload.student_id) | 
        (StudentModel.email == payload.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student with this ID or email already exists")

    # 1. Create Student
    student = StudentModel(
        student_id=payload.student_id,
        name=payload.name,
        email=payload.email,
        department=payload.department,
        semester=payload.semester,
        parental_education=payload.parental_education,
        internet_access=payload.internet_access
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    # 2. Add Academic Record
    record = AcademicRecordModel(
        student_id=payload.student_id,
        attendance_rate=payload.attendance_rate,
        study_hours_per_week=payload.study_hours_per_week,
        past_failures=payload.past_failures,
        assignment_rate=payload.assignment_rate,
        midterm1_score=payload.midterm1_score,
        midterm2_score=payload.midterm2_score
    )
    db.add(record)
    db.commit()

    # 3. Calculate Real-time ML Prediction & Log
    score, risk_lvl, prob, drivers, recs = score_student(
        midterm1=payload.midterm1_score,
        midterm2=payload.midterm2_score,
        attendance=payload.attendance_rate,
        study_hours=payload.study_hours_per_week,
        past_failures=payload.past_failures,
        assignment_rate=payload.assignment_rate
    )

    pred_log = PredictionLogModel(
        student_id=payload.student_id,
        model_version="RandomForest_v1.0",
        predicted_final_score=score,
        risk_level=risk_lvl,
        risk_probability=prob,
        top_risk_factors=json.dumps(drivers),
        recommendations=json.dumps(recs)
    )
    db.add(pred_log)
    db.commit()

    return StudentResponse(
        id=student.id,
        student_id=student.student_id,
        name=student.name,
        email=student.email,
        department=student.department,
        semester=student.semester,
        parental_education=student.parental_education,
        internet_access=student.internet_access,
        created_at=student.created_at,
        attendance_rate=record.attendance_rate,
        study_hours_per_week=record.study_hours_per_week,
        past_failures=record.past_failures,
        assignment_rate=record.assignment_rate,
        midterm1_score=record.midterm1_score,
        midterm2_score=record.midterm2_score,
        final_score=record.final_score,
        predicted_final_score=score,
        risk_level=risk_lvl,
        risk_probability=prob,
        top_risk_factors=drivers,
        recommendations=recs
    )
