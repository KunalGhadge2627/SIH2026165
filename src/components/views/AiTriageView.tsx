import React, { useState } from 'react';
import { BrainCircuit, ShieldAlert, ArrowRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { RiskBadge } from '../common/RiskBadge';
import { OIL_SITES } from '../../data/mockReports';

export const AiTriageView: React.FC = () => {
  const { reports, selectedSiteFilter, setSiteFilter, navigateTo, updateReportStatus } = useAppState();

  const [triageFilter, setTriageFilter] = useState<'All' | 'Awaiting' | 'Critical'>('Awaiting');

  const filtered = reports.filter((r) => {
    if (selectedSiteFilter !== 'All OIL Sites' && r.site !== selectedSiteFilter) return false;
    if (triageFilter === 'Awaiting' && r.review_status !== 'Awaiting HSE Review') return false;
    if (triageFilter === 'Critical' && r.risk_level !== 'CRITICAL') return false;
    return true;
  }).sort((a, b) => b.p_sif - a.p_sif);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">AI Safety Report Triage</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated NLP classification queue prioritizing incoming safety reports by Serious Injury & Fatality probability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setTriageFilter('Awaiting')}
              className={`px-3 py-1 rounded-md transition ${
                triageFilter === 'Awaiting' ? 'bg-oil-navy text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Awaiting Review ({reports.filter((r) => r.review_status === 'Awaiting HSE Review').length})
            </button>
            <button
              onClick={() => setTriageFilter('Critical')}
              className={`px-3 py-1 rounded-md transition ${
                triageFilter === 'Critical' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Critical Risk
            </button>
            <button
              onClick={() => setTriageFilter('All')}
              className={`px-3 py-1 rounded-md transition ${
                triageFilter === 'All' ? 'bg-oil-navy text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              All Triage
            </button>
          </div>

          <select
            value={selectedSiteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All OIL Sites">All OIL Sites</option>
            {OIL_SITES.map((site) => (
              <option key={site} value={site}>
                {site}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Triage Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-oil-navy text-white font-semibold">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Date & Site</th>
                <th className="py-3 px-4">Type & Activity</th>
                <th className="py-3 px-4">Report Description</th>
                <th className="py-3 px-4 text-center">PSIF Probability</th>
                <th className="py-3 px-4 text-center">Classification</th>
                <th className="py-3 px-4 text-center">Life-Saving Rule</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    No triage reports pending matching the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => {
                  const prob = report.p_sif * 100;
                  return (
                    <tr
                      key={report.report_id}
                      className="hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => navigateTo('case-detail', { reportId: report.report_id })}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-oil-navy whitespace-nowrap">
                        {report.report_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{report.site}</div>
                        <div className="text-[10px] text-slate-500">{report.date}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{report.activity}</div>
                        <div className="text-[10px] text-slate-500">{report.report_type}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate font-medium" title={report.description}>
                        {report.description}
                      </td>
                      {/* Probability Progress Bar */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="w-28 mx-auto">
                          <div className="flex justify-between text-[11px] font-mono font-bold mb-1">
                            <span className={prob >= 85 ? 'text-red-700 font-extrabold' : 'text-slate-800'}>
                              {prob.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                prob >= 85 ? 'bg-red-600' : prob >= 65 ? 'bg-orange-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${prob}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            report.classification === 'PSIF Potential'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {report.classification}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {report.life_saving_rules[0] ? (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-oil-blue text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            {report.life_saving_rules[0].rule}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Unmapped</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <RiskBadge level={report.risk_level} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            report.review_status === 'Confirmed PSIF'
                              ? 'bg-red-100 text-red-800'
                              : report.review_status === 'Rejected PSIF'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}
                        >
                          {report.review_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateTo('case-detail', { reportId: report.report_id });
                          }}
                          className="bg-oil-navy hover:bg-oil-navy-dark text-white font-bold text-[11px] px-2.5 py-1 rounded transition flex items-center gap-1 mx-auto shadow-sm"
                        >
                          Triage <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
