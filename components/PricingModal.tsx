
import React, { useState } from 'react';
import { SubscriptionTier } from '../types';

interface PricingModalProps {
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier) => void;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ currentTier, onUpgrade, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);

  const handleUpgrade = (tier: SubscriptionTier) => {
    if (tier === 'ENTERPRISE') {
      window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank');
      return;
    }
    setLoadingTier(tier);
    setTimeout(() => {
      onUpgrade(tier);
      setLoadingTier(null);
    }, 1200);
  };

  const plans = [
    {
      id: 'FREE' as SubscriptionTier,
      name: 'Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Manual Cost Audits',
        'Basic Leak Detection',
        'Community Support Chat',
        '7-Day History Tracking',
        'Public Roadmap Access'
      ],
      buttonText: 'Current Plan',
      accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    },
    {
      id: 'PRO' as SubscriptionTier,
      name: 'Pro Optimizer',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        'Automated Daily Audits',
        'One-Click Remediation',
        'Advanced Tagging Suggestions',
        'Carbon Sustainability Reports',
        'Priority Email Support',
        'Custom Governance Rules',
        'API & Webhook Integration'
      ],
      buttonText: 'Upgrade to Pro',
      accent: 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 border-blue-600',
      popular: true
    },
    {
      id: 'ENTERPRISE' as SubscriptionTier,
      name: 'Enterprise',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      features: [
        'Multi-Project Rollup Views',
        'Dedicated FinOps Concierge',
        'Custom ML Pricing Models',
        'SSO & Granular RBAC',
        'White-glove Onboarding',
        'Quarterly Cost Reviews',
        'SLA Guaranteed Support'
      ],
      buttonText: 'Contact Sales',
      accent: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[3rem] shadow-4xl overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in duration-300 transition-colors">
        
        {/* Left Sidebar Info */}
        <div className="lg:w-1/4 bg-slate-50 dark:bg-slate-800/50 p-12 border-r border-slate-100 dark:border-slate-800 hidden lg:flex flex-col relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 translate-x-1/4">
             <i className="fas fa-crown text-[12rem] dark:text-white"></i>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl mb-6 shadow-xl shadow-blue-600/20">
              <i className="fas fa-shield-halved"></i>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Master Your Cloud Spend.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium mb-10">
              Join 500+ scale-ups using Leak Finder to reclaim an average of 22% of their monthly cloud budget.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <i className="fas fa-check text-[10px]"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Instant ROI Tracking</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <i className="fas fa-check text-[10px]"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Zero-Config Setup</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-10 border-t border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Trusted By Teams At</p>
            <div className="flex flex-wrap gap-4 opacity-40 grayscale dark:invert">
               <i className="fab fa-google text-lg"></i>
               <i className="fab fa-aws text-lg"></i>
               <i className="fab fa-microsoft text-lg"></i>
               <i className="fab fa-digital-ocean text-lg"></i>
            </div>
          </div>
        </div>
        
        {/* Main Pricing Content */}
        <div className="flex-1 p-8 lg:p-14">
          <div className="text-center mb-14">
            <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8 border border-slate-200 dark:border-slate-700 transition-colors">
              <button 
                onClick={() => setBillingCycle('MONTHLY')}
                className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  billingCycle === 'MONTHLY' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('ANNUAL')}
                className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${
                  billingCycle === 'ANNUAL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Annual
                <span className="absolute -top-6 -right-4 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce">
                  SAVE 20%
                </span>
              </button>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Flexible plans for every stage.</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isActive = currentTier === plan.id;
              const price = billingCycle === 'MONTHLY' ? plan.monthlyPrice : plan.annualPrice;
              const isCustom = price === 'Custom';

              return (
                <div 
                  key={plan.id}
                  className={`relative rounded-[3rem] p-10 border-2 flex flex-col transition-all duration-500 ${
                    plan.popular ? 'border-blue-600 bg-blue-50/5 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'
                  } ${isActive ? 'ring-4 ring-blue-600/10' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                      Most Scalable
                    </div>
                  )}

                  {isActive && (
                    <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full">
                      <i className="fas fa-circle-check text-[10px]"></i>
                      <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                    </div>
                  )}

                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    {isCustom ? (
                      <span className="text-3xl font-black text-slate-900 dark:text-white">Custom</span>
                    ) : (
                      <>
                        <span className="text-sm font-black text-slate-400 dark:text-slate-500 self-start mt-1">$</span>
                        <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                          {price}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 font-bold text-sm">/mo</span>
                      </>
                    )}
                  </div>

                  <ul className="space-y-4 mb-12 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 leading-tight">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-emerald-600 dark:text-emerald-400 text-[8px]"></i>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => !isActive && handleUpgrade(plan.id)}
                    disabled={isActive || (loadingTier !== null)}
                    className={`w-full py-5 rounded-2xl font-black text-xs transition-all uppercase tracking-widest active:scale-95 disabled:cursor-not-allowed border-b-4 ${
                      isActive 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700' 
                      : loadingTier === plan.id 
                        ? 'bg-blue-400 text-white border-blue-500 cursor-wait'
                        : `${plan.accent} hover:translate-y-[-2px]`
                    }`}
                  >
                    {loadingTier === plan.id ? (
                      <i className="fas fa-circle-notch fa-spin"></i>
                    ) : isActive ? (
                      'Current Subscription'
                    ) : plan.id === 'ENTERPRISE' ? (
                      'Talk to Cloud Expert'
                    ) : (
                      plan.buttonText
                    )}
                  </button>
                  
                  {!isCustom && price !== 0 && (
                    <p className="text-center mt-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Billed {billingCycle === 'MONTHLY' ? 'Monthly' : 'Annually'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 transition-colors">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center md:text-left">
              Need a custom proof-of-concept for your CTO? <button className="text-blue-600 dark:text-blue-400 font-black hover:underline">Get a free architecture review.</button>
            </p>
            <div className="flex gap-6 items-center">
               <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Compliance:</span>
               <i className="fab fa-stripe text-3xl text-slate-300 dark:text-slate-600"></i>
               <i className="fas fa-shield-halved text-lg text-slate-300 dark:text-slate-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};