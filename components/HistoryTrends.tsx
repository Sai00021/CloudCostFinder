import React, { useMemo } from 'react';
import { AuditRecord } from '../types';
import { 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area
} from 'recharts';

interface HistoryTrendsProps {
  history: AuditRecord[];
}

export const HistoryTrends: React.FC<HistoryTrendsProps> = ({ history }) => {
  const chartData = useMemo(() => {
    const sortedHistory = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const data = sortedHistory.map((record) => ({
      name: new Date(record.timestamp).toLocaleDateString('en-US', { month: 'short' }),
      savings: record.savingsFound,
      leaks: record.leakCount,
      score: Math.min(100, 70 + (Math.max(0, 300 - record.savingsFound) / 10)) 
    }));

    if (data.length > 0) {
      const last = data[data.length - 1];
      data.push({
        name: 'Forecast',
        savings: Math.max(0, last.savings - 50),
        leaks: Math.max(1, last.leaks - 1),
        score: Math.min(100, last.score + 5)
      });
    }
    return data;
  }, [history]);

  const totalSaved = useMemo(() => history.reduce((acc, curr) => acc + curr.savingsFound, 0), [history]);
  const latestSavings = history[0]?.savingsFound || 0;
  const previousSavings = history[1]?.savingsFound || 0;
  const savingsTrend = previousSavings === 0 ? 0 : ((latestSavings - previousSavings) / previousSavings) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-5 overflow-hidden relative group transition-all h-full">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] -translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform duration-1000">
        <i className="fas fa-chart-line text-[80px] text-slate-900 dark:text-white"></i>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-start gap-4 mb-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase">Velocity</h3>
            <span className="bg-blue-600 text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse shadow-md shadow-blue-600/40">Telemetry Active</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-1"></div>
          <div className="flex gap-6">
            <div className="space-y-0">
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Reclaimed</p>
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">${totalSaved.toLocaleString()}</p>
            </div>
            <div className="space-y-0">
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Delta</p>
              <p className={`text-xl font-black tracking-tighter ${savingsTrend <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {Math.abs(savingsTrend).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 self-end xl:self-start">
           <button className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Export</button>
           <button className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md hover:translate-y-[-1px] transition-all border border-white/10">Historic Cycles</button>
        </div>
      </div>

      <div className="h-[240px] w-full relative z-10">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f908" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} 
              />
              <YAxis yAxisId="left" hide />
              <YAxis yAxisId="right" orientation="right" hide />
              <Tooltip 
                cursor={{ stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '5 5' }}
                contentStyle={{ 
                  borderRadius: '0.75rem', 
                  border: '1px solid #f1f5f908', 
                  boxShadow: '0 15px 30px -10px rgb(0 0 0 / 0.5)',
                  padding: '10px',
                  backgroundColor: '#0f172a'
                }} 
                itemStyle={{ fontWeight: 900, fontSize: '9px' }}
              />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="savings" 
                name="Leakage ($)" 
                fill="url(#colorSavings)" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                animationDuration={1500}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="score" 
                name="Performance Index" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#10b981', strokeWidth: 1.5, stroke: '#ffffff' }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-xl">
             <i className="fas fa-radar text-2xl text-slate-100 dark:text-slate-800 mb-3 animate-spin-slow"></i>
             <p className="text-slate-400 font-black uppercase tracking-widest text-[8px]">Aggregating Intelligence...</p>
          </div>
        )}
      </div>
    </div>
  );
};