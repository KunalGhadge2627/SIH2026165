import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, ArrowUpDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { RiskBadge } from '../common/RiskBadge';
import { OIL_SITES, ACTIVITIES } from '../../data/mockReports';

export const SafetyReportsView: React.FC = () => {
  const {
    reports,
    selectedSiteFilter,
    setSiteFilter,
    selectedRiskFilter,
    setRiskFilter,
    selectedStatusFilter,
    setStatusFilter,
    navigateTo
  } = useAppState();

  const [search, setSearch] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'p_sif' | 'date'>('p_sif');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const pageSize = 15;

  const filtered = reports.filter((r) => {
    if (selectedSiteFilter !== 'All OIL Sites' && r.site !== selectedSiteFilter) return false;
    if (selectedRiskFilter !== 'All' && r.risk_level !== selectedRiskFilter) return false;
    if (selectedStatusFilter !== 'All' && r.review_status !== selectedStatusFilter) return false;
    if (reportTypeFilter !== 'All' && r.report_type !== reportTypeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        r.report_id.toLowerCase().includes(q) ||
        r.site.toLowerCase().includes(q) ||
        r.activity.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.life_saving_rules.some((lsr) => lsr.rule.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'p_sif') {
      return sortOrder === 'desc' ? b.p_sif - a.p_sif : a.p_sif - b.p_sif;
    } else {
      return sortOrder === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
    }
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: 'p_sif' | 'date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">Master Safety Reports Repository</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of Unsafe Act/Condition observations, Near Misses, and Incident reports across OIL.
          </p>
        </div>
        <div className="text-xs font-bold text-oil-navy bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Showing {sorted.length.toLocaleString()} of {reports.length.toLocaleString()} Total Reports
        </div>
      </div>

      {/* Multi-Column Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Report ID, description, keyword..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-oil-blue"
            />
          </div>

          {/* Site Filter */}
          <select
            value={selectedSiteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All OIL Sites">All OIL Sites</option>
            {OIL_SITES.map((site) => (
              <option key={site} value={site}>
                {site}
              </option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRiskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Review Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Review Statuses</option>
            <option value="Awaiting HSE Review">Awaiting Review</option>
            <option value="Confirmed PSIF">Confirmed PSIF</option>
            <option value="Rejected PSIF">Rejected PSIF</option>
          </select>
        </div>
      </div>

      {/* Reports Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-oil-navy text-white font-semibold">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-oil-navy-light"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Site & Location</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description Snippet</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-oil-navy-light"
                  onClick={() => toggleSort('p_sif')}
                >
                  <div className="flex items-center justify-end gap-1">
                    PSIF Prob <ArrowUpDown className="w-3 h-3 text-oil-gold" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Life-Saving Rule</th>
                <th className="py-3 px-4 text-center">Risk Level</th>
                <th className="py-3 px-4 text-center">Review Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    No safety reports found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginated.map((report) => (
                  <tr
                    key={report.report_id}
                    className="hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => navigateTo('case-detail', { reportId: report.report_id })}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-oil-navy">{report.report_id}</td>
                    <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">{report.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{report.site}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{report.location}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border text-[11px]">
                        {report.report_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium max-w-xs truncate" title={report.description}>
                      {report.description}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-mono">
                      <span className={report.p_sif >= 0.85 ? 'text-red-600 font-bold' : ''}>
                        {(report.p_sif * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {report.life_saving_rules[0] ? (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-oil-blue text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                          <ShieldAlert className="w-2.5 h-2.5" />
                          {report.life_saving_rules[0].rule}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <RiskBadge level={report.risk_level} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          report.review_status === 'Confirmed PSIF'
                            ? 'bg-red-100 text-red-800'
                            : report.review_status === 'Rejected PSIF'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {report.review_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('case-detail', { reportId: report.report_id });
                        }}
                        className="bg-oil-navy hover:bg-oil-navy-dark text-white p-1.5 rounded transition"
                        title="View Report Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-medium">
            Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-800">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
