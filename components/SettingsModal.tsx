
import React, { useState } from 'react';
import { UserSettings, AuditFrequency } from '../types';

interface SettingsModalProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [tempSettings, setTempSettings] = useState<UserSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(tempSettings);
      setIsSaving(false);
      onClose();
    }, 600);
  };

  const frequencies: { value: AuditFrequency; label: string; desc: string }[] = [
    { value: 'OFF', label: 'Manual Only', desc: 'No automatic audits. You run them when needed.' },
    { value: 'DAILY', label: 'Daily', desc: 'Get a fresh leak report every 24 hours.' },
    { value: 'WEEKLY', label: 'Weekly', desc: 'Summary of optimization opportunities every Monday.' },
    { value: 'MONTHLY', label: 'Monthly', desc: 'Comprehensive monthly cost-reduction review.' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-4xl overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors">
        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-xl text-blue-600 dark:text-blue-400">
              <i className="fas fa-calendar-check text-lg"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Audit Schedule</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Frequency</h4>
            <div className="grid gap-3">
              {frequencies.map((f) => (
                <label 
                  key={f.value}
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    tempSettings.auditFrequency === f.value 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="frequency"
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    checked={tempSettings.auditFrequency === f.value}
                    onChange={() => setTempSettings({ ...tempSettings, auditFrequency: f.value })}
                  />
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white">{f.label}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{f.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Email Notifications</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Send a report when new leaks are found</p>
            </div>
            <button 
              onClick={() => setTempSettings({ ...tempSettings, notificationsEnabled: !tempSettings.notificationsEnabled })}
              className={`w-12 h-6 rounded-full transition-all relative ${
                tempSettings.notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                tempSettings.notificationsEnabled ? 'left-7' : 'left-1'
              }`}></div>
            </button>
          </section>
        </div>

        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3 transition-colors">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'Save Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};