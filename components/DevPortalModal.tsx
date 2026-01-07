import React, { useEffect, useState } from 'react';
import { backend } from '../backendService';
import { ApiKey } from '../types';
import { DocViewerModal } from './DocViewerModal';

export const DevPortalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  useEffect(() => {
    backend.getApiKeys().then(setKeys);
  }, []);

  const handleDocAccess = async (type: string) => {
    await backend.logDocumentationAccess(type);
    setActiveDoc(type);
  };

  const cloudLinks = [
    { name: 'Cloud API Reference', url: 'https://cloud.google.com/apis/docs/overview', icon: 'fa-book-atlas', color: 'text-blue-600', desc: 'Comprehensive Cloud Services Reference' },
    { name: 'Gemini API Ref', url: 'https://ai.google.dev/api', icon: 'fa-brain', color: 'text-indigo-500', desc: 'LLM Integration and AI Strategy' },
    { name: 'GCP API Library', url: 'https://console.cloud.google.com/apis/library', icon: 'fa-google', color: 'text-blue-500', desc: 'Browse and enable 100+ Cloud APIs' },
    { name: 'API Explorer', url: 'https://developers.google.com/apis-explorer', icon: 'fa-magnifying-glass-chart', color: 'text-emerald-500', desc: 'Interactive API request builder' },
    { name: 'Cloud SDK Ref', url: 'https://cloud.google.com/sdk/gcloud/reference', icon: 'fa-terminal', color: 'text-slate-700', desc: 'Command-line interface documentation' },
    { name: 'Billing API Ref', url: 'https://cloud.google.com/billing/docs/reference/rest', icon: 'fa-file-invoice-dollar', color: 'text-amber-500', desc: 'Programmatic cost management' },
  ];

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      {activeDoc && (
        <DocViewerModal 
          type={activeDoc} 
          onClose={() => setActiveDoc(null)} 
        />
      )}
      
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[3rem] shadow-4xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 flex flex-col h-full max-h-[90vh]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Developer Hub</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Integration keys and cloud reference documentation.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="space-y-10 overflow-y-auto pr-4 custom-scrollbar">
            {/* Cloud Documentation Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <i className="fas fa-book text-blue-500 text-sm"></i>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Cloud API Reference Documentation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cloudLinks.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col gap-3 group hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm ${link.color}`}>
                        <i className={`fas ${link.icon} text-lg`}></i>
                      </div>
                      <i className="fas fa-external-link-alt text-[10px] text-slate-300 dark:text-slate-600 group-hover:text-blue-500"></i>
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest block mb-1">{link.name}</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">{link.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* API Keys Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <i className="fas fa-key text-blue-500 text-sm"></i>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Service Authentication Keys</h3>
              </div>
              {keys.map(k => (
                <div key={k.id} className="p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Environment: Production</span>
                    <button className="text-rose-500 text-[10px] font-black hover:underline uppercase tracking-widest">Revoke Token</button>
                  </div>
                  <div className="font-mono text-sm bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 mb-4 select-all break-all shadow-inner">
                    {k.key}
                  </div>
                  <div className="flex justify-between text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span>Issued: {k.created}</span>
                    <span>Last Active: {k.lastUsed}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                + Generate New Automation Token
              </button>
            </section>

            {/* Integration Section */}
            <section className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-10 -rotate-12 translate-x-1/4">
                <i className="fas fa-terminal text-[15rem]"></i>
              </div>
              <div className="relative z-10">
                <div className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full inline-block mb-6 border border-white/10">Cloud SDK</div>
                <h3 className="text-2xl font-black mb-4">CLI Integration</h3>
                <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed max-w-lg">
                  Use our custom gcloud wrapper to automatically check for cost leaks during CI/CD pipeline runs. 
                </p>
                <button 
                  onClick={() => handleDocAccess('API Reference')}
                  className="bg-white text-slate-900 px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-2xl flex items-center gap-3 active:scale-95"
                >
                  View SDK Documentation
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};