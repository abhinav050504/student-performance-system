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
                  students={mockStudents} 
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
