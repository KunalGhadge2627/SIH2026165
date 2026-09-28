import React, { useState, useMemo } from 'react';
import { Grid, Filter, Info, ShieldAlert, ArrowRight, MapPin } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { OIL_SITES } from '../../data/mockReports';
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
  const sites = selectedSiteFilter === 'All OIL Sites' ? OIL_SITES : [selectedSiteFilter];

  // ── Compute heatmap from the reports state as a live fallback ────────────────
  // This runs client-side and uses the same SIF threshold (p_sif >= 0.55)
  // and the same LSR structure as the rest of the application.
  // It is used ONLY when the backend has not yet responded.
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

    // SIF-potential reports only (same threshold as dashboard)
    const sifReports = reports.filter((r) => r.p_sif >= 0.55);

    // Site SIF totals (denominator for percentage)
    const siteSifTotal: Record<string, number> = {};
    // Cell counts
    const cellCount: Record<string, number> = {};

    for (const r of sifReports) {
      const site = r.site;
      siteSifTotal[site] = (siteSifTotal[site] || 0) + 1;

      // Each report can have multiple LSRs — contribute to every matching cell
      const rawRules = (r.life_saving_rules || []).map((lsr) => lsr.rule);
      const canonRules = [...new Set(
        rawRules
          .map((raw) => LSR_CANON[raw])
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

  // Prefer backend data; fall back to local computation
  const heatmapSource: BackendHeatmapCell[] = backendHeatmap ?? localHeatmap;

  // Build lookup: "site|||rule" → cell
  const cellIndex = useMemo(() => {
    const idx: Record<string, BackendHeatmapCell> = {};
    for (const cell of heatmapSource) {
      idx[`${cell.site}|||${cell.rule}`] = cell;
    }
    return idx;
  }, [heatmapSource]);

  // Helper for cell color intensity based on PSIF count & density
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              SIF Precursor Density Heatmap
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Identify concentration of SIF-potential precursor reports across OIL operational sites and Life-Saving Rules.
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
            <option value="All OIL Sites">All OIL Sites</option>
            {OIL_SITES.map((site) => (
              <option key={site} value={site}>
                {site} Field
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
          Click any heatmap cell to view and filter underlying safety reports.
        </div>
      </div>

      {/* Main Heatmap Grid Matrix */}
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
              {sites.map((site) => (
                <tr key={site}>
                  <td className="p-3 text-left font-bold text-xs text-oil-navy bg-slate-50 border border-slate-200 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {site}
                    </div>
                  </td>

                  {rules.map((ruleName) => {
                    // Look up the real cell; default to zero if not found
                    const raw = cellIndex[`${site}|||${ruleName}`];
                    const cell: HeatmapCell = {
                      site,
                      rule: ruleName as LifeSavingRuleName,
                      psif_count: raw?.psif_count ?? 0,
                      // total_reports shown in tooltip = total SIF at site
                      total_reports: raw?.total_sif_at_site ?? 0,
                      density: raw?.density ?? 0,
                      risk_level: (raw?.risk_level ?? 'LOW') as HeatmapCell['risk_level'],
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <span className="font-bold text-white">{hoveredCell.psif_count} PSIF Reports</span>{' '}
                out of{' '}
                {hoveredCell.total_reports} SIF-potential reports at this site (Density: {hoveredCell.density}%)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded text-xs font-extrabold uppercase border ${
                hoveredCell.risk_level === 'CRITICAL'
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-amber-500 text-oil-navy border-amber-400'
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
              Filter Reports <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
