
import React, { useState, useEffect } from 'react';
import { backend } from '../backendService';
import { AutoKillConfig, AutoKillPolicy, ResourceType } from '../types';

interface AutoKillModalProps {
  onClose: () => void;
}

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-2">
    <i className="fas fa-circle-info text-slate-600 cursor-help text-[10px] hover:text-blue-400 transition-colors"></i>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-3 bg-slate-800 text-white text-[10px] font-medium rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-1">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

export const AutoKillModal: React.FC<AutoKillModalProps> = ({ onClose }) => {
  const [config, setConfig] = useState<AutoKillConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    backend.getAutoKillConfig().then(setConfig);
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    await backend.updateAutoKillConfig(config);
    setIsSaving(false);
    onClose();
  };

  const updatePolicy = (type: ResourceType, updates: Partial<AutoKillPolicy>) => {
    if (!config) return;
    const newPolicies = config.policies.map(p => 
      p.resourceType === type ? { ...p, ...updates } : p
    );
    setConfig({ ...config, policies: newPolicies });
  };

  if (!config) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-3xl border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-rose-600 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-rose-600/20">
                  <i className="fas fa-power-off text-sm"></i>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Autonomous Remediation</h2>
              </div>
              <p className="text-sm text-slate-400 font-medium">Configure Hardline "Auto-Kill" thresholds for rogue resources.</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><i className="fas fa-times text-xl"></i></button>
          </div>

          <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            {/* Global Switches */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setConfig({...config, globalEnabled: !config.globalEnabled})}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-2 text-left group ${
                  config.globalEnabled ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-800/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <i className={`fas fa-bolt ${config.globalEnabled ? 'text-emerald-500' : 'text-slate-500'}`}></i>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${config.globalEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${config.globalEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                  </div>
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest mt-2 flex items-center">
                  Global Engine
                  <Tooltip text="Master switch for all autonomous actions. When disabled, no resources will be modified." />
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{config.globalEnabled ? 'Active & Enforcing' : 'Engine Standby'}</span>
              </button>

              <button 
                onClick={() => setConfig({...config, dryRunMode: !config.dryRunMode})}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-2 text-left group ${
                  config.dryRunMode ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-800/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <i className={`fas fa-eye ${config.dryRunMode ? 'text-blue-500' : 'text-slate-500'}`}></i>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${config.dryRunMode ? 'bg-blue-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${config.dryRunMode ? 'left-4.5' : 'left-0.5'}`}></div>
                  </div>
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest mt-2 flex items-center">
                  Dry-Run Mode
                  <Tooltip text="Simulate actions without actually terminating resources. Recommended for testing new policies." />
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{config.dryRunMode ? 'Log only, no actions' : 'Live Remediation'}</span>
              </button>
            </div>

            {/* Per-Resource Policies */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Enforcement Logic</h3>
              
              {config.policies.map(policy => {
                const isAggressiveIdle = policy.idleDaysThreshold < 5;
                const isAggressiveCpu = (policy.cpuThreshold || 0) > 10;

                return (
                  <div key={policy.resourceType} className={`p-8 rounded-[2.5rem] border transition-all ${policy.enabled ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-700 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
                          <i className={`fas ${policy.resourceType === 'VM' ? 'fa-server' : policy.resourceType === 'STORAGE' ? 'fa-database' : 'fa-microchip'} text-lg`}></i>
                        </div>
                        <div>
                          <h4 className="font-black text-white uppercase tracking-wider flex items-center">
                            {policy.resourceType} Policy
                            <Tooltip text={`Automatic action when ${policy.resourceType} resources meet efficiency thresholds.`} />
                          </h4>
                          <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${policy.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                            Action: {policy.action}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => updatePolicy(policy.resourceType, { enabled: !policy.enabled })}
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${policy.enabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all ${policy.enabled ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>

                    {policy.enabled && (
                      <div className="grid grid-cols-2 gap-10 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="relative">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 block flex items-center">
                            Idle Threshold
                            <Tooltip text="Maximum days a resource can remain inactive before remediation triggers." />
                          </label>
                          <input 
                            type="range" min="1" max="90" 
                            value={policy.idleDaysThreshold}
                            onChange={(e) => updatePolicy(policy.resourceType, { idleDaysThreshold: parseInt(e.target.value) })}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                          />
                          <div className="flex justify-between mt-3">
                            <span className={`text-xs font-black transition-colors ${isAggressiveIdle ? 'text-rose-400' : 'text-white'}`}>
                              {policy.idleDaysThreshold} Days
                            </span>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">
                              {isAggressiveIdle ? 'High Risk' : 'Conservative'}
                            </span>
                          </div>
                        </div>
                        
                        {policy.cpuThreshold !== undefined && (
                          <div className="relative">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 block flex items-center">
                              CPU Waste Floor
                              <Tooltip text="Resources consistently averaging below this CPU usage will be flagged as under-utilized." />
                            </label>
                            <input 
                              type="range" min="0" max="25" 
                              value={policy.cpuThreshold}
                              onChange={(e) => updatePolicy(policy.resourceType, { cpuThreshold: parseInt(e.target.value) })}
                              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400 transition-all"
                            />
                            <div className="flex justify-between mt-3">
                              <span className={`text-xs font-black transition-colors ${isAggressiveCpu ? 'text-rose-400' : 'text-white'}`}>
                                {policy.cpuThreshold}% CPU
                              </span>
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">
                                {isAggressiveCpu ? 'Aggressive' : 'Safe Floor'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-[2rem] flex items-center gap-4">
              <i className="fas fa-circle-info text-blue-500"></i>
              <p className="text-[10px] font-bold text-blue-200/60 leading-relaxed uppercase tracking-widest">
                Policy changes trigger a full global audit. Remediation actions are logged in the System Terminal for 30 days.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-10 pt-10 border-t border-slate-800 flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Cancel</button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-[2] py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-2xl shadow-black/40 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-shield-check"></i>}
              Deploy Enforcement Policies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
