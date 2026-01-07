import React from 'react';
import { LegalTab } from './LegalModal';

interface ComplianceSupportCardProps {
  onOpenLegal: (tab: LegalTab) => void;
}

export const ComplianceSupportCard: React.FC<ComplianceSupportCardProps> = ({ onOpenLegal }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
        <i className="fas fa-scale-balanced text-[60px] text-slate-900 dark:text-white"></i>
      </div>

      <h3 className="font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]">
        <i className="fas fa-shield-check text-blue-600"></i>
        Trust & Compliance Hub
      </h3>

      <div className="grid grid-cols-1 gap-2.5 mb-6">
        <button 
          onClick={() => onOpenLegal('TOS')}
          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-slate-800 transition-all text-left group/item"
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-file-contract text-slate-400 group-hover/item:text-blue-500 text-xs"></i>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Terms of Service</span>
          </div>
          <i className="fas fa-chevron-right text-[8px] text-slate-300 group-hover/item:translate-x-1 transition-transform"></i>
        </button>

        <button 
          onClick={() => onOpenLegal('PRIVACY')}
          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-slate-800 transition-all text-left group/item"
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-user-lock text-slate-400 group-hover/item:text-blue-500 text-xs"></i>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Privacy Protocol</span>
          </div>
          <i className="fas fa-chevron-right text-[8px] text-slate-300 group-hover/item:translate-x-1 transition-transform"></i>
        </button>
      </div>

      <div className="p-4 bg-slate-950 dark:bg-slate-800 rounded-2xl border border-white/5 shadow-inner">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Support Uplink: Online</span>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-black text-white flex items-center gap-2">
            <i className="fas fa-headset text-blue-400"></i>
            +1 (888) FIN-OPS-911
          </p>
          <button 
            onClick={() => onOpenLegal('SUPPORT')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
          >
            Access Concierge
          </button>
        </div>
      </div>
    </div>
  );
};