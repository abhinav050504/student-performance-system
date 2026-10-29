import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { StudentList } from './components/StudentList';
import { StudentProfileModal } from './components/StudentProfileModal';
import { PredictionSimulator } from './components/PredictionSimulator';
import { ModelInsights } from './components/ModelInsights';
import { DataDictionaryView } from './components/DataDictionaryView';
import { AddStudentModal } from './components/AddStudentModal';
import { mockStudents } from './data/mockData';
import type { Student } from './types/student';
import { AnimatePresence, motion } from 'framer-motion';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);

  React.useEffect(() => {
    const fetchStudentsFromDB = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/students/');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
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
    <div className="flex h-screen w-screen overflow-hidden bg-[#070b14] font-sans text-slate-100 relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Ambient Glowing Orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-indigo-600/15 to-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tl from-purple-600/15 to-pink-600/5 blur-[120px] pointer-events-none" />

      {/* Permanent Sleek Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          setSelectedStudent(null);
          setCurrentTab(tab);
        }} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        <div className="p-8 max-w-7xl w-full mx-auto pb-20">
          {/* Header pill indicator */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>AI Learning Analytics System</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                isLiveBackend 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 glow-emerald' 
                  : 'bg-white/[0.04] text-slate-400 border-white/10'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${isLiveBackend ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
                {isLiveBackend ? 'FastAPI & SQLite Database Connected' : 'Offline Mock Fallback'}
              </span>
            </div>
          </div>

          {/* View Routing with smooth fluid fade transitions */}
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <StudentProfileModal 
                key="student-modal"
                student={selectedStudent} 
                onBack={handleBackFromProfile} 
              />
            ) : (
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
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
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                  />
                )}
                {currentTab === 'predictor' && <PredictionSimulator />}
                {currentTab === 'insights' && <ModelInsights />}
                {currentTab === 'data-dictionary' && <DataDictionaryView />}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Student Registration Modal */}
          <AddStudentModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onStudentAdded={(newStudent) => {
              setStudents(prev => [newStudent, ...prev]);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
