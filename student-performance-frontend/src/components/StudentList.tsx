import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ChevronRight 
} from 'lucide-react';
import type { Student, RiskLevel } from '../types/student';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent }) => {
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
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> High Risk
          </span>
        );
      case 'Medium Risk':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1" /> Medium Risk
          </span>
        );
      case 'Low Risk':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Low Risk
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filter Badges & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            {(['All', 'High Risk', 'Medium Risk', 'Low Risk'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  riskFilter === lvl
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 border-l border-slate-200 pl-3">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-slate-700 border-none focus:outline-none cursor-pointer"
            >
              <option value="risk">Highest Risk First</option>
              <option value="attendance">Lowest Attendance First</option>
              <option value="predicted">Lowest Predicted Score</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Cards / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Study Hrs / Wk</th>
                <th className="py-3.5 px-4">G1 & G2 Scores</th>
                <th className="py-3.5 px-4">Predicted G3</th>
                <th className="py-3.5 px-4">Risk Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No students match your selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectStudent(student)}
                  >
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {student.name}
                      </div>
                      <div className="text-xs text-slate-500">{student.studentId} • {student.department}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${student.attendanceRate < 65 ? 'bg-red-500' : student.attendanceRate < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{student.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {student.studyHoursPerWeek} hrs
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <span className="font-semibold text-slate-900">{student.midterm1Score}</span> / 20 &nbsp;•&nbsp; 
                      <span className="font-semibold text-slate-900 ml-1">{student.midterm2Score}</span> / 20
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900">
                        {student.predictedFinalScore.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-400"> / 20</span>
                    </td>
                    <td className="py-4 px-4">
                      {getRiskBadge(student.riskLevel)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
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
    </div>
  );
};
