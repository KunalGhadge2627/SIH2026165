import { SafetyReport, PrecursorPattern } from '../types/safety';

const API_BASE_URL = typeof window !== 'undefined' && window.location.port === '5173'
  ? '/api'
  : 'http://127.0.0.1:8000/api';


export interface SingleReportPayload {
  report_id?: string;
  report_type: 'near_miss' | 'unsafe_act' | 'unsafe_condition' | 'incident';
  text: string;
  site: string;
  location: string;
  activity: string;
  date?: string;
  contractor_type?: 'OIL Staff' | 'Contractor';
  immediate_causes?: string;
  contributing_factors?: string;
  corrective_actions?: string;
}

export interface CsvUploadResponse {
  processed: number;
  sif_potential: number;
  results: SafetyReport[];
}

export interface DashboardMetricsResponse {
  total_reports: number;
  sif_potential: number;
  awaiting_review: number;
  high_priority: number;
  sif_rate: number;
  site_distribution: Array<{ site: string; total: number; sif: number }>;
  monthly_trend: Array<{ month: string; reports: number; sif: number }>;
  top_alert: any;
  patterns: PrecursorPattern[];
}

export interface AnalyticsResponse {
  sites: Array<{ site: string; Total: number; PSIF: number }>;
  activities: Array<{ activity: string; Total: number; PSIF: number }>;
  contractor_psif: number;
  staff_psif: number;
  top_barriers: Array<{ name: string; count: number; pct: number }>;
}

export const api = {
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getReports(): Promise<SafetyReport[]> {
    const res = await fetch(`${API_BASE_URL}/reports`);
    if (!res.ok) throw new Error('Failed to fetch reports from backend');
    return res.json();
  },

  async getPatterns(): Promise<PrecursorPattern[]> {
    const res = await fetch(`${API_BASE_URL}/patterns`);
    if (!res.ok) throw new Error('Failed to fetch patterns from backend');
    return res.json();
  },

  async getDashboard(): Promise<DashboardMetricsResponse> {
    const res = await fetch(`${API_BASE_URL}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  async getAnalytics(): Promise<AnalyticsResponse> {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async analyzeReport(payload: SingleReportPayload): Promise<{ analysis: any; safety_report: SafetyReport }> {
    const res = await fetch(`${API_BASE_URL}/reports/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_id: payload.report_id,
        report_type: payload.report_type,
        text: payload.text,
        site: payload.site,
        location: payload.location,
        activity: payload.activity,
        metadata: {
          contractor_type: payload.contractor_type || 'Contractor',
          immediate_causes: payload.immediate_causes || '',
          contributing_factors: payload.contributing_factors || '',
          corrective_actions: payload.corrective_actions || ''
        }
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Analysis failed: ${err}`);
    }
    return res.json();
  },

  async uploadCsv(file: File): Promise<CsvUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/reports/upload-csv`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`CSV Upload failed: ${err}`);
    }
    return res.json();
  }
};
