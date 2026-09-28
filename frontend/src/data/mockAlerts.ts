import { EarlyWarningAlert, SafetyReport } from '../types/safety';
import { MOCK_SAFETY_REPORTS } from './mockReports';

const LSR_CANON: Record<string, string> = {
  'Energy Isolation': 'Energy Isolation',
  'Line of Fire': 'Line of Fire',
  'Hot Work': 'Hot Work',
  'Confined Space': 'Confined Space',
  'Work at Height': 'Working at Height',
  'Working at Height': 'Working at Height',
  'Lifting': 'Safe Mechanical Lifting',
  'Safe Mechanical Lifting': 'Safe Mechanical Lifting',
  'Driving': 'Driving',
  'Bypassing Safety Controls': 'Bypassing Safety Controls',
  'Work Authorisation': 'Work Authorisation',
  'Work Authorization': 'Work Authorisation',
};

const LSR_TITLES: Record<string, string> = {
  'Energy Isolation': 'Energy Isolation Precursor Recurrence',
  'Working at Height': 'Working at Height Fall Protection Deficit',
  'Confined Space': 'Confined Space Entry Barrier Failure',
  'Hot Work': 'Hot Work Ignition Precursor Density Spike',
  'Safe Mechanical Lifting': 'Mechanical Lifting Zone Violation Pattern',
  'Driving': 'Vehicle Movement Safety Control Gap',
  'Bypassing Safety Controls': 'Safety Critical Control Bypass Anomaly',
  'Work Authorisation': 'Work Permit Authorisation Protocol Gap',
  'Line of Fire': 'Line of Fire Machinery Exclusion Gap',
};

const LSR_ACTIONS: Record<string, string> = {
  'Energy Isolation': 'Conduct targeted Energy Isolation & LOTO verification audit across {site} process units and maintenance teams.',
  'Working at Height': 'Inspect all elevated work platforms and enforce 100% tie-off compliance and toe-board installation at {site} Field.',
  'Confined Space': 'Enforce mandatory gas clearance testing and dedicated standby attendant verification prior to vessel entry at {site}.',
  'Hot Work': 'Inspect hot work permit conditions and verify continuous combustible gas detector calibration at {site}.',
  'Safe Mechanical Lifting': 'Verify crane rigging tackle certification and re-establish barricaded exclusion zones for lifting operations at {site}.',
  'Line of Fire': 'Audit exclusion zones and ensure clear line-of-sight communication between spotters and operators at {site}.',
  'Driving': 'Reinforce speed limits and mandatory seatbelt compliance for all field vehicles operating in {site}.',
  'Bypassing Safety Controls': 'Review all active safety device overrides and ensure Management of Change (MOC) sign-off at {site}.',
  'Work Authorisation': 'Audit active PTW documentation and verify pre-job toolbox talks across all active work sites in {site}.',
};

export function calculateDynamicEarlyWarnings(reportsList: SafetyReport[]): EarlyWarningAlert[] {
  const sifReports = reportsList.filter((r) => r.p_sif >= 0.55 || r.classification === 'PSIF Potential');

  // Group by (site, LSR)
  const groups: Record<string, SafetyReport[]> = {};
  for (const r of sifReports) {
    const site = r.site || 'Unknown';
    const rawRules = (r.life_saving_rules || []).map((lsr) => lsr.rule);
    const canonRules = [...new Set(rawRules.map((raw) => LSR_CANON[raw]).filter(Boolean))];

    for (const lsr of canonRules) {
      const key = `${site}|||${lsr}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    }
  }

  const alerts: EarlyWarningAlert[] = [];
  for (const [key, reps] of Object.entries(groups)) {
    if (reps.length < 2) continue; // Only recurring / concentrated patterns

    const [site, lsr] = key.split('|||');
    const reportIds = reps.map((r) => r.report_id).sort();
    const dates = reps.map((r) => r.date || '2026-08-31').sort();
    const latestDate = dates[dates.length - 1];

    // Find common barrier
    const barrierCounts: Record<string, number> = {};
    for (const r of reps) {
      const bList = r.precursors?.barrier_failures || [];
      for (const b of bList) {
        if (b && b.trim()) {
          barrierCounts[b.trim()] = (barrierCounts[b.trim()] || 0) + 1;
        }
      }
    }
    const sortedBarriers = Object.entries(barrierCounts).sort((a, b) => b[1] - a[1]);
    const topBarrier = sortedBarriers.length > 0 ? sortedBarriers[0][0] : `${lsr} control verification gap`;

    // Simple hash for deterministic ID
    let hash = 0;
    const str = `${site}_${lsr}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(0, 4);
    const alertId = `ALT-2026-${hexHash}`;

    const title = LSR_TITLES[lsr] || `${lsr} Precursor Pattern Detected`;
    const actionTpl = LSR_ACTIONS[lsr] || 'Review and reinforce safety barrier controls at {site} Field.';
    const recommendedAction = actionTpl.replace('{site}', site);

    alerts.push({
      id: alertId,
      title,
      site,
      severity: reps.length >= 2 ? 'CRITICAL' : 'HIGH',
      metric_text: `${reps.length} PSIF reports flagged (${dates[0]} to ${dates[dates.length - 1]})`,
      common_precursor: topBarrier,
      recommended_action: recommendedAction,
      timestamp: `${latestDate} 14:30`,
      status: 'Active',
      related_report_ids: reportIds,
    });
  }

  alerts.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return alerts;
}

export const MOCK_EARLY_WARNING_ALERTS: EarlyWarningAlert[] = calculateDynamicEarlyWarnings(MOCK_SAFETY_REPORTS);
