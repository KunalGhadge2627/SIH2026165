import { HeatmapCell, LifeSavingRuleName, RiskLevel } from '../types/safety';
import { OIL_SITES, MOCK_SAFETY_REPORTS } from './mockReports';
import { IOGP_LIFE_SAVING_RULES } from './mockRules';

export function calculatePrecursorHeatmap(): HeatmapCell[] {
  const heatmap: HeatmapCell[] = [];

  OIL_SITES.forEach((site) => {
    IOGP_LIFE_SAVING_RULES.forEach((ruleObj) => {
      const ruleName = ruleObj.name;

      // Filter reports matching site and rule
      const siteRuleReports = MOCK_SAFETY_REPORTS.filter(
        (r) => r.site === site && r.life_saving_rules.some((lsr) => lsr.rule === ruleName)
      );

      const total_reports = siteRuleReports.length > 0 ? siteRuleReports.length : Math.floor(Math.random() * 12) + 8;
      const psifReports = siteRuleReports.filter((r) => r.p_sif >= 0.55);
      const psif_count = siteRuleReports.length > 0 ? psifReports.length : Math.floor(total_reports * (0.1 + Math.random() * 0.25));

      const density = Math.round((psif_count / Math.max(1, total_reports)) * 1000) / 10;

      let risk_level: RiskLevel = 'LOW';
      if (density >= 35.0 || psif_count >= 18) risk_level = 'CRITICAL';
      else if (density >= 25.0 || psif_count >= 12) risk_level = 'HIGH';
      else if (density >= 15.0 || psif_count >= 6) risk_level = 'MEDIUM';

      heatmap.push({
        site,
        rule: ruleName as LifeSavingRuleName,
        psif_count,
        total_reports,
        density,
        risk_level
      });
    });
  });

  return heatmap;
}

export const PRECURSOR_HEATMAP_DATA: HeatmapCell[] = calculatePrecursorHeatmap();
