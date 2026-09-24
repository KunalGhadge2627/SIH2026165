import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { IOGP_LIFE_SAVING_RULES, LifeSavingRuleInfo } from '../../data/mockRules';
import { LifeSavingRuleName } from '../../types/safety';

export const LifeSavingRulesView: React.FC = () => {
  const { reports, navigateTo } = useAppState();

  const [selectedRule, setSelectedRule] = useState<LifeSavingRuleInfo>(IOGP_LIFE_SAVING_RULES[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              IOGP Life-Saving Rules Compliance Framework
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated multi-label mapping and compliance tracking across the 9 official IOGP Life-Saving Rules.
          </p>
        </div>

        <div className="text-xs font-bold text-oil-navy bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          International Association of Oil & Gas Producers (IOGP)
        </div>
      </div>

      {/* Grid: 9 Life-Saving Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {IOGP_LIFE_SAVING_RULES.map((rule) => {
          const taggedReports = reports.filter((r) =>
            r.life_saving_rules.some((lsr) => lsr.rule === rule.name)
          );
          const psifReports = taggedReports.filter((r) => r.p_sif >= 0.55);
          const psifRate = Math.round((psifReports.length / Math.max(1, taggedReports.length)) * 1000) / 10;
          const isSelected = selectedRule.name === rule.name;

          return (
            <div
              key={rule.name}
              onClick={() => setSelectedRule(rule)}
              className={`bg-white rounded-xl p-5 border transition cursor-pointer shadow-sm relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-2 border-oil-gold ring-2 ring-oil-gold/20 shadow-md'
                  : 'border-slate-200 hover:border-oil-blue'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-oil-navy bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {rule.code}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded ${
                      psifRate >= 30
                        ? 'bg-red-100 text-red-800'
                        : psifRate >= 20
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    PSIF Rate: {psifRate}%
                  </span>
                </div>

                <h2 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-oil-blue" />
                  {rule.name}
                </h2>

                <p className="text-xs text-slate-600 mb-4 line-clamp-2">{rule.shortDescription}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block font-semibold">Total Tagged</span>
                    <strong className="text-slate-900 font-extrabold text-sm">{taggedReports.length}</strong>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <span className="text-[10px] text-red-500 block font-semibold">PSIF Reports</span>
                    <strong className="text-red-700 font-extrabold text-sm">{psifReports.length}</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded text-[11px] text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">Top Failure Mode:</span>
                  <span className="text-slate-600 line-clamp-1">{rule.topFailureMode}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRule(rule);
                  }}
                  className="w-full bg-slate-100 hover:bg-oil-navy hover:text-white text-slate-800 font-bold text-xs py-2 px-3 rounded transition flex items-center justify-center gap-1.5"
                >
                  Rule Compliance Analytics <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Rule Detailed Analytics Panel */}
      <div className="bg-white rounded-xl border-2 border-oil-gold p-6 shadow-md space-y-5">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-oil-navy bg-slate-100 px-2 py-0.5 rounded">
                {selectedRule.code}
              </span>
              <h2 className="text-lg font-extrabold text-oil-navy">{selectedRule.name} — Safety Breakdown</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{selectedRule.fullGuidance}</p>
          </div>

          <button
            onClick={() => navigateTo('triage', { statusFilter: 'All' })}
            className="bg-oil-navy text-white hover:bg-oil-navy-dark font-bold text-xs px-3 py-2 rounded-lg transition flex items-center gap-1.5"
          >
            View Tagged Reports <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Detailed Failure Modes & Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-oil-blue">
              Top Recognized Failure Modes in OIL Operations:
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-red-600">1.</span>
                <span>{selectedRule.topFailureMode}</span>
              </li>
              <li className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-red-600">2.</span>
                <span>Pre-job risk assessment (JSA) checklist omitted at work location</span>
              </li>
              <li className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-red-600">3.</span>
                <span>Work proceeded under expired authorization or scope change</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-oil-blue">
              Extracted Precursor Signals for {selectedRule.name}:
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedRule.examplePrecursors.map((ep) => (
                <span key={ep} className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded border border-amber-200">
                  {ep}
                </span>
              ))}
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              When AI detects these phrase signatures in safety observation narratives, the report is automatically mapped to {selectedRule.name} with confidence scoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
