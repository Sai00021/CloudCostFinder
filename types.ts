export type ResourceType = 'VM' | 'STORAGE' | 'API' | 'SQL' | 'LB' | 'GKE' | 'FUNC';
export type AuditFrequency = 'OFF' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';
export type LeakStatus = 'OPEN' | 'ASSIGNED' | 'SNOOZED' | 'RESOLVED';

export interface UserSettings {
  auditFrequency: AuditFrequency;
  notificationsEnabled: boolean;
  tier: SubscriptionTier;
  preferredCurrency: string;
}

export interface AutoKillPolicy {
  resourceType: ResourceType;
  enabled: boolean;
  cpuThreshold?: number;
  idleDaysThreshold: number;
  action: 'TERMINATE' | 'DOWNSCALE' | 'NOTIFY';
}

export interface AutoKillConfig {
  globalEnabled: boolean;
  dryRunMode: boolean;
  policies: AutoKillPolicy[];
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  savingsFound: number;
  carbonSaved: number;
  leakCount: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  message: string;
}

export interface GovernancePolicy {
  id: string;
  title: string;
  description?: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING';
  lastChecked: string;
}

export interface TaggingStandard {
  key: string;
  required: boolean;
  allowedValues?: string[];
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ALERT' | 'INFO' | 'SUCCESS';
}

export interface CloudResource {
  id: string;
  name: string;
  type: ResourceType;
  region: string;
  monthlyCost: number;
  status: 'ACTIVE' | 'IDLE' | 'UNUSED';
  tags?: Record<string, string>;
  metrics: {
    cpuAvg?: number;
    memoryAvg?: number;
    lastAccessed?: string;
    requestCount?: number;
    storageSizeGb?: number;
    nodeCount?: number;
    podDensity?: number;
    invocationCount?: number;
  };
}

export interface CostLeak {
  resourceId: string;
  resourceName: string;
  type: ResourceType;
  region: string;
  monthlyWaste: number;
  finding: string;
  inDepthAnalysis?: string;
  recommendation: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: LeakStatus;
  assignee?: string;
  carbonImpactKg: number;
  taggingSuggestion?: string;
  dueDate?: string;
}

export interface AuditResult {
  leaks: CostLeak[];
  summary: string;
  totalPotentialSavings: number;
  carbonSavingsKg: number;
  forecastedAnnualWaste: number;
  wasteScore: number;
  categoryBreakdown: Record<ResourceType, number>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  tier: SubscriptionTier;
  provider?: string;
}

export interface IdentityProfile {
  organization: string;
  mfaEnabled: boolean;
  lastLogin: string;
  ipAddress: string;
  recoveryEmail?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export interface BillingPortalData {
  paymentMethod: {
    brand: string;
    last4: string;
  };
  nextBillingDate: string;
  invoices: Invoice[];
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  grounding?: GroundingChunk[];
  isThinking?: boolean;
}

export interface ApiKey {
  id: string;
  key: string;
  created: string;
  lastUsed: string;
}

export interface ComplianceItem {
  task: string;
  done: boolean;
}

export interface ComplianceStatus {
  framework: string;
  score: number;
  items: ComplianceItem[];
}

export interface FeedbackSubmission {
  rating: number;
  category: 'BUG' | 'IDEA' | 'SUPPORT' | 'GENERAL';
  comment: string;
  timestamp: string;
  userEmail: string;
}