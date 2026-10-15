import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ChevronRight 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { mockClassStatistics, mockStudents } from '../data/mockData';
import type { Student } from '../types/student';

interface DashboardOverviewProps {
  onSelectStudent: (student: Student) => void;
  onNavigateToStudents: () => void;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onSelectStudent, 
  onNavigateToStudents 
}) => {
  const stats = mockClassStatistics;
  const highRiskStudents = mockStudents.filter(s => s.riskLevel === 'High Risk');

  const riskPieData = [
    { name: 'High Risk', value: stats.highRiskCount },
    { name: 'Medium Risk', value: stats.mediumRiskCount },
    { name: 'Low Risk', value: stats.lowRiskCount }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Analytics & Risk Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">
            Department of Computer Science & Engineering • 7th Semester Cohort Monitoring
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Midterm 2 Evaluation Window
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
            Classical ML: Random Forest
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalStudents}</h3>
            <p className="text-xs text-slate-500 mt-1">Active B.Tech students</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* High Risk Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">High Academic Risk</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">{stats.highRiskCount}</h3>
            <p className="text-xs text-red-500 mt-1">Requires immediate intervention</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Average Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cohort Attendance</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.averageAttendance}%</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +2.1% from last month
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Projected Mean Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Projected Mean (G3)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.averagePredictedScore} / 20</h3>
            <p className="text-xs text-slate-500 mt-1">Passing threshold: 10.0</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic Risk Evolution Across Weeks</h3>
              <p className="text-xs text-slate-500">Temporal change in student risk status from baseline to post-G2</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-md">
              Semester Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.riskTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }}
                />
                <Line type="monotone" dataKey="highRisk" name="High Risk" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="mediumRisk" name="Medium Risk" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="lowRisk" name="Low Risk (Safe)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Risk Segmentation</h3>
            <p className="text-xs text-slate-500 mt-1">Class breakdown by current classification</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>High Risk</span>
              <span className="font-semibold">{stats.highRiskCount} ({Math.round(stats.highRiskCount / stats.totalStudents * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></span>Medium Risk</span>
              <span className="font-semibold">{stats.mediumRiskCount} ({Math.round(stats.mediumRiskCount / stats.totalStudents * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>Low Risk</span>
              <span className="font-semibold">{stats.lowRiskCount} ({Math.round(stats.lowRiskCount / stats.totalStudents * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution & Critical Attention List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs lg:col-span-1">
          <h3 className="text-base font-bold text-slate-900">Projected Grade Distribution</h3>
          <p className="text-xs text-slate-500 mt-1">Expected final grade spread out of 20 (UCI scale)</p>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Action Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Urgent Intervention Recommended</h3>
                <p className="text-xs text-slate-500">Students flagged as High Academic Risk during early assessment review</p>
              </div>
              <button 
                onClick={onNavigateToStudents}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center"
              >
                View all students <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Midterm (G1/G2)</th>
                    <th className="py-2.5 px-3">Predicted G3</th>
                    <th className="py-2.5 px-3">Risk Factor</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {highRiskStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.studentId}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-semibold ${student.attendanceRate < 65 ? 'text-red-600' : 'text-amber-600'}`}>
                          {student.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {student.midterm1Score} / {student.midterm2Score}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-bold bg-red-50 text-red-600 border border-red-200">
                          {student.predictedFinalScore.toFixed(1)} / 20
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                        {student.topRiskFactors[0]}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="inline-flex items-center px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors"
                        >
                          Profile <ArrowUpRight className="w-3 h-3 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>*Based on classical ML probability scoring (Leakage-checked: G1, G2, Attendance, Submissions)</span>
            <span className="font-medium text-slate-500">Updated: Today, 08:30 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
