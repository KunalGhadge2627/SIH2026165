import { EarlyWarningAlert } from '../types/safety';

export const MOCK_EARLY_WARNING_ALERTS: EarlyWarningAlert[] = [
  {
    id: 'ALT-2026-0891',
    title: 'Energy Isolation Precursor Spike Detected',
    site: 'Duliajan',
    severity: 'CRITICAL',
    metric_text: '3 PSIF reports in the last 14 days',
    common_precursor: 'Isolation not verified / missing LOTO tag',
    recommended_action: 'Conduct targeted Energy Isolation & LOTO compliance review across Duliajan Gas Compressor Plants.',
    timestamp: '2026-08-30 18:20',
    status: 'Active'
  },
  {
    id: 'ALT-2026-0884',
    title: 'Repeated Confined Space Barrier Deficit',
    site: 'Duliajan',
    severity: 'CRITICAL',
    metric_text: '4 Confined Space entry violations in 30 days',
    common_precursor: 'Missing gas test certificate & attendant gap',
    recommended_action: 'Issue mandatory safety stand-down for all vessel maintenance contractors at Duliajan Refinery Unit.',
    timestamp: '2026-08-28 14:10',
    status: 'Active'
  },
  {
    id: 'ALT-2026-0872',
    title: 'Hot Work Precursor Density Approaching Threshold',
    site: 'Naharkatia',
    severity: 'HIGH',
    metric_text: 'Hot work PSIF rate increased to 31.4%',
    common_precursor: 'Welding near drains without continuous gas monitoring',
    recommended_action: 'Inspect all active hot work permits in Tank Farm 12 and verify LEL detector calibration.',
    timestamp: '2026-08-27 09:45',
    status: 'Investigating'
  },
  {
    id: 'ALT-2026-0855',
    title: 'Rigging Sling Failure Warning on Active Crane Operations',
    site: 'Moran',
    severity: 'HIGH',
    metric_text: '2 Damaged sling reports flagged by AI Triage',
    common_precursor: 'Uninspected wire rope slings on heavy rig lifts',
    recommended_action: 'Audit rig floor lifting gear inventory and discard all uncertified rigging tackle.',
    timestamp: '2026-08-25 11:30',
    status: 'Acknowledged'
  }
];
