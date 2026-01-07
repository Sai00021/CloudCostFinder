import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { AIInsights } from './components/AIInsights';
import { LeakList } from './components/LeakList';
import { Auth } from './components/Auth';
import { SettingsModal } from './components/SettingsModal';
import { PricingModal } from './components/PricingModal';
import { LegalModal, LegalTab } from './components/LegalModal';
import { SupportChat } from './components/SupportChat';
import { RegionalHeatmap } from './components/RegionalHeatmap';
import { BackendStatus } from './components/BackendStatus';
import { AuditHistory } from './components/AuditHistory';
import { HistoryTrends } from './components/HistoryTrends';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { GovernanceModal } from './components/GovernanceModal';
import { DevPortalModal } from './components/DevPortalModal';
import { ComplianceModal } from './components/ComplianceModal';
import { BookingModal } from './components/BookingModal';
import { WasteScoreHero } from './components/WasteScoreHero';
import { AutoKillModal } from './components/AutoKillModal';
import { TagManagerModal } from './components/TagManagerModal';
import { ResourceTaggingModal } from './components/ResourceTaggingModal';
import { SnoozeModal } from './components/SnoozeModal';
import { IdentityModal } from './components/IdentityModal';
import { BillingPortalModal } from './components/BillingPortalModal';
import { SearchOverlay } from './components/SearchOverlay';
import { FeedbackWidget } from './components/FeedbackWidget';
import { OnboardingTour } from './components/OnboardingTour';
import { IntelligenceSuite } from './components/IntelligenceSuite';
import { UniversalChatbot } from './components/UniversalChatbot';
import { LiveVoiceAssistant } from './components/LiveVoiceAssistant';
import { ComplianceSupportCard } from './components/ComplianceSupportCard';
import { analyzeCloudCosts } from './geminiService';
import { backend } from './backendService';
import { AuditResult, User, UserSettings, SubscriptionTier, AuditRecord, CostLeak, CloudResource } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('TOS');
  const [isGovernanceOpen, setIsGovernanceOpen] = useState(false);
  const [isDevPortalOpen, setIsDevPortalOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAutoKillOpen, setIsAutoKillOpen] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [isIdentityOpen, setIsIdentityOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [taggingResourceId, setTaggingResourceId] = useState<string | null>(null);
  const [snoozeLeak, setSnoozeLeak] = useState<CostLeak | null>(null);
  const [selectedLeak, setSelectedLeak] = useState<CostLeak | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [history, setHistory] = useState<AuditRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>(backend.getSettings());
  const [snoozedIds, setSnoozedIds] = useState<string[]>([]);
  
  const tourTriggered = useRef(false);

  const refreshData = useCallback(async () => {
    if (!user) return;
    const hist = backend.getHistory();
    setHistory(hist);
    const res = await backend.getResources();
    setResources(res);
    const snoozed = backend.getSnoozedResourceIds();
    setSnoozedIds(snoozed);
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user?.id, refreshData]);

  useEffect(() => {
    if (user && !tourTriggered.current) {
      backend.getOnboardingComplete().then(complete => {
        if (!complete) {
          setShowTour(true);
        }
      });
      tourTriggered.current = true;
    }
  }, [user?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const performAudit = useCallback(async () => {
    setIsAnalyzing(true);
    backend.addLog("Telemetry: Initiating Global Strategic Audit Pipeline", 'INFO');
    try {
      const currentResources = await backend.getResources();
      const result = await analyzeCloudCosts(currentResources);
      const dueDates = backend.getLeakDueDates();
      const enrichedLeaks = result.leaks.map(leak => ({
        ...leak,
        dueDate: dueDates[leak.resourceId] || leak.dueDate
      }));
      const finalResult = { ...result, leaks: enrichedLeaks };
      setAuditResult(finalResult);
      await backend.recordAudit({
        savingsFound: result.totalPotentialSavings,
        carbonSaved: result.carbonSavingsKg,
        leakCount: result.leaks.length
      });
      backend.addLog("Telemetry: Audit finalized successfully.", 'SUCCESS');
      refreshData();
    } catch (err: any) {
      console.error("Audit failed:", err);
      backend.addLog(`Telemetry: Audit failed - ${err.message || 'Unknown error'}`, 'ERROR');
    } finally {
      setIsAnalyzing(false);
    }
  }, [refreshData]);

  const handleLogin = async (userData: any) => {
    const loggedUser = await backend.login(userData);
    setUser(loggedUser);
    setSettings(backend.getSettings());
  };

  const handleLogout = async () => {
    await backend.logout();
    setUser(null);
    setAuditResult(null);
    setShowTour(false);
    tourTriggered.current = false;
  };

  const handleTourComplete = async () => {
    await backend.setOnboardingComplete(true);
    setShowTour(false);
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    await backend.processSubscription(tier);
    setSettings(backend.getSettings());
    if (user) setUser({ ...user, tier });
    setIsPricingOpen(false);
  };

  const handleSaveSettings = async (newSettings: UserSettings) => {
    await backend.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSnoozeConfirm = async (hours: number) => {
    if (!snoozeLeak) return;
    await backend.snoozeResource(snoozeLeak.resourceId, hours);
    setSnoozeLeak(null);
    refreshData();
  };

  const handleUpdateDueDate = async (resourceId: string, date: string) => {
    await backend.updateLeakDueDate(resourceId, date);
    setAuditResult(prev => {
      if (!prev) return null;
      const updatedLeaks = prev.leaks.map(l => 
        l.resourceId === resourceId ? { ...l, dueDate: date } : l
      );
      return { ...prev, leaks: updatedLeaks };
    });
  };

  const handleQuickRemediate = async (leak: CostLeak) => {
    backend.addLog(`Remediation: Automated decommissioning of ${leak.resourceName} initiated.`, 'INFO');
    await backend.markLeakResolved(leak);
    setAuditResult(prev => {
      if (!prev) return null;
      const remainingLeaks = prev.leaks.filter(l => l.resourceId !== leak.resourceId);
      return { ...prev, leaks: remainingLeaks };
    });
    refreshData();
  };

  const openLegal = (tab: LegalTab) => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  const filteredLeaks = auditResult?.leaks.filter(l => !snoozedIds.includes(l.resourceId)) || [];
  const totalCurrentSpend = resources.reduce((acc, curr) => acc + curr.monthlyCost, 0);

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] dark:bg-slate-950 relative overflow-hidden font-sans transition-colors duration-700 text-sm">
      <Header 
        onAnalyze={performAudit} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onOpenIdentity={() => setIsIdentityOpen(true)}
        onOpenBilling={() => setIsBillingOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAutoKill={() => setIsAutoKillOpen(true)}
        isAnalyzing={isAnalyzing} 
        user={user}
        onLogout={handleLogout}
      />
      <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl border-b border-slate-200/50 dark:border-slate-800/80 px-6 py-2.5 text-xs font-bold flex justify-center items-center gap-8 z-40 transition-all uppercase tracking-widest">
        <button onClick={() => setIsPricingOpen(true)} className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all group">
          <i className="fas fa-crown text-amber-500 group-hover:scale-110"></i> Plan: {settings.tier}
        </button>
        <button onClick={() => setIsChatOpen(true)} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all group">
          <i className="fas fa-message text-indigo-500 group-hover:rotate-12"></i> Chat
        </button>
        <button onClick={() => setIsVoiceOpen(true)} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all group">
          <i className="fas fa-microphone-sparkles text-rose-500 group-hover:scale-110"></i> Voice
        </button>
        <button onClick={() => setIsIntelligenceOpen(true)} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all group">
          <i className="fas fa-atom text-emerald-500 group-hover:spin-slow"></i> Lab
        </button>
        <button onClick={() => setIsGovernanceOpen(true)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all">Governance</button>
        <button onClick={() => setIsComplianceOpen(true)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all">SLA</button>
        <button onClick={() => openLegal('SUPPORT')} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-all group">
          <i className="fas fa-scale-balanced text-slate-400 group-hover:text-rose-500"></i> Legal & Support
        </button>
      </nav>
      
      {isSettingsOpen && <SettingsModal settings={settings} onSave={handleSaveSettings} onClose={() => setIsSettingsOpen(false)} />}
      {isPricingOpen && <PricingModal currentTier={settings.tier} onUpgrade={handleUpgrade} onClose={() => setIsPricingOpen(false)} />}
      {isLegalOpen && <LegalModal initialTab={legalTab} onClose={() => setIsLegalOpen(false)} />}
      {isGovernanceOpen && <GovernanceModal onClose={() => setIsGovernanceOpen(false)} />}
      {isDevPortalOpen && <DevPortalModal onClose={() => setIsDevPortalOpen(false)} />}
      {isComplianceOpen && <ComplianceModal onClose={() => setIsComplianceOpen(false)} />}
      {isBookingOpen && <BookingModal onClose={() => setIsBookingOpen(false)} />}
      {isAutoKillOpen && <AutoKillModal onClose={() => setIsAutoKillOpen(false)} />}
      {isTagManagerOpen && <TagManagerModal onClose={() => setIsTagManagerOpen(false)} />}
      {isIdentityOpen && <IdentityModal user={user} onUpdateUser={(u) => setUser({...user, ...u})} onClose={() => setIsIdentityOpen(false)} />}
      {isBillingOpen && <BillingPortalModal onClose={() => setIsBillingOpen(false)} />}
      {isIntelligenceOpen && <IntelligenceSuite onClose={() => setIsIntelligenceOpen(false)} />}
      {isChatOpen && <UniversalChatbot onClose={() => setIsChatOpen(false)} />}
      {isVoiceOpen && <LiveVoiceAssistant onClose={() => setIsVoiceOpen(false)} />}
      {isSearchOpen && (
        <SearchOverlay 
          leaks={auditResult?.leaks || []} 
          resources={resources} 
          onSelectLeak={setSelectedLeak}
          onClose={() => setIsSearchOpen(false)} 
        />
      )}
      {showTour && <OnboardingTour onComplete={handleTourComplete} />}
      {taggingResourceId && <ResourceTaggingModal resourceId={taggingResourceId} onClose={() => setTaggingResourceId(null)} />}
      {snoozeLeak && (
        <SnoozeModal 
          resourceName={snoozeLeak.resourceName} 
          onSnooze={handleSnoozeConfirm} 
          onClose={() => setSnoozeLeak(null)} 
        />
      )}
      {selectedLeak && <ResourceDetailModal leak={selectedLeak} onClose={() => setSelectedLeak(null)} />}

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10 custom-scrollbar">
        <div className="max-w-[1440px] mx-auto space-y-8 pb-12">
          <div className="flex flex-col xl:flex-row items-stretch justify-between gap-6">
            <div className="xl:col-span-8 flex-1 animate-in fade-in slide-in-from-left-10 duration-700">
              <HistoryTrends history={history} />
            </div>
            <div className="xl:col-span-4 w-full xl:w-[380px]" data-tour="waste-score">
              <WasteScoreHero score={auditResult?.wasteScore || 0} isAnalyzing={isAnalyzing} />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-between gap-6 py-6 border-y border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img src={user.avatar} className="relative w-16 h-16 rounded-2xl border-[3px] border-white dark:border-slate-800 shadow-xl transition-all group-hover:scale-105 duration-700 object-cover" alt="Profile" />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-lg flex items-center justify-center text-white text-[8px] border-[2px] border-white dark:border-slate-900 shadow-xl">
                  <i className="fas fa-check"></i>
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter leading-none uppercase">Strategic Terminal</h2>
                <div className="flex items-center gap-3 justify-center md:justify-start mt-1">
                  <span className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-md border border-blue-100 dark:border-blue-800">
                    <i className="fas fa-shield-halved"></i> Root Auth
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
               <button 
                data-tour="remediation-engine"
                onClick={() => setIsAutoKillOpen(true)}
                className="group flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg hover:translate-y-[-2px] transition-all"
               >
                  <i className="fas fa-robot text-blue-600 text-lg"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Auto Remediation</span>
               </button>
               <button 
                onClick={() => setIsBookingOpen(true)}
                className="group flex items-center gap-3 bg-slate-950 dark:bg-white px-6 py-3 rounded-xl shadow-2xl hover:translate-y-[-2px] transition-all"
               >
                  <i className="fas fa-headset text-indigo-400 dark:text-indigo-600 text-lg"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-950">Expert Intelligence</span>
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard label="Monthly Burn" value={`$${totalCurrentSpend.toLocaleString()}`} icon="fa-fire" color="bg-rose-500" trend="+4.2%" />
            <StatCard label="Recapturable" value={`$${(auditResult?.totalPotentialSavings || 0).toLocaleString()}`} icon="fa-hand-holding-dollar" color="bg-emerald-500" trend="-12.8%" />
            <StatCard label="Carbon Footprint" value={`${(auditResult?.carbonSavingsKg || 0).toLocaleString()}kg`} icon="fa-leaf" color="bg-indigo-500" />
            <StatCard label="Efficiency Score" value={`${auditResult?.wasteScore || 0}/100`} variant="score" scoreValue={auditResult?.wasteScore || 0} icon="fa-bolt" color="bg-blue-600" />
          </div>

          <AIInsights summary={auditResult?.summary || ""} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6" data-tour="leak-list">
              <LeakList leaks={filteredLeaks} onSelectLeak={setSelectedLeak} onManageTags={setTaggingResourceId} onSnoozeLeak={setSnoozeLeak} onUpdateDueDate={handleUpdateDueDate} onFix={handleQuickRemediate} />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <ComplianceSupportCard onOpenLegal={openLegal} />
              <RegionalHeatmap />
              <AuditHistory history={history} />
            </div>
          </div>
        </div>
      </main>
      <BackendStatus />
      <SupportChat user={user} />
      <FeedbackWidget />

      {/* Footer Branding Links */}
      <footer className="px-8 py-4 bg-white/30 dark:bg-slate-950/30 border-t border-slate-200/20 dark:border-slate-800/20 backdrop-blur-xl flex justify-between items-center z-40">
        <div className="flex items-center gap-2">
            <i className="fas fa-money-bill-trend-up text-blue-600 text-xs"></i>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Leak Finder Platinum v4.2.1</span>
        </div>
        <div className="flex items-center gap-6">
            <button onClick={() => openLegal('PRIVACY')} className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">Privacy Policy</button>
            <button onClick={() => openLegal('TOS')} className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">Terms of Service</button>
            <button onClick={() => openLegal('SUPPORT')} className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">Support Desk</button>
        </div>
      </footer>
    </div>
  );
};

export default App;