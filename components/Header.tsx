
import React, { useState } from 'react';
import { NotificationCenter } from './NotificationCenter';
import { ThemeSwitcher } from './ThemeSwitcher';
import { User } from '../types';

interface HeaderProps {
  onAnalyze: () => void;
  onOpenSettings: () => void;
  onOpenIdentity: () => void;
  onOpenBilling: () => void;
  onOpenSearch: () => void;
  onOpenAutoKill: () => void;
  isAnalyzing: boolean;
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAnalyze, onOpenSettings, onOpenIdentity, onOpenBilling, onOpenSearch, onOpenAutoKill, isAnalyzing, user, onLogout 
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border-b border-slate-100 dark:border-slate-800 px-4 py-2 flex items-center justify-between sticky top-0 z-50 transition-all shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-slate-950 dark:bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 shimmer opacity-25"></div>
          <i className="fas fa-money-bill-trend-up text-white text-sm relative z-10 transition-transform group-hover:scale-110 duration-500"></i>
        </div>
        <div className="hidden md:block">
          <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">Leak Finder <span className="text-blue-600">v4</span></h1>
          <div className="flex items-center gap-1 mt-0.5">
             <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[6px] text-slate-400 font-black uppercase tracking-widest">Neural Active</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenSearch}
          title="Search Infrastructure (Cmd+K)"
          className="w-8 h-8 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all flex items-center justify-center text-slate-400 text-xs border border-slate-100 dark:border-slate-700"
        >
          <i className="fas fa-search"></i>
        </button>

        <button 
          onClick={onOpenAutoKill}
          title="Autonomous Remediation Policies"
          className="w-8 h-8 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all flex items-center justify-center text-slate-400 hover:text-rose-500 text-xs border border-slate-100 dark:border-slate-700"
        >
          <i className="fas fa-shield-halved"></i>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <NotificationCenter />
        </div>
        
        <button 
          data-tour="global-audit"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[8px] transition-all shadow-md uppercase tracking-widest active:scale-95 group/audit ${
            isAnalyzing 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
            : 'bg-slate-950 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-50 text-white dark:text-slate-950'
          }`}
        >
          {isAnalyzing ? (
            <><i className="fas fa-circle-notch fa-spin"></i> Audit...</>
          ) : (
            <><i className="fas fa-bolt text-amber-400 group-hover/audit:animate-bounce"></i> Tactical Scan</>
          )}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
          >
            <img src={user?.avatar} className="w-7 h-7 rounded shadow-lg group-hover:scale-105 duration-500" alt="User Avatar" />
            <i className={`fas fa-chevron-down text-[7px] text-slate-300 mr-1 transition-transform duration-500 ${isUserMenuOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-[140]" onClick={() => setIsUserMenuOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-premium border border-slate-100 dark:border-slate-800 z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <img src={user?.avatar} className="w-8 h-8 rounded-lg shadow-md" alt="Profile" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{user?.role}</p>
                    </div>
                </div>
                <div className="p-1 space-y-0.5">
                  <button onClick={() => { setIsUserMenuOpen(false); onOpenIdentity(); }} className="w-full text-left px-3 py-2 text-[8px] font-black text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded transition-all flex items-center gap-2 group/item">
                    <i className="fas fa-user-shield opacity-40 group-hover/item:opacity-100"></i> Identity
                  </button>
                  <button onClick={() => { setIsUserMenuOpen(false); onOpenBilling(); }} className="w-full text-left px-3 py-2 text-[8px] font-black text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded transition-all flex items-center gap-2 group/item">
                    <i className="fas fa-credit-card opacity-40 group-hover/item:opacity-100"></i> Billing
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                  <button onClick={() => { setIsUserMenuOpen(false); onLogout(); }} className="w-full text-left px-3 py-2 text-[8px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-all flex items-center gap-2 group/item">
                    <i className="fas fa-right-from-bracket group-hover/item:translate-x-1 transition-transform"></i> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
