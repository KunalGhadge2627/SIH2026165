import React, { useState } from 'react';
import { Search, X, ShieldAlert, MapPin, FileText, ArrowRight } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { RiskBadge } from './RiskBadge';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, reports, navigateTo } = useAppState();
  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const filteredReports = query.trim()
    ? reports
        .filter(
          (r) =>
            r.report_id.toLowerCase().includes(query.toLowerCase()) ||
            r.site.toLowerCase().includes(query.toLowerCase()) ||
            r.activity.toLowerCase().includes(query.toLowerCase()) ||
            r.description.toLowerCase().includes(query.toLowerCase()) ||
            r.life_saving_rules.some((lsr) => lsr.rule.toLowerCase().includes(query.toLowerCase())) ||
            r.precursors.barrier_failures.some((bf) => bf.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 8)
    : reports.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Report ID (e.g. OIL-INC-2026-00482), Site, Rule, LOTO, Gas Test..."
            className="flex-1 bg-transparent text-sm text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
            autoFocus
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Tag suggestions */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Searches:</span>
          {['OIL-INC-2026-00482', 'LOTO', 'Gas Test', 'Duliajan', 'Confined Space'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="bg-slate-100 hover:bg-oil-navy hover:text-white text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredReports.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching reports or precursors found for "<span className="font-semibold">{query}</span>".
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.report_id}
                onClick={() => {
                  setIsSearchModalOpen(false);
                  navigateTo('case-detail', { reportId: report.report_id });
                }}
                className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-oil-navy">{report.report_id}</span>
                    <RiskBadge level={report.risk_level} size="sm" />
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {report.site}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-1 font-medium">{report.description}</p>

                  <div className="flex items-center gap-2 mt-1.5">
                    {report.life_saving_rules.map((lsr) => (
                      <span
                        key={lsr.rule}
                        className="bg-blue-50 text-oil-blue text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1"
                      >
                        <ShieldAlert className="w-2.5 h-2.5" />
                        {lsr.rule}
                      </span>
                    ))}
                    <span className="text-[10px] text-amber-700 font-bold ml-auto">
                      AI SIF Prob: {report.confidence}%
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-oil-navy group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-right text-[11px] text-slate-400">
          Showing {filteredReports.length} results • Press <kbd className="bg-slate-200 px-1 py-0.5 rounded text-slate-600">Esc</kbd> to exit
        </div>
      </div>
    </div>
  );
};
