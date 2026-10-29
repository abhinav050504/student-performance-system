import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  BrainCircuit, 
  Database, 
  Sparkles,
  Zap,
  ShieldCheck,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: { name: string; email: string; role: string; student_id?: string | null } | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onTabChange, 
  currentUser, 
  onLogout 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'students', label: 'Student Directory', icon: Users, badge: 'DB' },
    { id: 'predictor', label: 'What-If Simulator', icon: Calculator, badge: 'ML' },
    { id: 'insights', label: 'Model Benchmarks', icon: BrainCircuit, badge: '5 Models' },
    { id: 'data-dictionary', label: 'SQL & Dictionary', icon: Database, badge: 'DDL' },
    { id: 'auth', label: currentUser ? 'My Account' : 'Sign In / Register', icon: UserPlus, badge: currentUser ? 'Active' : 'Auth' },
  ];

  return (
    <aside className="w-72 bg-slate-950/80 backdrop-blur-2xl text-slate-100 flex flex-col shrink-0 border-r border-white/10 select-none z-20 relative">
      {/* Ambient decorative glow in sidebar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 relative z-10 flex items-center space-x-3.5">
        <motion.div 
          whileHover={{ scale: 1.08, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="font-extrabold text-lg leading-tight tracking-tight text-white flex items-center">
            EduPredict <span className="text-indigo-400 font-normal ml-1">AI</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide flex items-center mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
            Decision Intelligence
          </p>
        </div>
      </div>

      {/* User Status Bar */}
      <div className="px-5 py-3 border-b border-white/5 relative z-10 flex items-center justify-between bg-white/[0.01]">
        {currentUser ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-indigo-300 font-medium">
                  {currentUser.role} {currentUser.student_id ? `(${currentUser.student_id})` : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-[10px] font-bold text-slate-400 hover:text-rose-400 px-2 py-1 rounded-md bg-white/[0.03] hover:bg-rose-500/10 transition-colors shrink-0 ml-1"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => onTabChange('auth')}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-200 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sign In or Sign Up</span>
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto relative z-10">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-widest uppercase text-slate-400">
          Navigation Modules
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full group relative flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/25 border border-indigo-400/30"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-md font-mono font-medium transition-all ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/[0.05] text-slate-400 group-hover:bg-white/[0.08] group-hover:text-slate-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Futuristic Bottom Status Widget */}
      <div className="p-4 m-4 rounded-2xl glass-panel relative z-10 overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-purple-500/20 blur-xl rounded-full" />
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300 mb-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
          <span>Leakage-Aware Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Pre-midterm isolation preventing artificial grade leakage ($G_1$ vs $G_3$).
        </p>
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center"><ShieldCheck className="w-3 h-3 text-emerald-400 mr-1" /> Verified</span>
          <span className="font-mono text-indigo-400">v2.4 Active</span>
        </div>
      </div>
    </aside>
  );
};
