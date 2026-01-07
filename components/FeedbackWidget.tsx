import React, { useState } from 'react';
import { backend } from '../backendService';

type FeedbackCategory = 'BUG' | 'IDEA' | 'SUPPORT' | 'GENERAL';

export const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory>('GENERAL');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || isSyncing) return;
    setIsSyncing(true);
    
    await backend.submitFeedback({ 
      rating, 
      category, 
      comment, 
      timestamp: new Date().toISOString(),
      userEmail: 'strategic-ops@enterprise-global.io' // Mock user context
    });

    setTimeout(() => {
      setSubmitted(true);
      setIsSyncing(false);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setRating(0);
        setCategory('GENERAL');
        setComment('');
      }, 2500);
    }, 1200);
  };

  const categories: { id: FeedbackCategory; label: string; icon: string }[] = [
    { id: 'BUG', label: 'Anomaly', icon: 'fa-bug' },
    { id: 'IDEA', label: 'Idea', icon: 'fa-lightbulb' },
    { id: 'SUPPORT', label: 'Uplink', icon: 'fa-headset' },
    { id: 'GENERAL', label: 'Intel', icon: 'fa-info-circle' },
  ];

  return (
    <div className="fixed bottom-14 left-10 z-[180]">
      {isOpen ? (
        <div className="w-[340px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-4xl p-8 animate-in slide-in-from-bottom-6 duration-500 overflow-hidden relative group">
          {/* Internal Shimmer */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20"></div>
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] leading-none mb-1">Feedback Ingest</h4>
              <p className="text-[7px] font-black text-blue-500 uppercase tracking-widest">Protocol v4.2 Enabled</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-900 w-8 h-8 rounded-full flex items-center justify-center">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-12 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-[1.5rem] flex items-center justify-center text-2xl mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                <i className="fas fa-check-double"></i>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Neural Sync Complete</p>
              <p className="text-[8px] text-slate-400 mt-2 uppercase font-black tracking-[0.2em]">Transmission Finalized.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Selector */}
              <div className="grid grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      category === cat.id 
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600' 
                        : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <i className={`fas ${cat.icon} text-xs`}></i>
                    <span className="text-[6px] font-black uppercase tracking-widest">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => !rating && setRating(star)}
                    className={`text-xl transition-all duration-300 hover:scale-125 ${rating >= star ? 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'text-slate-100 dark:text-slate-800'}`}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>

              {/* Comment Terminal */}
              <div className="relative">
                <textarea 
                  placeholder="Input strategic observations..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-28 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder:opacity-30 transition-all shadow-inner"
                />
                <div className="absolute bottom-2 right-4 text-[7px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">
                  Line Ingest: Active
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={rating === 0 || isSyncing}
                className={`w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[1.5rem] font-black text-[9px] uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group/submit overflow-hidden relative ${isSyncing ? 'cursor-wait' : ''}`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSyncing ? (
                    <><i className="fas fa-circle-notch fa-spin"></i> Synchronizing...</>
                  ) : (
                    <><i className="fas fa-paper-plane group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-transform"></i> Transmit Intel</>
                  )}
                </span>
                {isSyncing && (
                  <div className="absolute inset-0 bg-blue-600 animate-pulse opacity-20"></div>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-white dark:bg-slate-900 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:scale-110 active:scale-95 group relative"
        >
          <i className="fas fa-comment-dots text-lg"></i>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
          <span className="absolute left-full ml-6 whitespace-nowrap bg-slate-950 text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-[-10px] group-hover:translate-x-0 border border-white/5">
            Neural Feed
          </span>
        </button>
      )}
    </div>
  );
};