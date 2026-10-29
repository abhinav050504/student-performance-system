import { 
  ArrowLeft, 
  Mail, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  Clock, 
  Wifi, 
  WifiOff,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { motion } from 'framer-motion';
import type { Student } from '../types/student';

interface StudentProfileModalProps {
  student: Student;
  onBack: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onBack }) => {
  const assessmentChartData = student.recentAssessments.map(a => ({
    name: a.name.split(':')[0],
    score: a.score,
    maxScore: a.maxScore,
    percentage: Math.round((a.score / a.maxScore) * 100)
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-7"
    >
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="inline-flex items-center text-xs font-bold text-slate-300 hover:text-white glass-panel px-4 py-2.5 rounded-2xl border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 text-indigo-400" />
          Back to Directory
        </motion.button>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono">ID: {student.id}</span>
          <a
            href={`mailto:${student.email}`}
            className="inline-flex items-center text-xs font-bold text-indigo-300 bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-500/40 px-3.5 py-2 rounded-xl transition-all"
          >
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            Contact Student
          </a>
        </div>
      </div>

      {/* Main Student Header Card */}
      <div className="p-8 rounded-3xl glass-panel relative overflow-hidden border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="absolute top-0 right-1/4 -mt-10 w-48 h-48 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full" />
        
        <div className="flex items-start space-x-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{student.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                student.riskLevel === 'High Risk' 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 glow-rose' 
                  : student.riskLevel === 'Medium Risk'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 glow-emerald'
              }`}>
                {student.riskLevel} ({student.riskProbability}% Probability)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Roll No: <span className="font-bold text-slate-200">{student.studentId}</span> • {student.department} • Semester {student.semester}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{student.email}</p>
          </div>
        </div>

        {/* Prediction summary box */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center space-x-6 relative z-10">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Midterm G1</p>
            <p className="text-lg font-bold text-white mt-0.5 font-mono">{student.midterm1Score} <span className="text-xs font-normal text-slate-400">/ 20</span></p>
          </div>
          <div className="border-l border-white/10 pl-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Midterm G2</p>
            <p className="text-lg font-bold text-white mt-0.5 font-mono">{student.midterm2Score} <span className="text-xs font-normal text-slate-400">/ 20</span></p>
          </div>
          <div className="border-l border-white/10 pl-6">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Projected Final G3</p>
            <p className="text-2xl font-black text-indigo-400 mt-0.5 font-mono">
              {student.predictedFinalScore.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 20</span>
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Attendance */}
        <div className="p-6 rounded-3xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Attendance Status</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{student.attendanceRate}%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full rounded-full ${student.attendanceRate < 65 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${student.attendanceRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2.5">Institutional Threshold: 75% min</p>
        </div>

        {/* Study Hours */}
        <div className="p-6 rounded-3xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Weekly Self-Study</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{student.studyHoursPerWeek} hrs</div>
          <p className="text-xs text-slate-400 mt-2">Independent study investment</p>
        </div>

        {/* Assignments */}
        <div className="p-6 rounded-3xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Submissions</span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{student.assignmentCompletionRate}%</div>
          <p className="text-xs text-slate-400 mt-2">Verified LMS coursework</p>
        </div>

        {/* Connectivity */}
        <div className="p-6 rounded-3xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Academic Record</span>
            {student.internetAccess ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
          </div>
          <div className="text-base font-bold text-white mt-1">
            {student.pastFailures === 0 ? 'Zero Past Backlogs' : `${student.pastFailures} Course Backlogs`}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Connectivity: <span className="font-semibold text-slate-200">{student.internetAccess ? 'Broadband Access' : 'No Home Internet'}</span>
          </p>
        </div>
      </div>

      {/* Assessment History & Diagnostic Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Chart */}
        <div className="p-7 rounded-3xl glass-panel">
          <h3 className="text-base font-extrabold text-white mb-1 flex items-center">
            <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
            Assessment Trajectory
          </h3>
          <p className="text-xs text-slate-400 mb-5">Chronological scores scaled out of 20 (Leakage-insulated)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 20]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} name="Score (/20)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainability Factors */}
        <div className="p-7 rounded-3xl glass-panel flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center">
              <AlertTriangle className="w-4 h-4 text-amber-400 mr-2" />
              Explainable AI Diagnostic Factors
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Key drivers highlighted by model feature importance for early decision support
            </p>

            {/* Drivers */}
            <div className="space-y-2.5 mb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Identified Vulnerabilities:</p>
              {student.topRiskFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center text-xs text-slate-200 bg-white/[0.03] px-3.5 py-2.5 rounded-xl border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mr-2.5 shrink-0" />
                  {factor}
                </div>
              ))}
            </div>

            {/* Actionable Recommendations */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Actionable Interventions:</p>
              {student.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start text-xs text-indigo-200 bg-indigo-500/10 px-3.5 py-2.5 rounded-xl border border-indigo-400/20">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2.5 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Decision-Support System</span>
            <span className="font-mono text-slate-400">Faculty Advisory</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
