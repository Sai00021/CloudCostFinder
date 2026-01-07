
import { CloudResource } from './types';

export const MOCK_RESOURCES: CloudResource[] = [
  {
    id: 'vm-prod-01',
    name: 'web-frontend-v1',
    type: 'VM',
    region: 'us-central1',
    monthlyCost: 45.00,
    status: 'ACTIVE',
    metrics: { cpuAvg: 12, memoryAvg: 45 }
  },
  {
    id: 'gke-cluster-dev',
    name: 'dev-autopilot-cluster',
    type: 'GKE',
    region: 'us-east1',
    monthlyCost: 210.00,
    status: 'IDLE',
    metrics: { nodeCount: 5, podDensity: 0.12, cpuAvg: 3 }
  },
  {
    id: 'func-image-proc',
    name: 'image-processor-old',
    type: 'FUNC',
    region: 'europe-west2',
    monthlyCost: 15.00,
    status: 'UNUSED',
    metrics: { invocationCount: 0, lastAccessed: '2023-11-01' }
  },
  {
    id: 'vm-db-replica',
    name: 'db-replica-unused',
    type: 'VM',
    region: 'europe-west1',
    monthlyCost: 180.00,
    status: 'IDLE',
    metrics: { cpuAvg: 0.5, memoryAvg: 10 }
  },
  {
    id: 'bucket-logs-2022',
    name: 'archive-logs-2022',
    type: 'STORAGE',
    region: 'us-east1',
    monthlyCost: 12.50,
    status: 'UNUSED',
    metrics: { storageSizeGb: 500, lastAccessed: '2023-01-15' }
  },
  {
    id: 'api-unused-01',
    name: 'Vision API (Legacy)',
    type: 'API',
    region: 'global',
    monthlyCost: 5.00,
    status: 'UNUSED',
    metrics: { requestCount: 0 }
  },
  {
    id: 'sql-dev-instance',
    name: 'dev-postgresql-huge',
    type: 'SQL',
    region: 'asia-east1',
    monthlyCost: 320.00,
    status: 'IDLE',
    metrics: { cpuAvg: 1.2, memoryAvg: 5 }
  }
];
