import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight, 
  ChevronRight,
  ShieldAlert,
  Flame,
  Award
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
import { motion } from 'framer-motion';
import { mockClassStatistics, mockStudents } from '../data/mockData';
import type { Student } from '../types/student';

interface DashboardOverviewProps {
  onSelectStudent: (student: Student) => void;
  onNavigateToStudents: () => void;
}

const COLORS = ['#f43f5e', '#f59e0b', '#10b981'];

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
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-7"
    >
      {/* Hero Welcome Card with Ambient Gradient */}
      <div className="relative overflow-hidden rounded-3xl p-8 glass-panel border border-white/10 shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 -mt-10 w-72 h-72 bg-indigo-500/15 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mr-10 -mb-10 w-80 h-80 bg-purple-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Learning Analytics & AI Diagnostic</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Cohort Performance <span className="gradient-text">Intelligence</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
              Early detection engine evaluating academic trends, behavioural attendance signals, and continuous final score projections ($G_3$).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
              <div className="text-slate-400 font-medium">Evaluation Cycle</div>
              <div className="text-white font-bold flex items-center mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
                Midterm 2 Benchmark
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-xs text-indigo-300 font-bold">
              Random Forest Regressor
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-3xl glass-card relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cohort Enrolled</span>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white tracking-tight">{stats.totalStudents}</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <span className="text-emerald-400 font-bold mr-1">100%</span> active students tracked
            </p>
          </div>
        </motion.div>

        {/* High Risk Flag */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-3xl glass-card glow-rose relative overflow-hidden border-rose-500/30 bg-rose-950/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Critical Risk</span>
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-rose-400 tracking-tight">{stats.highRiskCount}</h3>
            <p className="text-xs text-rose-300/80 mt-1 font-medium flex items-center">
              <Flame className="w-3.5 h-3.5 mr-1 text-rose-400" /> Immediate intervention advised
            </p>
          </div>
        </motion.div>

        {/* Cohort Attendance */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-3xl glass-card relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Attendance</span>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white tracking-tight">{stats.averageAttendance}%</h3>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                style={{ width: `${stats.averageAttendance}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Projected Mean Final Score */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-3xl glass-card relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projected G3 Mean</span>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-emerald-400 tracking-tight">
              {stats.averagePredictedScore} <span className="text-sm font-normal text-slate-400">/ 20</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" /> Pass Benchmark: 10.0 / 20
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Evolution Line Chart */}
        <div className="lg:col-span-2 p-7 rounded-3xl glass-panel relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-white">Dynamic Risk Trajectory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Evolution of student vulnerability tiers across assessment cycles</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5" /> High</span>
              <span className="flex items-center text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5" /> Medium</span>
              <span className="flex items-center text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" /> Low</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.riskTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                />
                <Line type="monotone" dataKey="highRisk" name="High Risk" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="mediumRisk" name="Medium Risk" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} />
                <Line type="monotone" dataKey="lowRisk" name="Safe" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="p-7 rounded-3xl glass-panel flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white">Risk Segmentation</h3>
            <p className="text-xs text-slate-400 mt-0.5">Cohort breakdown by machine learning tier</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={92}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {riskPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
              <span className="flex items-center text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2" />High Risk</span>
              <span className="font-bold text-rose-400">{stats.highRiskCount} ({Math.round(stats.highRiskCount / stats.totalStudents * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
              <span className="flex items-center text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />Medium Risk</span>
              <span className="font-bold text-amber-400">{stats.mediumRiskCount} ({Math.round(stats.mediumRiskCount / stats.totalStudents * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
              <span className="flex items-center text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />Low Risk</span>
              <span className="font-bold text-emerald-400">{stats.lowRiskCount} ({Math.round(stats.lowRiskCount / stats.totalStudents * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Action Table & Projected Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution */}
        <div className="p-7 rounded-3xl glass-panel">
          <h3 className="text-lg font-extrabold text-white">Projected Final Grade Distribution</h3>
          <p className="text-xs text-slate-400 mt-0.5">Predicted score histogram across UCI 0–20 brackets</p>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Attention List */}
        <div className="p-7 rounded-3xl glass-panel lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center">
                  <ShieldAlert className="w-5 h-5 text-rose-400 mr-2" />
                  Urgent Faculty Intervention Flagged
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Students exhibiting compound risk: attendance deficit and midterm decline</p>
              </div>
              <button 
                onClick={onNavigateToStudents}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center transition-colors px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5"
              >
                All Students <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Student</th>
                    <th className="py-3 px-3">Attendance</th>
                    <th className="py-3 px-3">Midterms (G1/G2)</th>
                    <th className="py-3 px-3">Predicted G3</th>
                    <th className="py-3 px-3">Top Risk Indicator</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {highRiskStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{student.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{student.studentId}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                          {student.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-semibold font-mono">
                        {student.midterm1Score} / {student.midterm2Score}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-rose-400 bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/30">
                          {student.predictedFinalScore.toFixed(1)} / 20
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                        {student.topRiskFactors[0]}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-200 border border-indigo-400/30 font-semibold transition-all hover:scale-105"
                        >
                          Profile <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <span>*Continuous inference engine without target leakage</span>
            <span className="text-slate-400 font-mono">Model v2.4</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
