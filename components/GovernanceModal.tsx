
import React, { useEffect, useState, useRef } from 'react';
import { backend } from '../backendService';
import { GovernancePolicy } from '../types';

export const GovernanceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [policies, setPolicies] = useState<GovernancePolicy[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPolicies = () => {
    backend.getGovernance().then(setPolicies);
  };

  useEffect(() => {
    fetchPolicies();
    // Poll for status updates (since policies move from PENDING to COMPLIANT)
    const interval = setInterval(fetchPolicies, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate reading a large policy file
    const mockContent = `policy "cloud_standard" {
  enforcement_level = "mandatory"
  resource "google_compute_instance" {
    cpu_limit = 16
    region_restriction = ["us-central1"]
  }
}`;
    
    await backend.processPolicyUpload(file.name, mockContent);
    fetchPolicies();
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Governance Registry</h2>
              <p className="text-sm text-slate-500 font-medium">Manage and enforce cloud architecture standards</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {policies.length > 0 ? (
              policies.map(p => (
                <div key={p.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex flex-col gap-4 hover:border-blue-200 hover:bg-white transition-all group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        p.status === 'COMPLIANT' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                        p.status === 'NON_COMPLIANT' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 
                        'bg-amber-500 animate-pulse'
                      }`}></div>
                      <span className="font-black text-slate-800 tracking-tight">{p.title}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        p.status === 'COMPLIANT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        p.status === 'NON_COMPLIANT' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                  {p.description && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {p.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                      ID: {p.id.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                      Audit: {new Date(p.lastChecked).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <i className="fas fa-file-shield text-slate-200 text-6xl mb-6"></i>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active policies found</p>
              </div>
            )}
          </div>
          
          <div className="mt-10 flex gap-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".hcl,.json,.yaml,.rego"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isUploading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Analyzing Schema...
                </>
              ) : (
                <>
                  <i className="fas fa-file-upload"></i>
                  Upload Custom Policy
                </>
              )}
            </button>
            <button className="px-6 bg-slate-100 text-slate-400 rounded-[1.5rem] hover:text-blue-600 transition-all">
              <i className="fas fa-question-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
