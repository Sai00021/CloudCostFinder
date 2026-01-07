import React, { useMemo } from 'react';
import { CostLeak } from '../types';

interface LeakListProps {
  leaks: CostLeak[];
  onSelectLeak: (leak: CostLeak) => void;
  onManageTags: (resourceId: string) => void;
  onSnoozeLeak: (leak: CostLeak) => void;
  onUpdateDueDate: (resourceId: string, date: string) => void;
  onFix: (leak: CostLeak) => void;
}

type SortOption = 'HIGHEST_SAVINGS' | 'LOWEST_SAVINGS' | 'SEVERITY' | 'TYPE' | 'DUE_DATE';

export const LeakList: React.FC<LeakListProps> = ({ 
  leaks, onSelectLeak, onManageTags, onSnoozeLeak, onUpdateDueDate, onFix 
}) => {
  const [sortBy, setSortBy] = React.useState<SortOption>('HIGHEST_SAVINGS');

  const getSeverityPriority = (sev: string) => {
    switch(sev) {
      case 'CRITICAL': return 3;
      case 'WARNING': return 2;
      case 'INFO': return 1;
      default: return 0;
    }
  };

  const sortedLeaks = useMemo(() => {
    const list = [...leaks];
    switch (sortBy) {
      case 'HIGHEST_SAVINGS': return list.sort((a, b) => b.monthlyWaste - a.monthlyWaste);
      case 'LOWEST_SAVINGS': return list.sort((a, b) => a.monthlyWaste - b.monthlyWaste);
      case 'SEVERITY': return list.sort((a, b) => getSeverityPriority(b.severity) - getSeverityPriority(a.severity));
      case 'TYPE': return list.sort((a, b) => a.type.localeCompare(b.type));
      case 'DUE_DATE': return list.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      default: return list;
    }
  }, [leaks, sortBy]);

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'CRITICAL': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800';
      case 'WARNING': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800';
      default: return 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'VM': return 'fa-server';
      case 'STORAGE': return 'fa-database';
      case 'SQL': return 'fa-table-list';
      case 'API': return 'fa-bolt';
      case 'GKE': return 'fa-network-wired';
      case 'FUNC': return 'fa-bolt-lightning';
      default: return 'fa-cube';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex justify-between items-center gap-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Detected Cost Leaks</h3>
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 shadow-md">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order By:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-[11px] font-black text-slate-700 dark:text-slate-200 bg-transparent outline-none cursor-pointer uppercase tracking-widest border-none focus:ring-0"
          >
            <option value="HIGHEST_SAVINGS">Waste Impact</option>
            <option value="SEVERITY">Priority Level</option>
            <option value="TYPE">Resource Class</option>
            <option value="DUE_DATE">Due Date</option>
          </select>
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waste Impact</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity</th>
              <th className="px-6 py-4 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/5">Tagging Suggestion</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendation</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedLeaks.map((leak, idx) => (
              <tr 
                key={`${leak.resourceId}-${idx}`}
                onClick={() => onSelectLeak(leak)}
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                      <i className={`fas ${getIcon(leak.type)} text-lg`}></i>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight truncate max-w-[140px]">{leak.resourceName}</p>
                      <p className="text-[9px] text-slate-400 font-mono tracking-tighter">{leak.resourceId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-rose-600 dark:text-rose-400 font-black text-lg tracking-tighter">-${leak.monthlyWaste.toFixed(0)}</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <i className="fas fa-leaf text-[10px]"></i> {leak.carbonImpactKg}kg
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-[8px] px-2.5 py-1 rounded-full border font-black uppercase tracking-widest inline-block ${getSeverityColor(leak.severity)}`}>
                    {leak.severity}
                  </span>
                </td>
                <td className="px-6 py-5 bg-amber-500/5">
                  <div className="flex items-start gap-2 max-w-[180px]">
                    <i className="fas fa-tags text-amber-500 text-xs mt-0.5"></i>
                    <p className="text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                      {leak.taggingSuggestion || 'Standard compliance baseline required'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="max-w-[240px]">
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 italic">"{leak.finding}"</p>
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Rec: {leak.recommendation}</p>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onFix(leak); }}
                      className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-md active:scale-90"
                      title="Commit Fix"
                    >
                      <i className="fas fa-bolt-lightning text-xs"></i>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSnoozeLeak(leak); }}
                      className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-md active:scale-90"
                      title="Snooze"
                    >
                      <i className="fas fa-clock text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Fall-back) */}
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {sortedLeaks.map((leak, idx) => (
          <div 
            key={`${leak.resourceId}-${idx}`} 
            onClick={() => onSelectLeak(leak)}
            className="p-6 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-all group border-l-[6px] border-transparent hover:border-blue-600"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-slate-400 group-hover:text-blue-600 transition-all shadow-md">
                    <i className={`fas ${getIcon(leak.type)} text-xl`}></i>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-900 dark:text-white tracking-tighter leading-none uppercase">{leak.resourceName}</h4>
                    <span className={`text-[8px] px-2.5 py-1 rounded-full border font-black uppercase tracking-widest mt-1 inline-block ${getSeverityColor(leak.severity)}`}>
                      {leak.severity}
                    </span>
                  </div>
                </div>
                <span className="text-rose-600 dark:text-rose-400 font-black text-2xl tracking-tighter">-${leak.monthlyWaste.toFixed(0)}</span>
              </div>

              <div className="space-y-3">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 p-3 rounded-xl">
                  <label className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1 block">Tagging Suggestion</label>
                  <div className="flex gap-2">
                    <i className="fas fa-tags text-amber-500 text-[10px] mt-0.5"></i>
                    <p className="text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-snug">{leak.taggingSuggestion || 'Standard compliance baseline required'}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <label className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1 block">Rec: {leak.recommendation}</label>
                  <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 leading-snug">"{leak.finding}"</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onFix(leak); }}
                  className="flex-1 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest py-3 flex items-center justify-center gap-2 shadow-xl active:scale-95"
                >
                  <i className="fas fa-bolt-lightning"></i> Commit Fix
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onSnoozeLeak(leak); }}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest py-3 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 active:scale-95"
                >
                  <i className="fas fa-clock"></i> Snooze
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};