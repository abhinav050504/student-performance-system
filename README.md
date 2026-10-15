# AI-Powered Student Performance Analytics & Prediction System

An integrated learning analytics and classical machine learning decision-support platform designed to convert heterogeneous student academic and behavioural records into actionable academic insights and early risk predictions without deep learning black boxes.

## 🚀 System Architecture
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend Service**: FastAPI, Uvicorn, Pydantic.
- **Machine Learning Engine**: Scikit-Learn (Random Forest Regressor & Classifier, Ridge Regression baselines) with leakage-aware feature evaluation.
- **Data Layer**: Relational SQL Schema (PostgreSQL DDL) and UCI Student Performance dataset modeling.

## 📁 Repository Structure
```
student-performance-system/
├── student-performance-frontend/   # React + Vite application
│   ├── src/
│   │   ├── components/             # Dashboard, Student Directory, Simulator, Model Insights
│   │   ├── data/                   # Realistic student records & analytics
│   │   └── types/                  # TypeScript schemas
│   └── package.json
│
└── student-performance-backend/    # FastAPI application
    └── main.py                     # ML models & REST inference endpoints
```

## 🛠️ Getting Started

### 1. Run the Frontend
```bash
cd student-performance-frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 2. Run the Backend API
```bash
cd student-performance-backend
pip install fastapi uvicorn scikit-learn pandas numpy
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API docs available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).
