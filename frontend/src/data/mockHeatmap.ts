import { HeatmapCell, LifeSavingRuleName, RiskLevel } from '../types/safety';
import { MOCK_SAFETY_REPORTS } from './mockReports';
import { IOGP_LIFE_SAVING_RULES } from './mockRules';

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

export function calculatePrecursorHeatmap(): HeatmapCell[] {
  const heatmap: HeatmapCell[] = [];
  const sifReports = MOCK_SAFETY_REPORTS.filter((r) => r.p_sif >= 0.55 || r.classification === 'PSIF Potential');
  
  // Available sites from real data
  const availableSites = Array.from(new Set(MOCK_SAFETY_REPORTS.map((r) => r.site).filter(Boolean))).sort();

  // Calculate total SIF per site
  const siteSifTotals: Record<string, number> = {};
  for (const r of sifReports) {
    siteSifTotals[r.site] = (siteSifTotals[r.site] || 0) + 1;
  }

  availableSites.forEach((site) => {
    const totalSifAtSite = siteSifTotals[site] || 0;

    IOGP_LIFE_SAVING_RULES.forEach((ruleObj) => {
      const ruleName = ruleObj.name;

      // Filter SIF reports matching site and rule
      const matchingSifReports = sifReports.filter((r) => {
        if (r.site !== site) return false;
        const mappedRules = (r.life_saving_rules || []).map((lsr) => LSR_CANON[lsr.rule] || lsr.rule);
        return mappedRules.includes(ruleName);
      });

      const psif_count = matchingSifReports.length;
      const density = totalSifAtSite > 0 ? Math.round((psif_count / totalSifAtSite) * 1000) / 10 : 0;

      let risk_level: RiskLevel = 'LOW';
      if (density >= 35.0 || psif_count >= 18) risk_level = 'CRITICAL';
      else if (density >= 25.0 || psif_count >= 12) risk_level = 'HIGH';
      else if (density >= 15.0 || psif_count >= 6) risk_level = 'MEDIUM';

      heatmap.push({
        site,
        rule: ruleName as LifeSavingRuleName,
        psif_count,
        total_reports: totalSifAtSite,
        density,
        risk_level
      });
    });
  });

  return heatmap;
}

export const PRECURSOR_HEATMAP_DATA: HeatmapCell[] = calculatePrecursorHeatmap();
