
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMockLogin = (provider: string) => {
    setIsLoading(true);
    const mockId = Math.random().toString(36).substr(2, 9);
    const mockName = provider === 'google' ? 'Alex Morgan' : provider === 'github' ? 'Jordan Smith' : 'Taylor Reed';
    
    setTimeout(() => {
      onLogin({
        id: mockId,
        name: mockName,
        email: email || (provider === 'google' ? 'alex@startup.io' : 'dev@cloudleak.io'),
        // Using initials style for letter-based avatars
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mockName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        role: provider === 'google' ? 'FinOps Director' : 'Cloud Engineer',
        provider
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-8 -right-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-6 shadow-2xl shadow-blue-500/10">
            <i className="fas fa-money-bill-trend-up text-4xl text-blue-500"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Cloud Leak Finder</h1>
          <p className="text-slate-400">Optimize your infrastructure, save the planet.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="space-y-4">
            <button 
              onClick={() => handleMockLogin('google')}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Continue with Google Cloud
            </button>
            
            <button 
              onClick={() => handleMockLogin('github')}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-bold transition-all active:scale-95"
            >
              <i className="fab fa-github text-xl"></i>
              Continue with GitHub
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-4 text-slate-500 font-bold tracking-widest">Or email</span></div>
          </div>

          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <button 
              onClick={() => handleMockLogin('email')}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign In'}
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-500 text-xs font-medium">
          New to Leak Finder? <a href="#" className="text-blue-500 hover:underline">Create a free organization</a>
        </p>
      </div>
    </div>
  );
};
