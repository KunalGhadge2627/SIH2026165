import React, { useState } from 'react';
import { GitMerge, ShieldAlert, ArrowRight, Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MOCK_PRECURSOR_PATTERNS } from '../../data/mockPatterns';
import { RiskBadge } from '../common/RiskBadge';
import { PrecursorPattern } from '../../types/safety';

export const PatternExplorerView: React.FC = () => {
  const { navigateTo } = useAppState();

  const [selectedPattern, setSelectedPattern] = useState<PrecursorPattern>(MOCK_PRECURSOR_PATTERNS[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              Precursor Pattern Explorer
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Identify and analyze recurring safety failure clusters across OIL operational sites.
          </p>
        </div>

        <div className="text-xs font-bold text-oil-navy bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          5 Major Recurring Patterns Identified by AI
        </div>
      </div>

      {/* Grid: Patterns List Cards (Left) vs Interactive Flow Diagram (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pattern Selection Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Detected Precursor Clusters
          </h2>

          {MOCK_PRECURSOR_PATTERNS.map((pattern) => {
            const isSelected = selectedPattern.id === pattern.id;
            return (
              <div
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern)}
                className={`bg-white rounded-xl p-4 border transition cursor-pointer shadow-sm ${
                  isSelected
                    ? 'border-2 border-oil-gold ring-2 ring-oil-gold/20 shadow-md'
                    : 'border-slate-200 hover:border-oil-blue'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-oil-navy bg-slate-100 px-2 py-0.5 rounded">
                    {pattern.id}
                  </span>
                  <RiskBadge level={pattern.severity} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                  {pattern.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {pattern.description}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-[10px] text-slate-400 block font-semibold">Occurrences</span>
                    <strong className="text-slate-800 font-extrabold">{pattern.occurrences}</strong>
                  </div>
                  <div className="bg-red-50 p-1.5 rounded">
                    <span className="text-[10px] text-red-500 block font-semibold">PSIF Count</span>
                    <strong className="text-red-700 font-extrabold">{pattern.psif_count}</strong>
                  </div>
                  <div className="bg-blue-50 p-1.5 rounded">
                    <span className="text-[10px] text-blue-500 block font-semibold">Sites</span>
                    <strong className="text-oil-navy font-extrabold">{pattern.affected_sites_count}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Pattern Flow Connection Graph & Analytics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-oil-navy">{selectedPattern.id} Breakdown</span>
                <h2 className="text-base font-extrabold text-oil-navy">{selectedPattern.title}</h2>
              </div>
              <button
                onClick={() => navigateTo('triage', { statusFilter: 'All' })}
                className="bg-oil-navy hover:bg-oil-navy-dark text-white font-bold text-xs py-1.5 px-3 rounded-lg transition flex items-center gap-1.5"
              >
                View Linked Reports <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pattern Causal Flow Diagram */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Precursor Signal Flow Diagram:
              </span>

              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                {/* Node 1: Root Pattern */}
                <div className="bg-slate-800 p-3.5 rounded-lg border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-oil-gold text-oil-navy rounded font-bold">
                      <GitMerge className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-oil-gold uppercase font-bold">Root Precursor Failure</span>
                      <div className="text-xs font-bold text-white">{selectedPattern.title}</div>
                    </div>
                  </div>
                  <span className="bg-red-900/60 text-red-300 text-xs font-mono font-bold px-2 py-1 rounded border border-red-700">
                    {selectedPattern.psif_count} PSIF
                  </span>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-oil-gold"></div>
                </div>

                {/* Node 2: Primary LSR & Barrier Failure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold">Primary Life-Saving Rule</span>
                    <span className="text-xs font-bold text-oil-gold flex items-center gap-1 mt-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {selectedPattern.primary_rule}
                    </span>
                  </div>

                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold">Barrier Failure Mode</span>
                    <span className="text-xs font-bold text-red-400 mt-1 block">
                      {selectedPattern.barrier_failure}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-oil-gold"></div>
                </div>

                {/* Node 3: Affected Sites */}
                <div className="bg-slate-800 p-3.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold mb-1.5">
                    High Precursor Concentration Operational Sites:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedPattern.top_sites.map((site) => (
                      <span key={site} className="bg-oil-navy text-white text-xs font-bold px-2.5 py-1 rounded border border-slate-600">
                        {site} Field Office
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended HSE Action for Pattern */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-900 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Recommended HSSE System Intervention:
              </span>
              <p>
                Initiate site-wide barrier compliance audit targeting <strong className="text-oil-navy">{selectedPattern.primary_rule}</strong> across {selectedPattern.top_sites.join(', ')} sites. Update Tool Box Talk safety cards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
