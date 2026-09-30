import { SafetyReport, PrecursorPattern, EarlyWarningAlert } from '../types/safety';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '';

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
  top_alert: EarlyWarningAlert | null;
  alerts?: EarlyWarningAlert[];
  patterns: PrecursorPattern[];
}

export interface AnalyticsResponse {
  sites: Array<{ site: string; Total: number; PSIF: number }>;
  activities: Array<{ activity: string; Total: number; PSIF: number }>;
  contractor_psif: number;
  staff_psif: number;
  top_barriers?: Array<{ name: string; count: number; pct: number }>;
  top_barrier_failures?: Array<{ barrier: string; count: number; percentage: number }>;
  heatmap?: Array<{
    site: string;
    rule: string;
    psif_count: number;
    total_sif_at_site: number;
    density: number;
    risk_level: string;
  }>;
}

export const api = {
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getReports(): Promise<SafetyReport[]> {
    const res = await fetch(`${API_BASE_URL}/api/reports`);
    if (!res.ok) throw new Error('Failed to fetch reports from backend');
    return res.json();
  },

  async getReportById(reportId: string): Promise<{ document: any; safety_report: SafetyReport }> {
    const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}`);
    if (!res.ok) throw new Error(`Failed to fetch report '${reportId}'`);
    return res.json();
  },

  async getPatterns(): Promise<PrecursorPattern[]> {
    const res = await fetch(`${API_BASE_URL}/api/patterns`);
    if (!res.ok) throw new Error('Failed to fetch patterns from backend');
    return res.json();
  },

  async getDashboard(): Promise<DashboardMetricsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  async getAnalytics(): Promise<AnalyticsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async getAlerts(): Promise<EarlyWarningAlert[]> {
    const res = await fetch(`${API_BASE_URL}/api/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async updateAlertStatus(alertId: string, status: EarlyWarningAlert['status']): Promise<{ status: string; alert_id: string; new_status: string }> {
    const res = await fetch(`${API_BASE_URL}/api/alerts/${alertId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(`Failed to update status for alert '${alertId}'`);
    return res.json();
  },

  async analyzeReport(payload: SingleReportPayload): Promise<{ is_duplicate?: boolean; analysis: any; document: any; safety_report: SafetyReport }> {
    const res = await fetch(`${API_BASE_URL}/api/reports/analyze`, {
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
    const res = await fetch(`${API_BASE_URL}/api/reports/upload-csv`, {
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
    window.location.href = `${API_BASE_URL}/api/reports/template/csv`;
  }
};
