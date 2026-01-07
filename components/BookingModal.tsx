
import React, { useState } from 'react';
import { backend } from '../backendService';

export const BookingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [topic, setTopic] = useState('Cost Optimization');
  const [time, setTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = async () => {
    if (!time) return;
    await backend.bookCall({
      scheduledTime: time,
      expert: 'Sarah Jenkins (Senior FinOps)',
      topic
    });
    setIsBooked(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">FinOps Call</h2>
              <p className="text-sm text-slate-500 font-medium">Expert advice on your infrastructure</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors"><i className="fas fa-times text-xl"></i></button>
          </div>

          {isBooked ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                <i className="fas fa-check"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Session Scheduled!</h3>
              <p className="text-sm text-slate-500">You'll receive a calendar invite shortly.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Discussion Topic</label>
                <select 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                >
                  <option>Cost Optimization</option>
                  <option>Architecture Review</option>
                  <option>Governance Setup</option>
                  <option>Multi-cloud Migration</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Available Slots</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Oct 25, 10:00 AM', 'Oct 25, 2:00 PM', 'Oct 26, 11:00 AM', 'Oct 27, 9:00 AM'].map(slot => (
                    <button 
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`p-4 border-2 rounded-2xl text-xs font-black transition-all ${
                        time === slot ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleBook}
                disabled={!time}
                className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                Schedule Expert Call
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
