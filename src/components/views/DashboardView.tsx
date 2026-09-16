import React from 'react';
import {
  FileText,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckSquare,
  TrendingUp,
  MapPin,
  Activity,
  ArrowRight,
  Filter,
  Info
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useAppState } from '../../context/AppStateContext';
import { KpiCard } from '../common/KpiCard';
import { RiskBadge } from '../common/RiskBadge';
import { OIL_SITES, ACTIVITIES } from '../../data/mockReports';

export const DashboardView: React.FC = () => {
  const {
    reports,
    selectedSiteFilter,
    setSiteFilter,
    selectedTimeFilter,
    setTimeFilter,
    navigateTo
  } = useAppState();

  // Filter reports according to selected site
  const filteredReports = reports.filter((r) =>
    selectedSiteFilter === 'All OIL Sites' ? true : r.site === selectedSiteFilter
  );

  const totalReportsCount = filteredReports.length;
  const psifReports = filteredReports.filter((r) => r.p_sif >= 0.55);
  const psifCount = psifReports.length;
  const psifDensity = Math.round((psifCount / Math.max(1, totalReportsCount)) * 1000) / 10;
  const highPriorityCases = filteredReports.filter((r) => r.risk_level === 'CRITICAL' || r.risk_level === 'HIGH').length;
  const awaitingReviewCount = filteredReports.filter((r) => r.review_status === 'Awaiting HSE Review').length;
  const totalLsrViolations = filteredReports.reduce((acc, r) => acc + r.life_saving_rules.length, 0);

  // SIF Donut Chart Data
  const pieData = [
    { name: 'PSIF / SIF-Potential', value: psifCount, color: '#DC2626' },
    { name: 'Non-SIF Potential', value: totalReportsCount - psifCount - awaitingReviewCount, color: '#16A34A' },
    { name: 'Under Review', value: awaitingReviewCount, color: '#D97706' }
  ];

  // Site Risk Ranking Data
  const siteRiskRanking = OIL_SITES.map((site) => {
    const siteReps = reports.filter((r) => r.site === site);
    const sitePsif = siteReps.filter((r) => r.p_sif >= 0.55).length;
    const rate = Math.round((sitePsif / Math.max(1, siteReps.length)) * 1000) / 10;
    let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (rate >= 22.0 || sitePsif >= 120) riskLevel = 'CRITICAL';
    else if (rate >= 17.0) riskLevel = 'HIGH';
    else if (rate >= 12.0) riskLevel = 'MEDIUM';

    return {
      site,
      total: siteReps.length,
      psif: sitePsif,
      rate,
      riskLevel
    };
  }).sort((a, b) => b.rate - a.rate);

  // Activity Risk Ranking Data
  const activityRiskRanking = ACTIVITIES.slice(0, 8).map((act) => {
    const actReps = reports.filter((r) => r.activity === act);
    const actPsif = actReps.filter((r) => r.p_sif >= 0.55).length;
    const rate = Math.round((actPsif / Math.max(1, actReps.length)) * 1000) / 10;
    
    // Pick main precursor
    const topPrecursor =
      act === 'Confined Space Entry'
        ? 'Gas testing omitted / no standby attendant'
        : act === 'Hot Work'
        ? 'Welding near flammables without gas test'
        : act === 'Energy Isolation'
        ? 'LOTO omitted / zero-energy unverified'
        : act === 'Mechanical Lifting'
        ? 'Damaged rigging sling / un-tagged hoist'
        : 'Safety barrier deviation';

    let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (rate >= 20.0) riskLevel = 'CRITICAL';
    else if (rate >= 15.0) riskLevel = 'HIGH';
    else if (rate >= 10.0) riskLevel = 'MEDIUM';

    return {
      activity: act,
      total: actReps.length,
      psif: actPsif,
      rate,
      topPrecursor,
      riskLevel
    };
  }).sort((a, b) => b.rate - a.rate);

  return (
    <div className="space-y-6">
      {/* Top Banner / Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              HSSE Intelligence Dashboard
            </h1>
            <span className="bg-oil-navy text-white text-[11px] font-bold px-2 py-0.5 rounded">
              OIL Corporate HSSE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor SIF potential, precursor exposure, and Life-Saving Rule compliance across OIL operations.
          </p>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {['Today', '7 Days', '30 Days', '90 Days', 'Custom Range'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1 rounded-md transition ${
                  selectedTimeFilter === tf
                    ? 'bg-oil-navy text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSiteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="bg-transparent font-bold text-oil-navy focus:outline-none cursor-pointer"
            >
              <option value="All OIL Sites">All OIL Sites (Assam & Offshore)</option>
              {OIL_SITES.map((site) => (
                <option key={site} value={site}>
                  {site} Field Office
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 6 KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Reports"
          value={totalReportsCount.toLocaleString()}
          subtitle="+8.4% vs prev 30 days"
          icon={FileText}
          badgeText="UA/UC & Incidents"
          onClick={() => navigateTo('reports')}
        />
        <KpiCard
          title="PSIF / SIF-Potential"
          value={psifCount.toLocaleString()}
          subtitle={`${psifDensity}% of total safety reports`}
          icon={AlertTriangle}
          badgeText="Requires Action"
          badgeType="critical"
          onClick={() => navigateTo('triage', { statusFilter: 'All', riskFilter: 'CRITICAL' })}
        />
        <KpiCard
          title="High Priority Cases"
          value={highPriorityCases.toLocaleString()}
          subtitle="Critical & High risk level"
          icon={Flame}
          badgeText="HSE Review"
          badgeType="high"
          onClick={() => navigateTo('triage', { riskFilter: 'CRITICAL' })}
        />
        <KpiCard
          title="SIF Precursor Density"
          value={`${psifDensity}%`}
          subtitle="Target threshold: < 10.0%"
          icon={TrendingUp}
          badgeText="Precursor Exposure"
          badgeType="warning"
          onClick={() => navigateTo('heatmap')}
        />
        <KpiCard
          title="LSR Violations"
          value={totalLsrViolations.toLocaleString()}
          subtitle="Auto-mapped by AI NLP"
          icon={ShieldCheck}
          badgeText="9 Rules Mapped"
          badgeType="info"
          onClick={() => navigateTo('rules')}
        />
        <KpiCard
          title="Awaiting Review"
          value={awaitingReviewCount.toLocaleString()}
          subtitle="HSE Officer action needed"
          icon={CheckSquare}
          badgeText="Pending Queue"
          badgeType="warning"
          onClick={() => navigateTo('triage', { statusFilter: 'Awaiting HSE Review' })}
        />
      </div>

      {/* SIF Risk Overview & AI Confidence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-oil-navy">SIF Risk Overview & Distribution</h2>
              <p className="text-xs text-slate-500">
                Proportion of reports classified by AI as having Potential for Serious Injury or Fatality (PSIF).
              </p>
            </div>
            <button
              onClick={() => navigateTo('analytics')}
              className="text-xs text-oil-blue font-bold hover:underline flex items-center gap-1"
            >
              Detailed Analytics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} Reports`, 'Count']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>AI Classification Confidence Breakdown</span>
                  <span className="text-oil-navy font-mono">95.0% Overall Accuracy</span>
                </div>
                
                {/* Confidence Bars */}
                <div className="space-y-2 mt-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>High Confidence (&gt;90%)</span>
                      <span className="font-bold">78%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Medium Confidence (75%-90%)</span>
                      <span className="font-bold">16%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '16%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Low Confidence (&lt;75%)</span>
                      <span className="font-bold">6%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '6%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-blue-900">
                <Info className="w-4 h-4 text-oil-blue flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">High-Recall AI Architecture:</span> AI prioritizes high recall (95%) to minimize missed SIF-potential cases. All flagged reports undergo mandatory human HSE validation.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fast Action Card / High Risk Benchmark Case */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-xs font-extrabold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                Benchmark SIF Case
              </span>
              <RiskBadge level="CRITICAL" size="sm" />
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 mb-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-red-900 mb-1">
                <span>OIL-INC-2026-00482</span>
                <span className="bg-red-200 text-red-800 px-1.5 py-0.5 rounded text-[10px]">PSIF 94.7%</span>
              </div>
              <p className="text-xs text-red-950 font-medium line-clamp-3">
                “Worker entered confined space before gas testing was completed and without an attendant present.”
              </p>
              <div className="mt-2 text-[11px] text-red-800 flex items-center gap-3 font-semibold">
                <span>Site: Duliajan</span>
                <span>•</span>
                <span>Rule: Confined Space</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Activity:</span>
                <span className="font-bold text-slate-800">Confined Space Entry</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Barrier Failure:</span>
                <span className="font-bold text-red-700">No Gas Test & No Attendant</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Review Status:</span>
                <span className="font-bold text-amber-600">Awaiting HSE Review</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateTo('case-detail', { reportId: 'OIL-INC-2026-00482' })}
            className="w-full mt-4 bg-oil-navy hover:bg-oil-navy-dark text-white font-bold text-xs py-2.5 px-4 rounded-lg transition shadow flex items-center justify-center gap-2"
          >
            Inspect & Review Case <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tables Section: Site Risk Ranking & Activity Risk Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Risk Ranking Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-oil-navy flex items-center gap-2">
                <MapPin className="w-4 h-4 text-oil-gold" />
                Highest SIF Precursor Density — Sites
              </h3>
              <p className="text-xs text-slate-500">OIL Operational Sites ranked by PSIF precursor rate.</p>
            </div>
            <button
              onClick={() => navigateTo('heatmap')}
              className="text-xs text-oil-blue font-bold hover:underline"
            >
              View Heatmap →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Site</th>
                  <th className="py-2.5 px-3 text-right">Total Reports</th>
                  <th className="py-2.5 px-3 text-right">PSIF Reports</th>
                  <th className="py-2.5 px-3 text-right">SIF Rate</th>
                  <th className="py-2.5 px-3 text-center">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteRiskRanking.map((row, idx) => (
                  <tr
                    key={row.site}
                    onClick={() => navigateTo('triage', { site: row.site })}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-oil-navy flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-oil-blue"></span>
                      {row.site} Field
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">{row.total}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-600">{row.psif}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">{row.rate}%</td>
                    <td className="py-2.5 px-3 text-center">
                      <RiskBadge level={row.riskLevel} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Risk Ranking Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-oil-navy flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                Highest-Risk Operational Activities
              </h3>
              <p className="text-xs text-slate-500">Activities with highest precursor concentration.</p>
            </div>
            <button
              onClick={() => navigateTo('patterns')}
              className="text-xs text-oil-blue font-bold hover:underline"
            >
              Explore Patterns →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Activity</th>
                  <th className="py-2.5 px-3 text-right">Reports</th>
                  <th className="py-2.5 px-3 text-right">PSIF</th>
                  <th className="py-2.5 px-3 text-right">SIF Rate</th>
                  <th className="py-2.5 px-3">Main Precursor Mode</th>
                  <th className="py-2.5 px-3 text-center">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activityRiskRanking.map((row) => (
                  <tr
                    key={row.activity}
                    onClick={() => navigateTo('reports')}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-800">{row.activity}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">{row.total}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-600">{row.psif}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">{row.rate}%</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] truncate max-w-[140px]" title={row.topPrecursor}>
                      {row.topPrecursor}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <RiskBadge level={row.riskLevel} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
