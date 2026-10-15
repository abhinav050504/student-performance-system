import { 
  ArrowLeft, 
  Mail, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  Clock, 
  Wifi, 
  WifiOff 
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
    <div className="space-y-6">
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono">ID: {student.id}</span>
          <a
            href={`mailto:${student.email}`}
            className="inline-flex items-center text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            Contact Student
          </a>
        </div>
      </div>

      {/* Main Student Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-indigo-600/20">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                student.riskLevel === 'High Risk' 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : student.riskLevel === 'Medium Risk'
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}>
                {student.riskLevel} ({student.riskProbability}% Probability)
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Roll No: <span className="font-semibold text-slate-700">{student.studentId}</span> • {student.department} • Semester {student.semester}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{student.email}</p>
          </div>
        </div>

        {/* Prediction summary box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center space-x-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Midterm G1</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{student.midterm1Score} <span className="text-xs font-normal text-slate-400">/ 20</span></p>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Midterm G2</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{student.midterm2Score} <span className="text-xs font-normal text-slate-400">/ 20</span></p>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Predicted Final (G3)</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">
              {student.predictedFinalScore.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 20</span>
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Attendance Rate</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{student.attendanceRate}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full ${student.attendanceRate < 65 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${student.attendanceRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Required by college: 75% min</p>
        </div>

        {/* Study Hours */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Weekly Study</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{student.studyHoursPerWeek} hrs</div>
          <p className="text-xs text-slate-500 mt-2">Self-directed study time outside lectures</p>
        </div>

        {/* Assignments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Assignment Submission</span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{student.assignmentCompletionRate}%</div>
          <p className="text-xs text-slate-500 mt-2">Completed & verified on portal</p>
        </div>

        {/* Environment / Access */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Connectivity & Past</span>
            {student.internetAccess ? <Wifi className="w-4 h-4 text-emerald-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
          </div>
          <div className="text-sm font-semibold text-slate-800">
            {student.pastFailures === 0 ? 'No Prior Failures' : `${student.pastFailures} Prior Backlogs`}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Internet: <span className="font-medium text-slate-700">{student.internetAccess ? 'Home Broadband' : 'No Direct Access'}</span>
          </p>
        </div>
      </div>

      {/* Assessment History & Risk Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Assessment Performance History</h3>
          <p className="text-xs text-slate-500 mb-4">Chronological scores scaled out of 20 (Leakage-checked internal pipeline)</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 20]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} name="Score (/20)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diagnostic Risk Factors & Actionable Interventions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
              Diagnostic Factors & Decision Support
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Key drivers highlighted by model feature importance for early warning
            </p>

            {/* Primary Factors */}
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Identified Indicators:</p>
              {student.topRiskFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shrink-0"></span>
                  {factor}
                </div>
              ))}
            </div>

            {/* Actionable Recommendations */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Faculty Action Recommendations:</p>
              {student.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start text-xs text-indigo-900 bg-indigo-50/60 px-3 py-2 rounded-lg border border-indigo-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mr-2 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            *This system serves as decision-support guidance for mentors and does not replace faculty academic discretion.
          </div>
        </div>
      </div>
    </div>
  );
};
