import React, { useState } from 'react';
import { Grid, Filter, Info, ShieldAlert, ArrowRight, MapPin } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { PRECURSOR_HEATMAP_DATA } from '../../data/mockHeatmap';
import { OIL_SITES } from '../../data/mockReports';
import { IOGP_LIFE_SAVING_RULES } from '../../data/mockRules';
import { LifeSavingRuleName, HeatmapCell } from '../../types/safety';

export const HeatmapView: React.FC = () => {
  const { navigateTo, selectedSiteFilter, setSiteFilter } = useAppState();

  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const rules = IOGP_LIFE_SAVING_RULES.map((r) => r.name);
  const sites = selectedSiteFilter === 'All OIL Sites' ? OIL_SITES : [selectedSiteFilter];

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
                    const cell = PRECURSOR_HEATMAP_DATA.find(
                      (c) => c.site === site && c.rule === ruleName
                    ) || {
                      site,
                      rule: ruleName as LifeSavingRuleName,
                      psif_count: 0,
                      total_reports: 12,
                      density: 0,
                      risk_level: 'LOW'
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
                            ruleName: cell.rule
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
                <span className="font-bold text-white">{hoveredCell.psif_count} PSIF Reports</span> out of{' '}
                {hoveredCell.total_reports} Total Reports (Density Rate: {hoveredCell.density}%)
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
                  ruleName: hoveredCell.rule
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
