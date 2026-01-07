
import React, { useState, useEffect } from 'react';
import { backend } from '../backendService';
import { Notification } from '../types';

export const NotificationCenter: React.FC = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNotifs(backend.getNotifications());
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all relative"
      >
        <i className="fas fa-bell text-slate-500"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[140]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-3xl border border-slate-100 z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Intelligence Alerts</h4>
              <button className="text-[10px] font-black text-blue-600 uppercase">Clear All</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifs.length > 0 ? notifs.map(n => (
                <div key={n.id} className={`p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-4 ${n.read ? 'opacity-60' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    n.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : 
                    n.type === 'ALERT' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <i className={`fas ${n.type === 'SUCCESS' ? 'fa-check' : 'fa-triangle-exclamation'} text-[10px]`}></i>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 mb-1">{n.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                    <p className="text-[8px] text-slate-400 font-black uppercase mt-2">{new Date(n.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-slate-400 text-xs font-medium">No new alerts. Your cloud is quiet.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
