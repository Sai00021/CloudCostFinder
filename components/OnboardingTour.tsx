
import React, { useState } from 'react';

interface TourStep {
  title: string;
  description: string;
  selector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: TourStep[] = [
  {
    title: 'Efficiency Index',
    description: 'This is your overall health score. We aim for 100% to ensure zero wasted compute dollars.',
    selector: '[data-tour="waste-score"]',
    position: 'bottom'
  },
  {
    title: 'Remediation Engine',
    description: 'Set your autonomous boundaries here. Rogue nodes can be killed automatically based on these rules.',
    selector: '[data-tour="remediation-engine"]',
    position: 'left'
  },
  {
    title: 'Global Audit',
    description: 'Trigger a fresh scan across all your GCP regions and projects at any time.',
    selector: '[data-tour="global-audit"]',
    position: 'bottom'
  },
  {
    title: 'Cost Leak Feed',
    description: 'Your real-time stream of identified waste. Fix, snooze, or audit each leak individually.',
    selector: '[data-tour="leak-list"]',
    position: 'top'
  }
];

export const OnboardingTour: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
      
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-4xl p-10 border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-slate-100 dark:bg-slate-800'}`} />
            ))}
          </div>
          <button onClick={onComplete} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">Skip</button>
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">{step.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">{step.description}</p>

        <button 
          onClick={handleNext}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-xl active:scale-95"
        >
          {currentStep === STEPS.length - 1 ? 'Launch Control Plane' : 'Next Intelligence Brief'}
        </button>
      </div>
    </div>
  );
};
