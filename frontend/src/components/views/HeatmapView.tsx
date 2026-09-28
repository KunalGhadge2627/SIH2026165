import React, { useState, useMemo } from 'react';
import { Grid, Filter, Info, ShieldAlert, ArrowRight, MapPin } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { IOGP_LIFE_SAVING_RULES } from '../../data/mockRules';
import { LifeSavingRuleName, HeatmapCell } from '../../types/safety';

// ─── types ────────────────────────────────────────────────────────────────────
interface BackendHeatmapCell {
  site: string;
  rule: string;
  psif_count: number;
  total_sif_at_site: number;
  density: number;
  risk_level: string;
}

export const HeatmapView: React.FC = () => {
  const { reports, navigateTo, selectedSiteFilter, setSiteFilter } = useAppState();

  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [backendHeatmap, setBackendHeatmap] = useState<BackendHeatmapCell[] | null>(null);

  // Fetch dynamic heatmap from backend analytics endpoint
  React.useEffect(() => {
    import('../../services/api').then(({ api }) => {
      api.getAnalytics().then((data) => {
        if (data && Array.isArray(data.heatmap)) {
          setBackendHeatmap(data.heatmap);
        }
      }).catch(() => {});
    });
  }, []);

  const rules = IOGP_LIFE_SAVING_RULES.map((r) => r.name);

  // Extract real sites present in current report dataset
  const availableSites = useMemo(() => {
    const sList = Array.from(new Set(reports.map((r) => r.site).filter(Boolean))).sort();
    return sList.length > 0 ? sList : ['Duliajan', 'Digboi', 'Moran', 'Jorhat', 'Lakhimpur'];
  }, [reports]);

  const sites = selectedSiteFilter === 'All OIL Sites' ? availableSites : [selectedSiteFilter];

  // ── Compute heatmap from reports state (real client-side calculation) ────────
  // SIF potential: p_sif >= 0.55 or classification === 'PSIF Potential'
  // Percentage = (SIF reports for rule at site / total SIF reports at site) * 100
  const localHeatmap = useMemo((): BackendHeatmapCell[] => {
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

    // SIF-potential reports only
    const sifReports = reports.filter((r) => r.p_sif >= 0.55 || r.classification === 'PSIF Potential');

    // Total SIF-potential reports per site (denominator)
    const siteSifTotal: Record<string, number> = {};
    for (const r of sifReports) {
      const site = r.site;
      siteSifTotal[site] = (siteSifTotal[site] || 0) + 1;
    }

    // Cell counts: site × rule
    const cellCount: Record<string, number> = {};
    for (const r of sifReports) {
      const site = r.site;
      // Multi-label LSR mapping: handle multiple rules per report
      const rawRules = (r.life_saving_rules || []).map((lsr) => lsr.rule);
      const canonRules = [...new Set(
        rawRules
          .map((raw) => LSR_CANON[raw] || raw)
          .filter((c): c is string => Boolean(c))
      )];

      for (const lsr of canonRules) {
        const key = `${site}|||${lsr}`;
        cellCount[key] = (cellCount[key] || 0) + 1;
      }
    }

    const cells: BackendHeatmapCell[] = [];
    for (const [key, cnt] of Object.entries(cellCount)) {
      const [site, rule] = key.split('|||');
      const siteTotal = siteSifTotal[site] || 1;
      const density = Math.round((cnt / siteTotal) * 1000) / 10;
      const risk_level =
        density >= 35 ? 'CRITICAL' :
        density >= 25 ? 'HIGH' :
        density >= 15 ? 'MEDIUM' : 'LOW';
      cells.push({ site, rule, psif_count: cnt, total_sif_at_site: siteTotal, density, risk_level });
    }
    return cells;
  }, [reports]);

  // Prefer backend data if populated; otherwise use local computation from real reports
  const heatmapSource: BackendHeatmapCell[] = (backendHeatmap && backendHeatmap.length > 0) ? backendHeatmap : localHeatmap;

  // Build lookup index: "site|||rule" -> cell
  const cellIndex = useMemo(() => {
    const idx: Record<string, BackendHeatmapCell> = {};
    for (const cell of heatmapSource) {
      idx[`${cell.site}|||${cell.rule}`] = cell;
    }
    return idx;
  }, [heatmapSource]);

  // Pre-calculate site SIF totals for tooltip & denominator display
  const siteSifCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const sifReports = reports.filter((r) => r.p_sif >= 0.55 || r.classification === 'PSIF Potential');
    for (const r of sifReports) {
      counts[r.site] = (counts[r.site] || 0) + 1;
    }
    return counts;
  }, [reports]);

  // Helper for cell color intensity based on calculated percentage & count
  const getCellBgClass = (psifCount: number, density: number) => {
    if (psifCount === 0) return 'bg-slate-50 text-slate-400 hover:bg-slate-100';
    if (density >= 35.0 || psifCount >= 25)
      return 'bg-red-600 text-white font-extrabold shadow-sm hover:bg-red-700';
    if (density >= 25.0 || psifCount >= 15)
      return 'bg-orange-500 text-white font-bold hover:bg-orange-600';
    if (density >= 15.0 || psifCount >= 8)
      return 'bg-amber-400 text-amber-950 font-bold hover:bg-amber-500';
    return 'bg-emerald-100 text-emerald-900 font-semibold hover:bg-emerald-200';
  };

  const totalSifCount = reports.filter((r) => r.p_sif >= 0.55 || r.classification === 'PSIF Potential').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              SIF-Potential Report Distribution by Site & Life-Saving Rule
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Shows the number and percentage of SIF-potential reports at each OIL site mapped to each Life-Saving Rule.
          </p>
        </div>

        {/* Site Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSiteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="bg-transparent font-bold text-oil-navy focus:outline-none cursor-pointer"
          >
            <option value="All OIL Sites">All OIL Sites ({availableSites.length} Sites)</option>
            {availableSites.map((site) => (
              <option key={site} value={site}>
                {site} Field ({siteSifCounts[site] || 0} SIF)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">Precursor Density Legend:</span>
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold">Critical (&gt;35%)</span>
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded font-bold">High (25-35%)</span>
            <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded font-bold">Medium (15-25%)</span>
            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">Low (&lt;15%)</span>
          </div>
        </div>

        <div className="text-slate-500 text-[11px] flex items-center gap-1 font-medium">
          <Info className="w-3.5 h-3.5 text-oil-blue" />
          Click any heatmap cell to view and filter underlying safety reports in AI Review.
        </div>
      </div>

      {/* Main Heatmap Grid Matrix */}
      {totalSifCount === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs font-medium">
          No SIF-potential reports available in the current dataset.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left bg-slate-100 font-extrabold text-xs text-oil-navy border border-slate-200 min-w-[140px]">
                    OIL Sites / Assets
                  </th>
                  {rules.map((rule) => (
                    <th
                      key={rule}
                      className="p-2 bg-slate-50 font-bold text-[11px] text-slate-700 border border-slate-200 min-w-[110px] max-w-[130px] leading-tight"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-oil-blue" />
                        <span>{rule}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sites.map((site) => {
                  const siteTotalSif = siteSifCounts[site] || 0;

                  return (
                    <tr key={site}>
                      <td className="p-3 text-left font-bold text-xs text-oil-navy bg-slate-50 border border-slate-200 whitespace-nowrap">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            <span>{site}</span>
                          </div>
                          <span className="text-[10px] font-normal text-slate-500">
                            ({siteTotalSif} SIF)
                          </span>
                        </div>
                      </td>

                      {rules.map((ruleName) => {
                        // Look up the real cell; default to zero if not found
                        const raw = cellIndex[`${site}|||${ruleName}`];
                        const psifCount = raw?.psif_count ?? 0;
                        const density = raw?.density ?? (siteTotalSif > 0 ? Math.round((psifCount / siteTotalSif) * 1000) / 10 : 0);

                        const cell: HeatmapCell = {
                          site,
                          rule: ruleName as LifeSavingRuleName,
                          psif_count: psifCount,
                          total_reports: siteTotalSif,
                          density,
                          risk_level: (raw?.risk_level ?? (density >= 35 ? 'CRITICAL' : density >= 25 ? 'HIGH' : density >= 15 ? 'MEDIUM' : 'LOW')) as HeatmapCell['risk_level'],
                        };

                        const cellBg = getCellBgClass(cell.psif_count, cell.density);

                        return (
                          <td
                            key={ruleName}
                            onMouseEnter={() => setHoveredCell(cell)}
                            onMouseLeave={() => setHoveredCell(null)}
                            onClick={() =>
                              navigateTo('triage', {
                                site: cell.site,
                                ruleName: cell.rule,
                              })
                            }
                            className={`p-3 border border-slate-200 text-xs transition cursor-pointer relative ${cellBg}`}
                          >
                            <div className="font-extrabold text-sm">{cell.psif_count}</div>
                            <div className="text-[10px] opacity-80">{cell.density}%</div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Cell Details Drawer / Tooltip Card */}
      {hoveredCell && (
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-xl border border-slate-800 flex items-center justify-between text-xs animate-in fade-in duration-100">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-oil-gold text-oil-navy rounded-lg font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-oil-gold">
                {hoveredCell.site} Field × {hoveredCell.rule}
              </div>
              <div className="text-slate-300 mt-0.5">
                <span className="font-bold text-white">{hoveredCell.psif_count} SIF-potential report(s)</span>{' '}
                out of{' '}
                {hoveredCell.total_reports} total SIF-potential reports at {hoveredCell.site} ({hoveredCell.density}%)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded text-xs font-extrabold uppercase border ${
                hoveredCell.risk_level === 'CRITICAL'
                  ? 'bg-red-600 text-white border-red-500'
                  : hoveredCell.risk_level === 'HIGH'
                  ? 'bg-orange-500 text-white border-orange-400'
                  : hoveredCell.risk_level === 'MEDIUM'
                  ? 'bg-amber-500 text-oil-navy border-amber-400'
                  : 'bg-slate-700 text-slate-300 border-slate-600'
              }`}
            >
              Risk: {hoveredCell.risk_level}
            </span>
            <button
              onClick={() =>
                navigateTo('triage', {
                  site: hoveredCell.site,
                  ruleName: hoveredCell.rule,
                })
              }
              className="bg-white text-oil-navy hover:bg-slate-100 font-bold px-3 py-1.5 rounded text-xs transition flex items-center gap-1"
            >
              View {hoveredCell.psif_count} Report{hoveredCell.psif_count === 1 ? '' : 's'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
