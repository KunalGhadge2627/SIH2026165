export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ReportType = 'Near Miss' | 'Unsafe Act (UA)' | 'Unsafe Condition (UC)' | 'Incident';

export type ReviewStatus = 'Awaiting HSE Review' | 'Confirmed PSIF' | 'Rejected PSIF' | 'Under Investigation';

export type LifeSavingRuleName =
  | 'Bypassing Safety Controls'
  | 'Confined Space'
  | 'Driving'
  | 'Energy Isolation'
  | 'Hot Work'
  | 'Line of Fire'
  | 'Safe Mechanical Lifting'
  | 'Work Authorisation'
  | 'Working at Height';

export interface RuleDetection {
  rule: LifeSavingRuleName;
  confidence: number;
  reason: string;
}

export interface PhraseHighlight {
  text: string;
  category: 'Activity' | 'Barrier Failure' | 'Control Failure' | 'High Energy';
  note: string;
}

export interface ExtractedPrecursors {
  activity: string;
  location: string;
  energy_sources: string[];
  barrier_failures: string[];
  human_factors: string[];
  organizational_factors: string[];
}

export interface HseFeedback {
  confirmed_by?: string;
  confirmed_at?: string;
  comment?: string;
  decision?: 'Confirmed PSIF' | 'Rejected PSIF' | 'Further Review';
}

export interface SafetyReport {
  report_id: string;
  report_type: ReportType;
  site: string;
  date: string;
  activity: string;
  location: string;
  contractor_type: 'OIL Staff' | 'Contractor';
  description: string;
  immediate_causes: string;
  contributing_factors: string;
  corrective_actions: string;
  p_sif: number; // 0 to 1
  classification: 'PSIF Potential' | 'Non-SIF Potential';
  confidence: number; // percentage e.g. 94.7
  life_saving_rules: RuleDetection[];
  precursors: ExtractedPrecursors;
  highlighted_phrases: PhraseHighlight[];
  risk_level: RiskLevel;
  review_status: ReviewStatus;
  hse_feedback?: HseFeedback;
}

export interface HeatmapCell {
  site: string;
  rule: LifeSavingRuleName;
  psif_count: number;
  total_reports: number;
  density: number; // percentage
  risk_level: RiskLevel;
}

export interface PrecursorPattern {
  id: string;
  title: string;
  occurrences: number;
  psif_count: number;
  affected_sites_count: number;
  top_sites: string[];
  primary_rule: LifeSavingRuleName;
  barrier_failure: string;
  severity: RiskLevel;
  description: string;
}

export interface EarlyWarningAlert {
  id: string;
  title: string;
  site: string;
  severity: RiskLevel;
  metric_text: string;
  common_precursor: string;
  recommended_action: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Investigating' | 'Resolved';
}

export interface ModelHealthStats {
  classifier_precision: number;
  classifier_recall: number;
  classifier_f1: number;
  classifier_roc_auc: number;
  lsr_macro_f1: number;
  reviewed_reports_count: number;
  corrections_count: number;
  new_training_labels: number;
  last_retraining_date: string;
  next_retraining_date: string;
  system_status: {
    database: 'Operational' | 'Degraded' | 'Offline';
    ai_api: 'Operational' | 'Degraded' | 'Offline';
    data_pipeline: 'Operational' | 'Degraded' | 'Offline';
    dashboard: 'Operational' | 'Degraded' | 'Offline';
  };
}

export type UserRole = 'HSE Officer' | 'Site Manager' | 'System Administrator';

export interface UserProfile {
  name: string;
  employee_id: string;
  role: UserRole;
  department: string;
  site_scope: string;
}
