
import React, { useEffect, useState } from 'react';
import { backend } from '../backendService';
import { ComplianceStatus } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const ComplianceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [data, setData] = useState<ComplianceStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const mockUptime = [
    { day: 'Mon', uptime: 99.99 },
    { day: 'Tue', uptime: 100 },
    { day: 'Wed', uptime: 99.95 },
    { day: 'Thu', uptime: 99.99 },
    { day: 'Fri', uptime: 100 },
    { day: 'Sat', uptime: 100 },
    { day: 'Sun', uptime: 99.98 },
  ];

  const fetchCompliance = () => {
    backend.getCompliance().then(setData);
  };

  useEffect(() => {
    fetchCompliance();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await backend.triggerComplianceAudit();
    fetchCompliance();
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">SLA & Compliance</h2>
              <p className="text-sm text-slate-500 font-medium">Real-time service health and certification tracking</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                {isRefreshing ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-sync"></i>}
                Re-scan Posture
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors"><i className="fas fa-times text-xl"></i></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Service Availability (7D)</h3>
              <div className="h-64 bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockUptime}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                    <YAxis domain={[99.9, 100]} hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={4} dot={{fill: '#10b981', strokeWidth: 2, r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Current Uptime: <span className="text-emerald-600">99.98%</span></span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Healthy</span>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Certification Progress</h3>
              {data.map(c => (
                <div key={c.framework} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-slate-900">{c.framework}</span>
                    <span className="text-blue-600 font-black text-sm">{c.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mb-4">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${c.score}%` }}></div>
                  </div>
                  <div className="space-y-2">
                    {c.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <i className={`fas ${item.done ? 'fa-check text-emerald-500' : 'fa-clock text-slate-300'}`}></i>
                        {item.task}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
