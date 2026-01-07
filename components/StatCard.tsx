import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
  variant?: 'default' | 'score';
  scoreValue?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, trend, variant = 'default', scoreValue }) => {
  if (variant === 'score') {
    const scoreColor = (scoreValue || 0) > 80 ? 'text-emerald-500' : (scoreValue || 0) > 50 ? 'text-amber-500' : 'text-rose-500';
    const barColor = (scoreValue || 0) > 80 ? 'bg-emerald-500' : (scoreValue || 0) > 50 ? 'bg-amber-500' : 'bg-rose-500';

    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 transition-all hover:translate-y-[-2px] hover:shadow-xl relative overflow-hidden animate-in fade-in duration-500 h-full flex flex-col justify-between">
        <div className="absolute top-0 left-0 w-1 h-full opacity-40 rounded-full" style={{ backgroundColor: barColor.replace('bg-', '') }}></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${color}`}>
            <i className={`fas ${icon} text-lg`}></i>
          </div>
          <span className={`text-2xl font-black tracking-tighter ${scoreColor}`}>{scoreValue}</span>
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
          <div className="w-full bg-slate-50 dark:bg-slate-800/50 h-2 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
            <div className={`h-full ${barColor} transition-all duration-1500 ease-out shadow-lg`} style={{ width: `${scoreValue}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 flex items-start gap-4 transition-all hover:translate-y-[-2px] hover:shadow-xl group relative overflow-hidden animate-in fade-in duration-500 h-full">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-2xl transition-all duration-700 group-hover:scale-110 flex-shrink-0 ${color} relative z-10`}>
        <i className={`fas ${icon} text-xl`}></i>
      </div>
      
      <div className="space-y-1 relative z-10 overflow-hidden">
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter leading-tight truncate">{value}</h3>
        {trend && (
          <div className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2 py-1 rounded-md ${trend.includes('+') ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30'} uppercase tracking-widest mt-2 border border-black/5`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};