import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  BrainCircuit, 
  Database, 
  GraduationCap 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'predictor', label: 'What-If ML Simulator', icon: Calculator },
    { id: 'insights', label: 'Feature & Model Analytics', icon: BrainCircuit },
    { id: 'data-dictionary', label: 'Data Dictionary & SQL', icon: Database },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight tracking-tight text-white">EduPredict AI</h1>
          <p className="text-xs text-slate-400">Student Analytics System</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Main Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 m-3 rounded-xl border">
        <div className="flex items-center space-x-2 text-xs font-medium text-emerald-400 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Decision Support Mode</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Leakage-aware early risk detection without deep learning black boxes.
        </p>
      </div>
    </aside>
  );
};
