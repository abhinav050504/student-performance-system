from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.student import DirectPredictionRequest, DirectPredictionResponse, ClassOverviewStats
from app.db.models import StudentModel, AcademicRecordModel, PredictionLogModel
from app.ml.model_service import score_student

router = APIRouter(tags=["Analytics & Predictions"])

@router.post("/predict", response_model=DirectPredictionResponse)
def predict_score(payload: DirectPredictionRequest):
    """Direct standalone ML inference for simulator without requiring DB save"""
    score, risk_lvl, prob, drivers, recs = score_student(
        midterm1=payload.midterm1_score,
        midterm2=payload.midterm2_score,
        attendance=payload.attendance_rate,
        study_hours=payload.study_hours_per_week,
        past_failures=payload.past_failures,
        assignment_rate=payload.assignment_rate
    )
    return DirectPredictionResponse(
        predicted_final_score=score,
        risk_level=risk_lvl,
        risk_probability=prob,
        key_drivers=drivers,
        recommendations=recs
    )

@router.get("/analytics/overview", response_model=ClassOverviewStats)
def get_class_overview(db: Session = Depends(get_db)):
    """Computes aggregate analytics from the database records"""
    students = db.query(StudentModel).all()
    total = len(students)
    if total == 0:
        return ClassOverviewStats(
            total_students=0,
            high_risk_count=0,
            medium_risk_count=0,
            low_risk_count=0,
            average_attendance=0.0,
            average_predicted_score=0.0,
            grade_distribution=[]
        )

    preds = db.query(PredictionLogModel).all()
    records = db.query(AcademicRecordModel).all()

    high_risk = sum(1 for p in preds if p.risk_level == "High Risk")
    med_risk = sum(1 for p in preds if p.risk_level == "Medium Risk")
    low_risk = sum(1 for p in preds if p.risk_level == "Low Risk")

    avg_att = sum(r.attendance_rate for r in records) / len(records) if records else 0.0
    avg_score = sum(p.predicted_final_score for p in preds) / len(preds) if preds else 0.0

    # Grade distribution buckets
    ranges = {
        "Fail (<10)": 0,
        "Pass (10-12)": 0,
        "Good (13-15)": 0,
        "Very Good (16-17)": 0,
        "Excellent (18-20)": 0
    }
    for p in preds:
        s = p.predicted_final_score
        if s < 10: ranges["Fail (<10)"] += 1
        elif s < 13: ranges["Pass (10-12)"] += 1
        elif s < 16: ranges["Good (13-15)"] += 1
        elif s < 18: ranges["Very Good (16-17)"] += 1
        else: ranges["Excellent (18-20)"] += 1

    dist = [{"range": k, "count": v} for k, v in ranges.items()]

    return ClassOverviewStats(
        total_students=total,
        high_risk_count=high_risk,
        medium_risk_count=med_risk,
        low_risk_count=low_risk,
        average_attendance=round(avg_att, 1),
        average_predicted_score=round(avg_score, 1),
        grade_distribution=dist
    )
