import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Users,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Student, RiskLevel } from '../types/student';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenAddModal?: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent, onOpenAddModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [sortBy, setSortBy] = useState<'name' | 'attendance' | 'predicted' | 'risk'>('risk');

  const filtered = students.filter(student => {
    const matchesQuery = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.includes(searchQuery) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = riskFilter === 'All' || student.riskLevel === riskFilter;

    return matchesQuery && matchesRisk;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'attendance') return a.attendanceRate - b.attendanceRate;
    if (sortBy === 'predicted') return a.predictedFinalScore - b.predictedFinalScore;
    if (sortBy === 'risk') return b.riskProbability - a.riskProbability;
    return 0;
  });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'High Risk':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-400" /> High Risk
          </span>
        );
      case 'Medium Risk':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-400" /> Medium Risk
          </span>
        );
      case 'Low Risk':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Safe (Low)
          </span>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Search and Filters Header */}
      <div className="p-6 rounded-3xl glass-panel flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Filter Badges & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 text-xs font-semibold">
            {(['All', 'High Risk', 'Medium Risk', 'Low Risk'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  riskFilter === lvl
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 border-l border-white/10 pl-3">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 font-semibold text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="risk">Highest Risk First</option>
              <option value="attendance">Lowest Attendance First</option>
              <option value="predicted">Lowest Predicted Score</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {onOpenAddModal && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAddModal}
              className="inline-flex items-center text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/25 transition-all ml-2"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Enroll Student
            </motion.button>
          )}
        </div>
      </div>

      {/* Student Cards / Table */}
      <div className="rounded-3xl glass-panel overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-slate-400 font-extrabold text-xs border-b border-white/10 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5">Student</th>
                <th className="py-4 px-5">Attendance</th>
                <th className="py-4 px-5">Study Hrs / Wk</th>
                <th className="py-4 px-5">G1 & G2 Scores</th>
                <th className="py-4 px-5">Predicted G3</th>
                <th className="py-4 px-5">Risk Classification</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    No students match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    onClick={() => onSelectStudent(student)}
                  >
                    <td className="py-4 px-5">
                      <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {student.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">{student.studentId} • {student.department}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${student.attendanceRate < 65 ? 'bg-rose-500' : student.attendanceRate < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-300 font-mono">{student.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-300 font-medium">
                      {student.studyHoursPerWeek} hrs
                    </td>
                    <td className="py-4 px-5 text-slate-300 font-mono">
                      <span className="font-bold text-white">{student.midterm1Score}</span> / 20 &nbsp;•&nbsp; 
                      <span className="font-bold text-white ml-1">{student.midterm2Score}</span> / 20
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-extrabold text-white text-base">
                        {student.predictedFinalScore.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-400 font-normal"> / 20</span>
                    </td>
                    <td className="py-4 px-5">
                      {getRiskBadge(student.riskLevel)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        className="inline-flex items-center text-xs font-bold text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        Inspect <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
