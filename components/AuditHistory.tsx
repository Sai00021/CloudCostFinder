
import React from 'react';
import { AuditRecord } from '../types';

interface AuditHistoryProps {
  history: AuditRecord[];
}

export const AuditHistory: React.FC<AuditHistoryProps> = ({ history }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <i className="fas fa-history text-blue-600 dark:text-blue-400"></i>
        Audit Timeline
      </h3>
      
      {history.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-400 dark:text-slate-500 font-medium">No audit history found.</p>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Run your first audit to start tracking progress.</p>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
          {history.map((record, idx) => (
            <div key={record.id} className="relative pl-12">
              <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-sm flex items-center justify-center text-xs ${
                idx === 0 ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {idx + 1}
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {new Date(record.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                    +${record.savingsFound.toFixed(0)} Saved
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <i className="fas fa-bug text-[10px]"></i>
                    {record.leakCount} Leaks
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <i className="fas fa-leaf text-[10px]"></i>
                    {record.carbonSaved.toFixed(0)}kg CO₂
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
