
import React, { useState, useEffect } from 'react';
import { CostLeak, CloudResource } from '../types';

interface SearchOverlayProps {
  onClose: () => void;
  leaks: CostLeak[];
  resources: CloudResource[];
  onSelectLeak: (leak: CostLeak) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, leaks, resources, onSelectLeak }) => {
  const [query, setQuery] = useState('');
  
  const filteredLeaks = leaks.filter(l => 
    l.resourceName.toLowerCase().includes(query.toLowerCase()) || 
    l.finding.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.id.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-3xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <i className="fas fa-search text-slate-400 text-xl"></i>
          <input 
            autoFocus
            type="text" 
            placeholder="Search leaks, resources, or findings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-xl font-black text-slate-900 dark:text-white outline-none placeholder:text-slate-300"
          />
          <kbd className="hidden sm:block px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-black text-slate-400">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-8 custom-scrollbar">
          {query.length > 0 && (
            <>
              {filteredLeaks.length > 0 && (
                <div>
                  <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Cost Leaks</h3>
                  <div className="space-y-2">
                    {filteredLeaks.map(l => (
                      <button 
                        key={l.resourceId}
                        onClick={() => { onSelectLeak(l); onClose(); }}
                        className="w-full p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between transition-all group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl flex items-center justify-center">
                            <i className="fas fa-triangle-exclamation"></i>
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">{l.resourceName}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[300px]">{l.finding}</p>
                          </div>
                        </div>
                        <span className="text-rose-600 font-black text-sm">-${l.monthlyWaste}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredResources.length > 0 && (
                <div>
                  <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Cloud Resources</h3>
                  <div className="space-y-2">
                    {filteredResources.map(r => (
                      <button 
                        key={r.id}
                        className="w-full p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between transition-all group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl flex items-center justify-center">
                            <i className="fas fa-cube"></i>
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">{r.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{r.type} • {r.region}</p>
                          </div>
                        </div>
                        <span className="text-slate-400 font-black text-xs uppercase tracking-widest">${r.monthlyCost}/mo</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredLeaks.length === 0 && filteredResources.length === 0 && (
                <div className="py-20 text-center">
                  <i className="fas fa-ghost text-4xl text-slate-200 mb-4"></i>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No results found for "{query}"</p>
                </div>
              )}
            </>
          )}

          {!query && (
            <div className="py-20 text-center">
              <i className="fas fa-keyboard text-4xl text-slate-100 mb-4"></i>
              <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Start typing to search infrastructure...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
