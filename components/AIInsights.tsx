import React from 'react';

interface AIInsightsProps {
  summary: string;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-100/40 to-blue-100/40 dark:from-slate-900/60 dark:to-slate-800/90 border-[3px] border-indigo-200/40 dark:border-slate-700 rounded-3xl px-8 py-6 relative overflow-hidden transition-all shadow-xl flex flex-col md:flex-row items-center gap-8 group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.04] -translate-y-1/4 translate-x-1/4 group-hover:scale-105 transition-transform duration-2000">
        <i className="fas fa-brain text-[120px] text-indigo-900 dark:text-blue-400"></i>
      </div>
      <div className="flex-shrink-0 flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-600 dark:bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 group-hover:rotate-6 transition-all duration-700">
          <i className="fas fa-robot text-2xl"></i>
        </div>
        <div>
          <span className="bg-indigo-600 dark:bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl border border-white/20">Executive Briefing</span>
        </div>
      </div>
      <p className="text-indigo-950 dark:text-slate-100 leading-relaxed text-base font-bold flex-1 relative z-10 tracking-tight">
        {summary}
      </p>
    </div>
  );
};