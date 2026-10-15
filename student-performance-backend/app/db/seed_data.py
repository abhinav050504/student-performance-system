import json
from app.core.database import SessionLocal, engine, Base
from app.db.models import StudentModel, AcademicRecordModel, PredictionLogModel
from app.ml.model_service import score_student

SAMPLE_STUDENTS = [
    {
        "student_id": "210097010001",
        "name": "Aarav Sharma",
        "email": "aarav.sharma@gcet.edu.in",
        "department": "Computer Science & Engineering",
        "semester": 7,
        "parental_education": "Secondary",
        "internet_access": True,
        "attendance_rate": 62.0,
        "study_hours_per_week": 4.0,
        "past_failures": 2,
        "assignment_rate": 58.0,
        "midterm1_score": 8.0,
        "midterm2_score": 7.0,
    },
    {
        "student_id": "210097010014",
        "name": "Ananya Verma",
        "email": "ananya.verma@gcet.edu.in",
        "department": "Computer Science & Engineering",
        "semester": 7,
        "parental_education": "Higher",
        "internet_access": True,
        "attendance_rate": 94.0,
        "study_hours_per_week": 16.0,
        "past_failures": 0,
        "assignment_rate": 98.0,
        "midterm1_score": 18.0,
        "midterm2_score": 19.0,
    },
    {
        "student_id": "210097010029",
        "name": "Rohan Gupta",
        "email": "rohan.gupta@gcet.edu.in",
        "department": "Computer Science & Engineering",
        "semester": 7,
        "parental_education": "Secondary",
        "internet_access": True,
        "attendance_rate": 74.0,
        "study_hours_per_week": 8.0,
        "past_failures": 1,
        "assignment_rate": 72.0,
        "midterm1_score": 11.0,
        "midterm2_score": 12.0,
    },
    {
        "student_id": "210097010042",
        "name": "Priya Nair",
        "email": "priya.nair@gcet.edu.in",
        "department": "Computer Science & Engineering",
        "semester": 7,
        "parental_education": "Higher",
        "internet_access": True,
        "attendance_rate": 88.0,
        "study_hours_per_week": 12.0,
        "past_failures": 0,
        "assignment_rate": 90.0,
        "midterm1_score": 16.0,
        "midterm2_score": 15.0,
    },
    {
        "student_id": "210097010055",
        "name": "Kabir Patel",
        "email": "kabir.patel@gcet.edu.in",
        "department": "Computer Science & Engineering",
        "semester": 7,
        "parental_education": "Primary",
        "internet_access": False,
        "attendance_rate": 55.0,
        "study_hours_per_week": 3.0,
        "past_failures": 3,
        "assignment_rate": 40.0,
        "midterm1_score": 6.0,
        "midterm2_score": 5.0,
    },
    {
        "student_id": "210097010068",
        "name": "Sneha Kulkarni",
        "email": "sneha.k@gcet.edu.in",
        "department": "Computer Science & Engineering",
        "semester": 7,
        "parental_education": "Higher",
        "internet_access": True,
        "attendance_rate": 81.0,
        "study_hours_per_week": 10.0,
        "past_failures": 0,
        "assignment_rate": 85.0,
        "midterm1_score": 14.0,
        "midterm2_score": 14.0,
    },
    {
        "student_id": "210097010077",
        "name": "Vikramaditya Rao",
        "email": "vikram.rao@gcet.edu.in",
        "department": "Computer Science & Engineering",
        "semester": 7,
        "parental_education": "Secondary",
        "internet_access": True,
        "attendance_rate": 68.0,
        "study_hours_per_week": 6.0,
        "past_failures": 1,
        "assignment_rate": 65.0,
        "midterm1_score": 10.0,
        "midterm2_score": 9.0,
    }
]

def init_and_seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Only seed if empty
    if db.query(StudentModel).count() == 0:
        print("[DB SEED] Populating initial student database records...")
        for data in SAMPLE_STUDENTS:
            student = StudentModel(
                student_id=data["student_id"],
                name=data["name"],
                email=data["email"],
                department=data["department"],
                semester=data["semester"],
                parental_education=data["parental_education"],
                internet_access=data["internet_access"]
            )
            db.add(student)
            db.commit()

            record = AcademicRecordModel(
                student_id=data["student_id"],
                attendance_rate=data["attendance_rate"],
                study_hours_per_week=data["study_hours_per_week"],
                past_failures=data["past_failures"],
                assignment_rate=data["assignment_rate"],
                midterm1_score=data["midterm1_score"],
                midterm2_score=data["midterm2_score"]
            )
            db.add(record)
            db.commit()

            score, risk, prob, drivers, recs = score_student(
                midterm1=data["midterm1_score"],
                midterm2=data["midterm2_score"],
                attendance=data["attendance_rate"],
                study_hours=data["study_hours_per_week"],
                past_failures=data["past_failures"],
                assignment_rate=data["assignment_rate"]
            )

            pred = PredictionLogModel(
                student_id=data["student_id"],
                model_version="RandomForest_v1.0",
                predicted_final_score=score,
                risk_level=risk,
                risk_probability=prob,
                top_risk_factors=json.dumps(drivers),
                recommendations=json.dumps(recs)
            )
            db.add(pred)
            db.commit()
        print("[DB SEED] Successfully seeded initial student records.")
    db.close()

if __name__ == "__main__":
    init_and_seed_db()
