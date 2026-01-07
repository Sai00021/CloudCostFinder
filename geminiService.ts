import { GoogleGenAI, Type } from "@google/genai";
import { CloudResource, AuditResult, ResourceType } from './types';

export const analyzeCloudCosts = async (resources: CloudResource[]): Promise<AuditResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Act as an Enterprise FinOps Strategic Lead. Perform an exhaustive multi-dimensional audit of these cloud assets for "Cost Leakage":
  ${JSON.stringify(resources)}
  
  Critical Evaluative Vectors:
  1. GKE (Kubernetes): Identify node pools with sub-15% pod density, non-preemptible usage in development environments, or expensive machine series (e.g. A2-series) for low-throughput tasks.
  2. Serverless (Functions): Flag cold/stale functions with high memory reservation (> 512MB) but near-zero monthly invocations.
  3. VM & Storage Tiering: Detect persistent disks unattached for > 48h, orphaned snapshots from deleted instances, and regional replicas with < 1% CPU utilization over a 30-day window.
  4. Metadata Compliance: Flag assets missing mission-critical "cost-center", "project-owner", or "lifecycle-tier" tagging requirements.
  5. Carbon ROI: Calculate regional energy intensity variance (e.g., us-central1 vs europe-west1) and CO2 impact of wasted cycles.
  
  For EVERY leak identified, you MUST provide:
  - Specific "taggingSuggestion"
  - The resource's "region"
  - A 3-4 sentence forensic "inDepthAnalysis" explaining the economic and technical root cause.
  
  Output STRICT JSON format:
  - leaks: Array of {resourceId, resourceName, type, region, monthlyWaste, finding, inDepthAnalysis, recommendation, severity (CRITICAL|WARNING|INFO), status ('OPEN'), carbonImpactKg, taggingSuggestion, assignee}.
  - categoryBreakdown: Array of {category: ResourceType, totalWaste: number}.
  - summary: A 2-sentence executive strategic brief suitable for CTO review.
  - wasteScore: (0-100) 100 being perfectly lean architecture.
  - totalPotentialSavings, carbonSavingsKg, forecastedAnnualWaste.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leaks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                resourceId: { type: Type.STRING },
                resourceName: { type: Type.STRING },
                type: { type: Type.STRING },
                region: { type: Type.STRING },
                monthlyWaste: { type: Type.NUMBER },
                finding: { type: Type.STRING },
                inDepthAnalysis: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                status: { type: Type.STRING },
                carbonImpactKg: { type: Type.NUMBER },
                severity: { type: Type.STRING, enum: ['CRITICAL', 'WARNING', 'INFO'] },
                taggingSuggestion: { type: Type.STRING },
                assignee: { type: Type.STRING }
              },
              required: ["resourceId", "resourceName", "type", "region", "monthlyWaste", "finding", "inDepthAnalysis", "recommendation", "taggingSuggestion"]
            }
          },
          categoryBreakdown: { 
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                totalWaste: { type: Type.NUMBER }
              },
              required: ["category", "totalWaste"]
            }
          },
          summary: { type: Type.STRING },
          totalPotentialSavings: { type: Type.NUMBER },
          carbonSavingsKg: { type: Type.NUMBER },
          forecastedAnnualWaste: { type: Type.NUMBER },
          wasteScore: { type: Type.NUMBER }
        },
        required: ["leaks", "categoryBreakdown", "summary", "totalPotentialSavings", "wasteScore"]
      }
    }
  });

  const rawResult = JSON.parse(response.text || "{}");
  
  const categoryRecord: Record<ResourceType, number> = {
    VM: 0, STORAGE: 0, API: 0, SQL: 0, LB: 0, GKE: 0, FUNC: 0
  };
  
  if (Array.isArray(rawResult.categoryBreakdown)) {
    rawResult.categoryBreakdown.forEach((item: any) => {
      if (item.category && item.category in categoryRecord) {
        categoryRecord[item.category as ResourceType] = item.totalWaste || 0;
      }
    });
  }

  return {
    ...rawResult,
    categoryBreakdown: categoryRecord
  } as AuditResult;
};