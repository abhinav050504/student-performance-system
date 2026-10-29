import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: string; account_type?: string; student_id?: string | null }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [accountType, setAccountType] = useState<'student' | 'faculty'>('student');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Faculty Member');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const endpoint = isLoginMode 
        ? 'http://127.0.0.1:8000/api/auth/login'
        : 'http://127.0.0.1:8000/api/auth/register';

      const payload = isLoginMode 
        ? { email: email.trim(), password }
        : { 
            full_name: fullName.trim(), 
            email: email.trim(), 
            password, 
            account_type: accountType,
            role: accountType === 'student' ? 'Student' : role,
            student_id: accountType === 'student' ? studentId.trim() : ''
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('edupredict_token', data.access_token);
        localStorage.setItem('edupredict_user', JSON.stringify(data.user));

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });

        onLoginSuccess(data.user);
        onClose();
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      // Offline fallback mock demo login
      const mockUser = {
        name: isLoginMode ? (accountType === 'student' ? 'Student Account' : 'Faculty Member') : fullName || 'Aarav Sharma',
        email: email || (accountType === 'student' ? 'student@gcet.edu.in' : 'faculty@gcet.edu.in'),
        role: accountType === 'student' ? 'Student' : role,
        account_type: accountType,
        student_id: accountType === 'student' ? (studentId || '210097010001') : null
      };
      localStorage.setItem('edupredict_user', JSON.stringify(mockUser));
      onLoginSuccess(mockUser);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md rounded-3xl glass-panel p-8 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 blur-3xl pointer-events-none rounded-full" />

          {/* Modal Header */}
          <div className="text-center relative z-10">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              {isLoginMode ? 'Access Portal' : 'Create Account'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isLoginMode 
                ? 'Sign in to access student predictive intelligence' 
                : 'Register as a Student or Faculty Member'}
            </p>
          </div>

          {/* Account Type Selector (Student vs Faculty) */}
          <div className="mt-5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center relative z-10">
            <button
              type="button"
              onClick={() => { setAccountType('student'); setErrorMsg(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
                accountType === 'student'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => { setAccountType('faculty'); setErrorMsg(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
                accountType === 'faculty'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 relative z-10">
            {!isLoginMode && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder={accountType === 'student' ? "Aarav Sharma" : "Prof. Vipin Kumar"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {accountType === 'student' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">University Roll Number</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="210097010001"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={accountType === 'student' ? "student@gcet.edu.in" : "faculty@gcet.edu.in"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {!isLoginMode && accountType === 'faculty' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Department Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Faculty Member">Faculty Member / Subject Teacher</option>
                  <option value="Department Lead">Departmental Lead / HOD</option>
                  <option value="Academic Counselor">Academic Counselor / Mentor</option>
                </select>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isLoginMode ? `Sign In as ${accountType === 'student' ? 'Student' : 'Faculty'}` : `Complete ${accountType === 'student' ? 'Student' : 'Faculty'} Sign Up`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-5 text-center text-xs text-slate-400 relative z-10">
            {isLoginMode ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
            <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" /> Encrypted Session</span>
            <button onClick={onClose} className="hover:text-slate-300">Close</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
