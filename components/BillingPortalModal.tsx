
import React, { useState, useEffect } from 'react';
import { backend } from '../backendService';
import { BillingPortalData } from '../types';

export const BillingPortalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [data, setData] = useState<BillingPortalData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    backend.getBillingData().then(setData);
  }, []);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                <i className="fas fa-credit-card text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Billing Portal</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Subscription & Invoices</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-8 h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Payment Method */}
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Method</h3>
              <div className="p-6 bg-slate-950 rounded-3xl text-white flex justify-between items-center group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <i className="fab fa-cc-visa text-6xl"></i>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <i className="fas fa-wallet text-blue-400"></i>
                  </div>
                  <div>
                    <p className="text-sm font-black">{data.paymentMethod.brand} **** {data.paymentMethod.last4}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Next payment: {data.nextBillingDate}</p>
                  </div>
                </div>
                <button className="relative z-10 text-[9px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all">
                  Change
                </button>
              </div>
            </section>

            {/* Invoices */}
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Invoices</h3>
              <div className="space-y-3">
                {data.invoices.map(inv => (
                  <div key={inv.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-white hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-[10px]">
                        <i className="fas fa-file-invoice-dollar"></i>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{inv.id}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">{new Date(inv.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900">${inv.amount.toFixed(2)}</p>
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">PAID</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-10 pt-10 border-t border-slate-100 flex gap-4">
            <button className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Download All PDF</button>
            <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
              Manage GCP Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
