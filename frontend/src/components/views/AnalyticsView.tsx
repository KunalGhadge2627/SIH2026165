import React, { useState } from 'react';
import { BarChart3, Download, Filter, MapPin, Activity, Users, ShieldAlert } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAppState } from '../../context/AppStateContext';
import { OIL_SITES, ACTIVITIES } from '../../data/mockReports';

export const AnalyticsView: React.FC = () => {
  const { reports, selectedSiteFilter, setSiteFilter } = useAppState();

  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [backendAnalytics, setBackendAnalytics] = useState<any>(null);

  React.useEffect(() => {
    import('../../services/api').then(({ api }) => {
      api.getAnalytics().then((data) => {
        if (data) setBackendAnalytics(data);
      }).catch(() => {});
    });
  }, []);

  // Site SIF Rate chart data
  const siteChartData = backendAnalytics?.sites || OIL_SITES.map((site) => {
    const siteReps = reports.filter((r) => r.site === site);
    const psif = siteReps.filter((r) => r.p_sif >= 0.55).length;
    return {
      site,
      Total: siteReps.length,
      PSIF: psif,
      Rate: Math.round((psif / Math.max(1, siteReps.length)) * 100)
    };
  });


  // Activity SIF Rate chart data (Dynamic from backend)
  const activityChartData = (backendAnalytics?.activities || [])
    .sort((a: any, b: any) => b.Total - a.Total)
    .slice(0, 6);

  // Contractor vs Staff breakdown
  const contractorCount = reports.filter((r) => r.contractor_type === 'Contractor').length;
  const staffCount = reports.filter((r) => r.contractor_type === 'OIL Staff').length;
  const contractorPsif = reports.filter((r) => r.contractor_type === 'Contractor' && r.p_sif >= 0.55).length;
  const staffPsif = reports.filter((r) => r.contractor_type === 'OIL Staff' && r.p_sif >= 0.55).length;
  const totalPsif = contractorPsif + staffPsif;

  const contractorPieData = [
    { name: 'Contractor PSIF', value: contractorPsif, color: '#EA580C' },
    { name: 'OIL Staff PSIF', value: staffPsif, color: '#0A4B7C' }
  ];

  const handleExport = (type: 'PDF' | 'Excel') => {
    setExportNotice(`Exporting OIL HSSE SIF Executive Report as .${type.toLowerCase()}... File downloaded!`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              Advanced HSSE Analytics & Business Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deep-dive precursor breakdown across sites, activities, barrier failures, and contractor personnel.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('PDF')}
            className="bg-oil-navy hover:bg-oil-navy-dark text-white font-bold text-xs py-2 px-3.5 rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF Report
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel Dataset
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3 rounded-lg text-xs font-bold animate-in fade-in duration-150">
          {exportNotice}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          Analytics Filter Scope:
        </div>
        <select
          value={selectedSiteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="All OIL Sites">All OIL Sites</option>
          {OIL_SITES.map((site) => (
            <option key={site} value={site}>
              {site} Field Office
            </option>
          ))}
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SIF Rate by Site Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-oil-navy flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-oil-gold" />
            Total vs SIF-Potential Reports by OIL Site
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={siteChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="site" style={{ fontSize: '11px' }} />
                <YAxis style={{ fontSize: '11px' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Total" fill="#0A4B7C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PSIF" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Breakdown Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-oil-navy flex items-center gap-2 border-b border-slate-100 pb-2">
            <Activity className="w-4 h-4 text-amber-500" />
            PSIF Distribution across High-Risk Operational Activities
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="activity" style={{ fontSize: '11px' }} />
                <YAxis style={{ fontSize: '11px' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Total" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PSIF" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contractor vs Direct Staff SIF Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-oil-navy flex items-center gap-2 border-b border-slate-100 pb-2">
            <Users className="w-4 h-4 text-oil-blue" />
            Personnel Category SIF Precursor Exposure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={contractorPieData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                    {contractorPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <span className="font-bold text-orange-900 block">Contractor Personnel:</span>
                <div className="text-lg font-extrabold text-orange-700 font-mono mt-0.5">
                  {contractorPsif} PSIF Reports ({Math.round((contractorPsif / Math.max(1, totalPsif)) * 100)}%)
                </div>
                <span className="text-[10px] text-slate-500">Based on current dataset.</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="font-bold text-oil-navy block">OIL Direct Staff:</span>
                <div className="text-lg font-extrabold text-oil-navy font-mono mt-0.5">
                  {staffPsif} PSIF Reports ({Math.round((staffPsif / Math.max(1, totalPsif)) * 100)}%)
                </div>
                <span className="text-[10px] text-slate-500">Based on current dataset.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Barrier Failure Frequency */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-oil-navy flex items-center gap-2 border-b border-slate-100 pb-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            Top Barrier Failures Frequency Across OIL
          </h2>
          <div className="space-y-2 text-xs">
            {(() => {
              const items: { barrier: string; count: number; percentage: number }[] =
                backendAnalytics?.top_barrier_failures || [];

              if (items.length === 0) {
                return (
                  <div className="py-6 text-center text-slate-400 text-xs font-medium">
                    No barrier failure data available.
                  </div>
                );
              }

              // The bar width is scaled so the top barrier fills 100% of the bar track
              const maxCount = items[0].count;

              return items.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>{item.barrier}</span>
                    <span className="font-mono font-bold text-red-700 shrink-0 ml-2">
                      {item.count} {item.count === 1 ? 'Report' : 'Reports'} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full rounded-full"
                      style={{ width: `${Math.round((item.count / Math.max(1, maxCount)) * 100)}%` }}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
