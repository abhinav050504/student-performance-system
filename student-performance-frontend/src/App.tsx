import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { StudentList } from './components/StudentList';
import { StudentProfileModal } from './components/StudentProfileModal';
import { PredictionSimulator } from './components/PredictionSimulator';
import { ModelInsights } from './components/ModelInsights';
import { DataDictionaryView } from './components/DataDictionaryView';
import { mockStudents } from './data/mockData';
import type { Student } from './types/student';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);

  React.useEffect(() => {
    const fetchStudentsFromDB = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/students/');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Map backend schema to frontend model
            const mapped: Student[] = data.map((d: any) => ({
              id: `s-${d.id}`,
              studentId: d.student_id,
              name: d.name,
              email: d.email,
              department: d.department,
              semester: d.semester,
              attendanceRate: d.attendance_rate,
              studyHoursPerWeek: d.study_hours_per_week,
              pastFailures: d.past_failures,
              parentalEducation: d.parental_education,
              internetAccess: d.internet_access,
              assignmentCompletionRate: d.assignment_rate,
              midterm1Score: d.midterm1_score,
              midterm2Score: d.midterm2_score,
              predictedFinalScore: d.predicted_final_score,
              riskLevel: d.risk_level,
              riskProbability: d.risk_probability,
              topRiskFactors: d.top_risk_factors || [],
              recommendations: d.recommendations || [],
              recentAssessments: [
                { id: 'a1', name: 'Quiz 1', score: Math.round(d.midterm1_score * 0.9), maxScore: 20, weight: 15, date: '2026-08-20' },
                { id: 'a2', name: 'Assignment 1', score: Math.round(d.assignment_rate * 0.2), maxScore: 20, weight: 15, date: '2026-09-05' },
                { id: 'a3', name: 'Midterm G1', score: d.midterm1_score, maxScore: 20, weight: 35, date: '2026-09-20' },
                { id: 'a4', name: 'Midterm G2', score: d.midterm2_score, maxScore: 20, weight: 35, date: '2026-10-05' }
              ]
            }));
            setStudents(mapped);
            setIsLiveBackend(true);
          }
        }
      } catch {
        setIsLiveBackend(false);
      }
    };

    fetchStudentsFromDB();
  }, []);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBackFromProfile = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Permanent Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          setSelectedStudent(null);
          setCurrentTab(tab);
        }} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* View Routing */}
        <div className="p-8 max-w-7xl w-full mx-auto pb-16">
          <div className="flex justify-end mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
              isLiveBackend 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isLiveBackend ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {isLiveBackend ? 'FastAPI & SQLite Database Connected' : 'Offline Mock Fallback'}
            </span>
          </div>
          {selectedStudent ? (
            <StudentProfileModal 
              student={selectedStudent} 
              onBack={handleBackFromProfile} 
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardOverview 
                  onSelectStudent={handleSelectStudent}
                  onNavigateToStudents={() => setCurrentTab('students')}
                />
              )}
              {currentTab === 'students' && (
                <StudentList 
                  students={students} 
                  onSelectStudent={handleSelectStudent} 
                />
              )}
              {currentTab === 'predictor' && <PredictionSimulator />}
              {currentTab === 'insights' && <ModelInsights />}
              {currentTab === 'data-dictionary' && <DataDictionaryView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
