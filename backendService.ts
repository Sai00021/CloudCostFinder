import { 
  User, UserSettings, AuditRecord, LogEntry, SubscriptionTier, 
  GovernancePolicy, ApiKey, ComplianceStatus, AutoKillConfig,
  Notification, TaggingStandard, LeakStatus, CloudResource, CostLeak,
  IdentityProfile, BillingPortalData, Invoice, FeedbackSubmission
} from './types';
import { MOCK_RESOURCES } from './mockData';

class BackendService {
  private storageKey = 'cloud_leak_finder_db_v4_platinum_edition';
  private logs: LogEntry[] = [];
  private logListeners: ((logs: LogEntry[]) => void)[] = [];

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      this.initDB();
    }
  }

  private initDB() {
    const history: AuditRecord[] = [];
    const now = Date.now();
    const oneMonth = 86400000 * 30;

    // Generate high-fidelity historical data with a realistic cyclical waste pattern
    for (let i = 12; i > 0; i--) {
      const ts = new Date(now - i * oneMonth);
      const cyclicalVariance = 1 + (Math.cos(i / 1.5) * 0.4); // Simulates growth and optimization cycles
      history.push({
        id: `aud-hist-${i}`,
        timestamp: ts.toISOString(),
        savingsFound: Math.floor(920 * cyclicalVariance),
        carbonSaved: Math.floor(45 * cyclicalVariance),
        leakCount: Math.floor(14 * cyclicalVariance) + 2
      });
    }

    const initialData = {
      user: null,
      resources: MOCK_RESOURCES,
      snoozedResources: {} as Record<string, string>,
      leakDueDates: {} as Record<string, string>,
      remediationBin: [] as CostLeak[],
      onboardingComplete: false,
      settings: {
        auditFrequency: 'DAILY',
        notificationsEnabled: true,
        tier: 'ENTERPRISE',
        preferredCurrency: 'USD'
      },
      identity: {
        organization: 'Enterprise Cloud Solutions Global (FinOps Div)',
        mfaEnabled: true,
        lastLogin: new Date().toISOString(),
        ipAddress: '10.0.94.212',
        recoveryEmail: 'strategic-ops@enterprise-global.io'
      },
      billing: {
        paymentMethod: { brand: 'Corporate Amex', last4: '9902' },
        nextBillingDate: '2024-12-15',
        invoices: [
          { id: 'INV-ENT-PLAT-2023-11', date: '2023-11-01', amount: 999.00, status: 'PAID' },
          { id: 'INV-ENT-PLAT-2023-10', date: '2023-10-01', amount: 999.00, status: 'PAID' },
          { id: 'INV-ENT-PLAT-2023-09', date: '2023-09-01', amount: 999.00, status: 'PAID' }
        ]
      },
      notifications: [
        { id: 'n1', title: 'Deep Architectural Audit Succeeded', message: 'Project "Global-Operations-Core" analyzed. $24.2k potential MoM savings identified across multi-region edge.', timestamp: new Date().toISOString(), read: false, type: 'SUCCESS' },
        { id: 'n2', title: 'Governance Violation Detected', message: 'Region "asia-northeast1" showing critical tagging non-compliance in auto-scaled node pools.', timestamp: new Date().toISOString(), read: false, type: 'ALERT' }
      ],
      taggingStandards: [
        { key: 'cost-center', required: true, allowedValues: ['R&D', 'STRAT', 'CORE', 'MARKETING'], description: 'Primary financial asset allocation key.' },
        { key: 'lifecycle-tier', required: true, allowedValues: ['production', 'staging', 'dev', 'sandbox'], description: 'Resource runtime isolation level.' },
        { key: 'project-owner', required: true, description: 'Direct accountability employee ID.' }
      ],
      autoKill: {
        globalEnabled: false,
        dryRunMode: true,
        policies: [
          { resourceType: 'VM', enabled: true, cpuThreshold: 2, idleDaysThreshold: 3, action: 'TERMINATE' },
          { resourceType: 'GKE', enabled: true, idleDaysThreshold: 15, action: 'DOWNSCALE' },
          { resourceType: 'STORAGE', enabled: true, idleDaysThreshold: 90, action: 'NOTIFY' }
        ]
      },
      auditHistory: history,
      governance: [
        { id: 'POL-PLAT-01', title: 'Compute Quota Restriction (High-Performance)', description: 'Prevents A2/G2 instance classes without Director-level signature.', status: 'COMPLIANT', lastChecked: new Date().toISOString() },
        { id: 'POL-PLAT-02', title: 'Orphaned Volume Enforcement', description: 'Automatic snapshot and delete for disks unattached for > 14 days.', status: 'NON_COMPLIANT', lastChecked: new Date().toISOString() }
      ],
      apiKeys: [{ id: 'AK-PLAT-MASTER-1', key: 'lf_platinum_v4_prod_secure_token_master_001_restricted', created: '2023-10-15', lastUsed: '1 minute ago' }],
      compliance: [
        { 
          framework: 'SOC2 Type II - Platinum', 
          score: 96, 
          items: [
            { task: 'Bi-factor Identity Enforcement', done: true },
            { task: 'Immutable Remediation Audit Trail', done: true },
            { task: 'Quarterly Strategic Disclosure', done: true }
          ] 
        },
        { 
          framework: 'FedRAMP High / IL5', 
          score: 64, 
          items: [
            { task: 'Cross-region risk isolation protocol', done: true },
            { task: 'Autonomous remediation evidence logging', done: false }
          ] 
        }
      ]
    };
    localStorage.setItem(this.storageKey, JSON.stringify(initialData));
  }

  private getData() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }

  private saveData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  public addLog(message: string, level: LogEntry['level'] = 'INFO') {
    const log: LogEntry = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    this.logs = [log, ...this.logs].slice(0, 100);
    this.logListeners.forEach(cb => cb(this.logs));
  }

  public onLogUpdate(cb: (logs: LogEntry[]) => void) {
    this.logListeners.push(cb);
  }

  public async submitFeedback(feedback: FeedbackSubmission): Promise<void> {
    this.addLog(`Feedback [${feedback.category}]: Captured ${feedback.rating}-star UX metrics from ${feedback.userEmail}.`, "SUCCESS");
  }

  public async getOnboardingComplete(): Promise<boolean> {
    return this.getData().onboardingComplete;
  }

  public async setOnboardingComplete(complete: boolean): Promise<void> {
    const db = this.getData();
    db.onboardingComplete = complete;
    this.saveData(db);
  }

  public async getIdentityProfile(): Promise<IdentityProfile> {
    return this.getData().identity;
  }

  public async updateIdentityProfile(profile: Partial<IdentityProfile>): Promise<void> {
    const db = this.getData();
    db.identity = { ...db.identity, ...profile };
    this.saveData(db);
    this.addLog("Security: Identity posture synchronized with Platinum Core", "SUCCESS");
  }

  public async updateUser(updates: Partial<User>): Promise<User> {
    const db = this.getData();
    db.user = { ...db.user, ...updates };
    this.saveData(db);
    this.addLog(`Security: Global user profile serialized`, "SUCCESS");
    return db.user;
  }

  public async getBillingData(): Promise<BillingPortalData> {
    return this.getData().billing;
  }

  public async updatePaymentMethod(brand: string, last4: string): Promise<void> {
    const db = this.getData();
    db.billing.paymentMethod = { brand, last4 };
    this.saveData(db);
    this.addLog(`Financial: Payment settlement path updated to ${brand}`, "SUCCESS");
  }

  public async getTaggingStandards(): Promise<TaggingStandard[]> {
    return this.getData().taggingStandards || [];
  }

  public async addTaggingStandard(standard: TaggingStandard): Promise<void> {
    const db = this.getData();
    db.taggingStandards = [...(db.taggingStandards || []), standard];
    this.saveData(db);
    this.addLog(`Governance: Enforced Platinum requirement - ${standard.key}`, 'SUCCESS');
  }

  public async deleteTaggingStandard(key: string): Promise<void> {
    const db = this.getData();
    db.taggingStandards = (db.taggingStandards || []).filter((s: TaggingStandard) => s.key !== key);
    this.saveData(db);
    this.addLog(`Governance: Requirement revoked - ${key}`, 'WARN');
  }

  public async publishTaggingStandards(standards: TaggingStandard[]): Promise<void> {
    const db = this.getData();
    db.taggingStandards = standards;
    
    const newNotif: Notification = {
      id: `ntf-${Date.now()}`,
      title: 'Strategic Policies Published',
      message: `Enterprise asset tagging baseline updated with ${standards.length} keys. Deployment pending for all regional node pools.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'SUCCESS'
    };
    db.notifications = [newNotif, ...(db.notifications || [])];
    
    this.saveData(db);
    this.addLog(`Governance: Multi-region Policy Propagation Finished`, 'SUCCESS');
  }

  public async getRemediationBin(): Promise<CostLeak[]> {
    return this.getData().remediationBin || [];
  }

  public async markLeakResolved(leak: CostLeak): Promise<void> {
    const db = this.getData();
    const resolvedLeak = { ...leak, status: 'RESOLVED' as LeakStatus };
    db.remediationBin = [resolvedLeak, ...(db.remediationBin || [])];
    this.saveData(db);
    this.addLog(`Autonomous: Executed decommissioning of ${leak.resourceName}. Assets purged.`, 'SUCCESS');
  }

  public async clearRemediationBin(): Promise<void> {
    const db = this.getData();
    db.remediationBin = [];
    this.saveData(db);
    this.addLog(`System: Remediated asset history purged for cycle security.`, 'INFO');
  }

  public async getResources(): Promise<CloudResource[]> {
    return this.getData().resources || [];
  }

  public async getResource(id: string): Promise<CloudResource | undefined> {
    const db = this.getData();
    return db.resources.find((r: CloudResource) => r.id === id);
  }

  public async updateResourceTags(resourceId: string, tags: Record<string, string>): Promise<void> {
    const db = this.getData();
    db.resources = db.resources.map((r: CloudResource) => 
      r.id === resourceId ? { ...r, tags } : r
    );
    this.saveData(db);
    this.addLog(`Metadata: Enriched asset ${resourceId} with Platinum classification`, 'SUCCESS');
  }

  public async updateLeakDueDate(resourceId: string, dueDate: string): Promise<void> {
    const db = this.getData();
    if (!db.leakDueDates) db.leakDueDates = {};
    db.leakDueDates[resourceId] = dueDate;
    this.saveData(db);
  }

  public getLeakDueDates(): Record<string, string> {
    return this.getData().leakDueDates || {};
  }

  public async snoozeResource(resourceId: string, hours: number): Promise<void> {
    const db = this.getData();
    const expiry = Date.now() + (hours * 3600000);
    db.snoozedResources[resourceId] = new Date(expiry).toISOString();
    this.saveData(db);
    this.addLog(`System: Strategic alert for ${resourceId} suppressed for ${hours}h.`, 'INFO');
  }

  public getSnoozedResourceIds(): string[] {
    const db = this.getData();
    const snoozed = db.snoozedResources || {};
    const now = Date.now();
    return Object.entries(snoozed)
      .filter(([_, expiry]) => new Date(expiry as string).getTime() > now)
      .map(([id]) => id);
  }

  public async login(userData: Partial<User>): Promise<User> {
    const db = this.getData();
    const userId = userData.id || 'usr-' + Math.random().toString(36).substr(2, 6);
    const userName = userData.name || 'Platinum Strategic Admin';
    const user: User = {
      id: userId,
      name: userName,
      email: userData.email || 'exec-strat@enterprise-global.io',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      role: userData.role || 'Principal Strategic Architect',
      tier: db.settings.tier,
      provider: userData.provider || 'enterprise_sso'
    };
    db.user = user;
    db.identity.lastLogin = new Date().toISOString();
    this.saveData(db);
    this.addLog(`Security: Session authorized for executive user ${user.email}`, 'SUCCESS');
    return user;
  }

  public async logout(): Promise<void> {
    const db = this.getData();
    db.user = null;
    this.saveData(db);
    this.addLog(`Security: Platinum session token revoked.`, 'INFO');
  }

  public async recordAudit(data: { savingsFound: number; carbonSaved: number; leakCount: number }): Promise<void> {
    const db = this.getData();
    const newRecord: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...data
    };
    db.auditHistory = [newRecord, ...(db.auditHistory || [])];
    this.saveData(db);
  }

  public async triggerComplianceAudit(): Promise<void> {
    this.addLog("Compliance: Starting posture re-certification across multi-cloud edge...", 'INFO');
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const db = this.getData();
    if (db.compliance) {
      db.compliance = db.compliance.map((c: ComplianceStatus) => ({
        ...c,
        score: Math.min(100, c.score + Math.floor(Math.random() * 4) + 1),
        items: c.items.map(item => Math.random() > 0.8 ? { ...item, done: true } : item)
      }));
    }
    
    this.saveData(db);
    this.addLog("Compliance: Infrastructure posture re-certified for Cycle 4.", 'SUCCESS');
  }

  public async processPolicyUpload(name: string, content: string): Promise<void> {
    this.addLog(`Governance: Ingesting Terraform-HCL policy ${name}`, 'INFO');
    await new Promise(resolve => setTimeout(resolve, 1500));
    const db = this.getData();
    const newPolicy: GovernancePolicy = {
      id: `POL-STRAT-${Date.now()}`,
      title: name.split('.')[0].toUpperCase().replace(/_/g, ' '),
      description: `Automated ingest from ${name}. Semantic analysis verified against Platinum schema.`,
      status: 'PENDING',
      lastChecked: new Date().toISOString()
    };
    db.governance = [newPolicy, ...(db.governance || [])];
    this.saveData(db);
    this.addLog(`Governance: Platinum Policy ${name} queued for global enforcement`, 'SUCCESS');
  }

  public async getDocumentation(type: string): Promise<any> {
    const docs: Record<string, any> = {
      'API Reference': {
        title: 'Enterprise FinOps Platinum SDK & API',
        sections: [
          {
            title: 'Global Inventory Synchronization',
            content: 'Synchronize your entire multi-project inventory with our strategic reasoning core via secure edge tunnel.',
            code: 'GET /v4/platinum/inventory?scope=organization&filter=idle\nAuthorization: Bearer <API_KEY>'
          },
          {
            title: 'Autonomous Remediation Webhook',
            content: 'Listen for real-time autonomous resource termination events to sync local state repositories.',
            code: 'POST /v4/platinum/webhooks/remediate\n{ "event": "VM_KILLED_STRATEGIC", "resource": "vm-core-prod-01" }'
          }
        ]
      }
    };
    return Promise.resolve(docs[type] || { title: 'Strategic Intelligence Hub', sections: [] });
  }

  public async processSubscription(tier: SubscriptionTier): Promise<void> {
    const db = this.getData();
    db.settings.tier = tier;
    if (db.user) db.user.tier = tier;
    this.saveData(db);
  }

  public getNotifications(): Notification[] { return this.getData().notifications || []; }
  public async getAutoKillConfig(): Promise<AutoKillConfig> { return this.getData().autoKill; }
  public async getGovernance(): Promise<GovernancePolicy[]> { return this.getData().governance; }
  public getHistory(): AuditRecord[] { return this.getData().auditHistory || []; }
  public getSettings(): UserSettings { return this.getData().settings; }
  public getApiKeys(): Promise<ApiKey[]> { return Promise.resolve(this.getData().apiKeys); }
  public getCompliance(): Promise<ComplianceStatus[]> { return Promise.resolve(this.getData().compliance); }
  public async logDocumentationAccess(type: string) {}
  public async bookCall(data: any) {}
  public async updateAutoKillConfig(config: AutoKillConfig) {
    const db = this.getData();
    db.autoKill = config;
    this.saveData(db);
  }
  public async saveSettings(settings: UserSettings) {
    const db = this.getData();
    db.settings = settings;
    this.saveData(db);
  }
}

export const backend = new BackendService();