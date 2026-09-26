import { SafetyReport, PrecursorPattern } from '../types/safety';

const API_BASE_URL = typeof window !== 'undefined' && window.location.port === '5173'
  ? '/api'
  : 'http://127.0.0.1:8000/api';

export interface SingleReportPayload {
  report_id?: string;
  report_type: string;
  site: string;
  date: string;
  activity: string;
  narrative: string;
  location?: string;
  person_type?: string;
  immediate_cause?: string;
  contributing_factors?: string;
  corrective_action?: string;
}

export interface CsvUploadResponse {
  total_rows: number;
  processed: number;
  failed: number;
  duplicates: number;
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

  async getReportById(reportId: string): Promise<{ document: any; safety_report: SafetyReport }> {
    const res = await fetch(`${API_BASE_URL}/reports/${reportId}`);
    if (!res.ok) throw new Error(`Failed to fetch report '${reportId}'`);
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

  async analyzeReport(payload: SingleReportPayload): Promise<{ is_duplicate?: boolean; analysis: any; document: any; safety_report: SafetyReport }> {
    const res = await fetch(`${API_BASE_URL}/reports/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_id: payload.report_id || undefined,
        report_type: payload.report_type,
        site: payload.site,
        date: payload.date,
        activity: payload.activity,
        narrative: payload.narrative,
        location: payload.location,
        person_type: payload.person_type,
        immediate_cause: payload.immediate_cause,
        contributing_factors: payload.contributing_factors,
        corrective_action: payload.corrective_action,
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
  },

  downloadCsvTemplate() {
    window.location.href = `${API_BASE_URL}/reports/template/csv`;
  }
};
