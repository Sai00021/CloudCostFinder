
import React from 'react';

export const RegionalHeatmap: React.FC = () => {
  const regions = [
    { name: 'us-central1', waste: 450, status: 'high' },
    { name: 'europe-west1', waste: 180, status: 'med' },
    { name: 'asia-east1', waste: 320, status: 'high' },
    { name: 'us-east1', waste: 12, status: 'low' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
        Regional Waste Density
      </h3>
      <div className="space-y-4">
        {regions.map(r => (
          <div key={r.name}>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">{r.name}</span>
              <span className={r.status === 'high' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}>${r.waste}/mo</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${r.status === 'high' ? 'bg-rose-500' : r.status === 'med' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${(r.waste / 500) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">
          Tip: Move storage buckets to us-east1 to reduce networking egress costs by 15%.
        </p>
      </div>
    </div>
  );
};