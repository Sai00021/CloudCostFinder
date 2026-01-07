import React from 'react';

interface WasteScoreHeroProps {
  score: number;
  isAnalyzing: boolean;
}

export const WasteScoreHero: React.FC<WasteScoreHeroProps> = ({ score, isAnalyzing }) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getStatus = (s: number) => {
    if (s >= 90) return { label: 'Peak Efficiency', color: 'text-emerald-500', bg: 'bg-emerald-500', desc: 'Perfectly lean architecture.' };
    if (s >= 75) return { label: 'Optimal Health', color: 'text-blue-500', bg: 'bg-blue-500', desc: 'Minor resource leaks.' };
    if (s >= 50) return { label: 'Fund Erosion', color: 'text-amber-500', bg: 'bg-amber-500', desc: 'Idle capacity detected.' };
    return { label: 'Critical Waste', color: 'text-rose-500', bg: 'bg-rose-500', desc: 'Severe sub-utilization.' };
  };

  const status = getStatus(score);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center gap-6 overflow-hidden relative group transition-all animate-in slide-in-from-right duration-700 h-full">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
        <div className={`absolute inset-0 rounded-full blur-[30px] opacity-[0.1] ${status.bg} transition-all duration-1000 group-hover:scale-110`}></div>
        
        <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-md">
          <circle
            cx="80" cy="80" r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-50 dark:text-slate-800"
          />
          <circle
            cx="80" cy="80" r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={isAnalyzing ? circumference : offset}
            className={`${status.color} transition-all duration-2000 cubic-bezier(0.4, 0, 0.2, 1)`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className={`text-4xl font-black text-slate-950 dark:text-white tracking-tighter transition-all ${isAnalyzing ? 'animate-pulse opacity-50' : 'text-glow'}`}>
            {isAnalyzing ? '..' : score}
          </span>
          <span className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Efficiency Index</span>
        </div>
      </div>

      <div className="text-center relative z-10 space-y-2">
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="text-base font-black text-slate-950 dark:text-white tracking-tight uppercase leading-none">{status.label}</h3>
          <div className={`${status.bg} text-white text-[7px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-md shadow-black/10`}>
            Posture Verified
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium leading-tight max-w-[160px] mx-auto">
          {status.desc} Neural auditing active.
        </p>
      </div>
    </div>
  );
};