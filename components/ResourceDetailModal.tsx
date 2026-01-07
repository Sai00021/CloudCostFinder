import React from 'react';
import { CostLeak } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ResourceDetailModalProps {
  leak: CostLeak;
  onClose: () => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ leak, onClose }) => {
  const mockUsageData = [
    { time: '00:00', usage: Math.random() * 20 },
    { time: '04:00', usage: Math.random() * 15 },
    { time: '08:00', usage: Math.random() * 10 },
    { time: '12:00', usage: Math.random() * 10 },
    { time: '16:00', usage: Math.random() * 12 },
    { time: '20:00', usage: Math.random() * 8 },
    { time: '23:59', usage: Math.random() * 5 },
  ];

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500 text-white';
      case 'WARNING': return 'bg-amber-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-4xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${getSeverityStyle(leak.severity)}`}>
              <i className={`fas ${leak.type === 'VM' ? 'fa-server' : leak.type === 'STORAGE' ? 'fa-database' : 'fa-microchip'} text-xl`}></i>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{leak.resourceName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{leak.type}</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{leak.region}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-rose-500 transition-colors w-10 h-10 rounded-full flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-900/20">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Economic Impact Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Leakage / Mo</p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tighter">-${leak.monthlyWaste.toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Carbon Waste</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{leak.carbonImpactKg}kg</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Priority</p>
              <p className={`text-[10px] font-black uppercase tracking-widest mt-2 px-2 py-1 rounded-lg border ${leak.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                {leak.severity}
              </p>
            </div>
          </div>

          {/* Infrastructure Context */}
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <i className="fas fa-fingerprint text-[100px]"></i>
             </div>
             <div className="relative z-10 grid grid-cols-2 gap-6">
                <div>
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Cloud Identifier</label>
                   <code className="text-xs font-mono text-blue-400 break-all">{leak.resourceId}</code>
                </div>
                <div>
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Availability Zone</label>
                   <p className="text-xs font-black uppercase tracking-widest">{leak.region}</p>
                </div>
             </div>
          </div>

          {/* Usage Pattern */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-wave-pulse text-blue-500"></i>
                Utilization Forensic (24h)
              </h4>
              <span className="text-[8px] font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full uppercase tracking-widest">
                High Latency / Idle
              </span>
            </div>
            <div className="h-40 w-full bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockUsageData}>
                  <defs>
                    <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#00000008" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 800 }} 
                  />
                  <Area type="monotone" dataKey="usage" stroke="#f43f5e" strokeWidth={3} fill="url(#usageGrad)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Root Cause Analysis */}
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Neural Root Cause Analysis</h4>
              <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800 p-6 rounded-[2rem] relative group">
                <div className="absolute top-4 right-4 text-blue-500/20 group-hover:text-blue-500 transition-colors">
                  <i className="fas fa-brain text-xl"></i>
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{leak.inDepthAnalysis || "Our neural engine identified a significant drift between provisioned capacity and actual request demand, likely originating from a legacy deployment cycle or lack of horizontal pod autoscaling configuration."}"
                </p>
                <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-800 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">
                     <i className="fas fa-robot"></i>
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Enforced Recommendation</p>
                     <p className="text-[11px] font-bold text-slate-900 dark:text-white">{leak.recommendation}</p>
                   </div>
                </div>
              </div>
            </div>

            {leak.taggingSuggestion && (
              <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 p-5 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
                  <i className="fas fa-tags text-sm"></i>
                </div>
                <div>
                  <h4 className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Metadata Compliance Hint</h4>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-snug">
                    {leak.taggingSuggestion}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-slate-800 dark:hover:text-white transition-all">Dismiss Forensic</button>
          <button className="flex-[1.5] py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
            <i className="fas fa-bolt-lightning"></i>
            Commit Strategic Remediation
          </button>
        </div>
      </div>
    </div>
  );
};