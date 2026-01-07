
import React, { useState } from 'react';

interface SnoozeModalProps {
  onSnooze: (hours: number) => void;
  onClose: () => void;
  resourceName: string;
}

export const SnoozeModal: React.FC<SnoozeModalProps> = ({ onSnooze, onClose, resourceName }) => {
  const options = [
    { label: '1 Hour', value: 1, icon: 'fa-hourglass-start' },
    { label: '24 Hours', value: 24, icon: 'fa-calendar-day' },
    { label: '7 Days', value: 168, icon: 'fa-calendar-week' },
    { label: '30 Days', value: 720, icon: 'fa-calendar-days' },
  ];

  const [selected, setSelected] = useState<number>(24);

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Snooze Alert</h2>
              <p className="text-xs text-slate-500 font-medium">Temporarily hide leak for {resourceName}</p>
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-600"><i className="fas fa-times"></i></button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {options.map((opt) => (
              <button 
                key={opt.value}
                onClick={() => setSelected(opt.value)}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                  selected === opt.value ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                <i className={`fas ${opt.icon} text-lg`}></i>
                <span className="text-xs font-black uppercase tracking-widest">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
            <button 
              onClick={() => onSnooze(selected)}
              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
            >
              Confirm Snooze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
