
import React, { useState, useEffect } from 'react';
import { backend } from '../backendService';
import { LogEntry } from '../types';

export const BackendStatus: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    backend.onLogUpdate(setLogs);
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[150] transition-all duration-500 ${isVisible ? 'h-64' : 'h-10'}`}>
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="absolute top-0 right-8 -translate-y-full bg-slate-900 text-white px-4 py-2 rounded-t-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-x border-t border-slate-700"
      >
        <i className={`fas ${isVisible ? 'fa-chevron-down' : 'fa-terminal'}`}></i>
        {isVisible ? 'Hide Logs' : 'System Logs'}
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-2"></span>
      </button>

      <div className="bg-slate-900 h-full border-t border-slate-800 p-4 font-mono text-[11px] overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-1">
          <div className="text-slate-500 mb-2 border-b border-slate-800 pb-2">
            Cloud Leak Finder Backend Kernel v2.4.0 (mock_env: local_storage)
          </div>
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <span className="text-slate-600">[{log.timestamp}]</span>
              <span className={`font-bold w-16 ${
                log.level === 'SUCCESS' ? 'text-emerald-500' :
                log.level === 'ERROR' ? 'text-rose-500' :
                log.level === 'WARN' ? 'text-amber-500' : 'text-blue-500'
              }`}>
                {log.level}
              </span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-slate-700 italic">No system activity recorded yet...</div>}
        </div>
      </div>
    </div>
  );
};
