import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Sparkles, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Student } from '../types/student';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: (student: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onStudentAdded }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState<number>(80);
  const [studyHours, setStudyHours] = useState<number>(8);
  const [pastFailures, setPastFailures] = useState<number>(0);
  const [midterm1, setMidterm1] = useState<number>(12);
  const [midterm2, setMidterm2] = useState<number>(13);
  const [assignmentRate, setAssignmentRate] = useState<number>(85);
  const [parentEdu] = useState<string>('Secondary');
  const [internetAccess] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentId || !email) {
      setErrorMsg('Please fill in all required institutional details');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const payload = {
        student_id: studentId.trim(),
        name: name.trim(),
        email: email.trim(),
        department: "Computer Science & Engineering",
        semester: 7,
        parental_education: parentEdu,
        internet_access: internetAccess,
        attendance_rate: attendance,
        study_hours_per_week: studyHours,
        past_failures: pastFailures,
        assignment_rate: assignmentRate,
        midterm1_score: midterm1,
        midterm2_score: midterm2
      };

      const res = await fetch('http://127.0.0.1:8000/api/students/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const d = await res.json();
        const newStudent: Student = {
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
          riskLevel: d.risk_level as any,
          riskProbability: d.risk_probability,
          topRiskFactors: d.top_risk_factors || [],
          recommendations: d.recommendations || [],
          recentAssessments: [
            { id: 'a1', name: 'Quiz 1', score: Math.round(d.midterm1_score * 0.9), maxScore: 20, weight: 15, date: '2026-08-20' },
            { id: 'a2', name: 'Assignment 1', score: Math.round(d.assignment_rate * 0.2), maxScore: 20, weight: 15, date: '2026-09-05' },
            { id: 'a3', name: 'Midterm G1', score: d.midterm1_score, maxScore: 20, weight: 35, date: '2026-09-20' },
            { id: 'a4', name: 'Midterm G2', score: d.midterm2_score, maxScore: 20, weight: 35, date: '2026-10-05' }
          ]
        };

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 }
        });

        onStudentAdded(newStudent);
        onClose();
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || 'Failed to save student record');
      }
    } catch {
      setErrorMsg('Could not connect to FastAPI backend server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl rounded-3xl glass-panel p-8 border border-white/10 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 blur-3xl pointer-events-none rounded-full" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Enroll New Student</h3>
                <p className="text-xs text-slate-400">Institutional record registration with instant ML risk evaluation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-6 relative z-10">
            {/* Demographic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aniket Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Roll Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 210097010088"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="aniket.singh@gcet.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Academic Inputs Grid */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <h4 className="text-xs font-extrabold text-indigo-300 flex items-center">
                <GraduationCap className="w-4 h-4 mr-1.5" />
                Academic Indicators for Machine Learning Model
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Midterm 1 (G1):</span>
                    <span className="font-bold text-indigo-400 font-mono">{midterm1}/20</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={midterm1}
                    onChange={(e) => setMidterm1(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Midterm 2 (G2):</span>
                    <span className="font-bold text-indigo-400 font-mono">{midterm2}/20</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={midterm2}
                    onChange={(e) => setMidterm2(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Attendance:</span>
                    <span className="font-bold text-indigo-400 font-mono">{attendance}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={attendance}
                    onChange={(e) => setAttendance(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Study Hrs/Wk:</span>
                    <span className="font-bold text-indigo-400 font-mono">{studyHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={studyHours}
                    onChange={(e) => setStudyHours(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Assignments:</span>
                    <span className="font-bold text-indigo-400 font-mono">{assignmentRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={assignmentRate}
                    onChange={(e) => setAssignmentRate(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Past Failures:</span>
                    <span className={`font-bold font-mono ${pastFailures > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {pastFailures}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={pastFailures}
                    onChange={(e) => setPastFailures(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all flex items-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving to SQLite & Running ML...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Save & Score Student
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
