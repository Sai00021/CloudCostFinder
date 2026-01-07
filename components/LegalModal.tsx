import React, { useState, useEffect } from 'react';

export type LegalTab = 'TOS' | 'PRIVACY' | 'SUPPORT';

interface LegalModalProps {
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({ onClose, initialTab = 'TOS' }) => {
  const [tab, setTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const content = {
    TOS: {
      title: 'Terms of Service',
      body: `By using Leak Finder v4 Platinum Edition, you authorize our platform to perform strategic telemetry scans of your multi-cloud infrastructure. 

1. AUTHORIZATION: You grant Leak Finder the necessary permissions to analyze metadata, billing exports, and resource configurations via read-only cloud service accounts.
2. REMEDIATION: The "Auto-Remediation" and "Commit Fix" features perform write actions on your cloud environment. While our Neural Core provides high-confidence suggestions, you are solely responsible for verifying that these actions do not disrupt critical production services.
3. LIABILITY: Enterprise Cloud Solutions Global (FinOps Div) is not liable for service interruptions, data egress costs, or incidental cloud spend resulting from automated or manual fixes recommended by the platform.
4. USAGE: AI recommendations are advisory. We recommend a "Dry-Run" phase (minimum 7 days) for all new autonomous automation policies before production enforcement.`
    },
    PRIVACY: {
      title: 'Privacy Policy',
      body: `Security is our core DNA. We handle your cloud metadata with the highest levels of industrial encryption and isolation.

1. DATA COLLECTION: We collect resource metadata (IDs, instance types, utilization metrics) and anonymized billing records. We DO NOT ingest sensitive application data, customer PII, or internal database contents.
2. ENCRYPTION: All data is encrypted in transit via TLS 1.3 and at rest using AES-256 with hardware security modules (HSM) managed by Google Cloud.
3. THIRD-PARTY AI: Telemetry sent to our Neural Core (Gemini API) is processed according to enterprise data protection standards. Your data is NOT used to train foundation models for other customers.
4. AUDIT TRAIL: Every access to your metadata by the platform is logged and available in the Identity Center for compliance auditing (SOC2/ISO27001).`
    },
    SUPPORT: {
      title: 'Support & Contact',
      body: `Need tactical assistance? Our FinOps Concierge team is available 24/7 for Platinum users.

• EMERGENCY HOTLINE: +1 (888) FIN-OPS-911
• TECHNICAL SUPPORT: strategic-ops@enterprise-global.io
• SLACK CHANNEL: #finops-leak-finder-platinum
• KNOWLEDGE BASE: docs.leakfinder.io

SLA GUARANTEE: 
- Critical (P0): < 1 Hour Response (System Outage / Data Leak)
- Standard (P1): < 4 Hour Response (Cost Anomaly)
- General Inquiry: < 12 Hour Response (Strategic Advice)`
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3rem] shadow-4xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {(['TOS', 'PRIVACY', 'SUPPORT'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === t ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20 dark:bg-blue-900/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {content[t].title}
            </button>
          ))}
          <button onClick={onClose} className="px-6 text-slate-300 hover:text-rose-500 transition-colors">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        <div className="p-10 lg:p-14 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
                <i className={`fas ${tab === 'TOS' ? 'fa-file-signature' : tab === 'PRIVACY' ? 'fa-shield-halved' : 'fa-headset'} text-xl`}></i>
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">{content[tab].title}</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Enterprise Compliance v4.2 Platinum</p>
            </div>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium whitespace-pre-line tracking-tight">
              {content[tab].body}
            </p>
          </div>
        </div>
        <div className="px-10 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center gap-4">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-auto">Last Revised: January 2025</span>
          <button onClick={onClose} className="px-8 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:translate-y-[-1px] active:scale-95 transition-all">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};