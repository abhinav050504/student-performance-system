import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from typing import Tuple, List

# Initialize and train baseline models
# Features: [G1, G2, attendance, study_hours, past_failures, assignment_rate]
np.random.seed(42)
N_SAMPLES = 800

syn_g1 = np.random.normal(11.5, 3.2, N_SAMPLES).clip(0, 20)
syn_g2 = (0.75 * syn_g1 + np.random.normal(2.5, 2.0, N_SAMPLES)).clip(0, 20)
syn_att = np.random.normal(78, 14, N_SAMPLES).clip(30, 100)
syn_study = np.random.normal(8, 4, N_SAMPLES).clip(1, 30)
syn_failures = np.random.choice([0, 1, 2, 3], size=N_SAMPLES, p=[0.75, 0.15, 0.07, 0.03])
syn_assignments = np.random.normal(75, 18, N_SAMPLES).clip(20, 100)

syn_g3 = (
    0.50 * syn_g2 +
    0.30 * syn_g1 +
    0.02 * syn_att +
    0.10 * syn_study -
    1.20 * syn_failures +
    0.015 * syn_assignments +
    np.random.normal(0, 1.2, N_SAMPLES)
).clip(0, 20)

X_train = np.column_stack([syn_g1, syn_g2, syn_att, syn_study, syn_failures, syn_assignments])
y_train_score = syn_g3
y_train_risk = (syn_g3 < 10).astype(int)

# Fit models
regressor = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
regressor.fit(X_train, y_train_score)

classifier = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
classifier.fit(X_train, y_train_risk)

def score_student(
    midterm1: float,
    midterm2: float,
    attendance: float,
    study_hours: float,
    past_failures: int,
    assignment_rate: float
) -> Tuple[float, str, float, List[str], List[str]]:
    """Evaluates student features and returns (predicted_score, risk_level, risk_prob, drivers, recommendations)"""
    features = np.array([[midterm1, midterm2, attendance, study_hours, past_failures, assignment_rate]])
    
    score = float(regressor.predict(features)[0])
    score = round(max(0.0, min(20.0, score)), 1)
    
    prob = float(classifier.predict_proba(features)[0][1]) * 100
    prob = round(prob, 1)

    if score < 10.0 or prob >= 65:
        risk_level = "High Risk"
    elif score < 13.0 or prob >= 35:
        risk_level = "Medium Risk"
    else:
        risk_level = "Low Risk"

    drivers = []
    recs = []

    if attendance < 75:
        drivers.append(f"Low Attendance ({attendance}%)")
        recs.append("Mandatory attendance recovery review")
    if past_failures > 0:
        drivers.append(f"{past_failures} Prior Subject Backlogs")
        recs.append("Remedial tutorials on prerequisite foundations")
    if midterm2 < midterm1:
        drivers.append(f"Midterm score decline (G1: {midterm1} to G2: {midterm2})")
        recs.append("Faculty 1-on-1 concept evaluation")
    if study_hours < 6:
        drivers.append(f"Low self-study time ({study_hours} hrs/week)")
        recs.append("Structured library & guided study allocation")

    if not drivers:
        drivers.append("Consistent academic progression")
        recs.append("Nominate for peer tutor / honors track")

    return score, risk_level, prob, drivers, recs
