
import React, { useEffect, useState } from 'react';

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button 
      onClick={toggleTheme}
      className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all relative group flex items-center justify-center overflow-hidden w-11 h-11"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <i className={`fas fa-sun text-amber-500 absolute transition-all duration-500 ${theme === 'light' ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-50'}`}></i>
        <i className={`fas fa-moon text-blue-400 absolute transition-all duration-500 ${theme === 'dark' ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-50'}`}></i>
      </div>
      
      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]">
        {theme === 'light' ? 'Go Dark' : 'Go Light'}
      </span>
    </button>
  );
};