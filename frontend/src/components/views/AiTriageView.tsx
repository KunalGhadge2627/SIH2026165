import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileSearch,
  Filter,
  MapPin,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { OIL_SITES } from '../../data/mockReports';
import { RiskBadge } from '../common/RiskBadge';

export const AiTriageView: React.FC = () => {
  const { reports, selectedSiteFilter, setSiteFilter, selectedRuleName, navigateTo } = useAppState();
  const [triageFilter, setTriageFilter] = useState<'All' | 'Awaiting' | 'Critical'>('All');

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

  const counts = useMemo(() => {
    const sifReports = reports.filter((r) => r.classification === 'PSIF Potential' || r.p_sif >= 0.55);
    return {
      awaiting: sifReports.filter((r) => r.review_status === 'Awaiting HSE Review').length,
      critical: sifReports.filter((r) => r.risk_level === 'CRITICAL').length,
      sif: sifReports.length,
    };
  }, [reports]);

  const filtered = useMemo(() => reports
    .filter((r) => {
      const isSif = r.classification === 'PSIF Potential' || r.p_sif >= 0.55;
      if (!isSif) return false;
      if (selectedSiteFilter !== 'All OIL Sites' && r.site !== selectedSiteFilter) return false;
      if (selectedRuleName) {
        const hasRule = (r.life_saving_rules || []).some((lsr) => {
          const c = LSR_CANON[lsr.rule] || lsr.rule;
          return c === selectedRuleName || lsr.rule === selectedRuleName;
        });
        if (!hasRule) return false;
      }
      if (triageFilter === 'Awaiting' && r.review_status !== 'Awaiting HSE Review') return false;
      if (triageFilter === 'Critical' && r.risk_level !== 'CRITICAL') return false;
      return true;
    })
    .sort((a, b) => b.p_sif - a.p_sif), [reports, selectedSiteFilter, selectedRuleName, triageFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-oil-blue text-sm font-bold">
              <Sparkles className="w-4 h-4" /> AI-powered review
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-oil-navy mt-1 tracking-tight">AI Report Review</h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              AI reads safety reports, identifies possible <strong>Serious Injury & Fatality (SIF) potential</strong>,
              and highlights the safety rule and warning signs that need HSE attention.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-lg bg-oil-navy text-white flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">AI workflow</p>
              <p className="text-sm font-bold text-slate-800">Read → Flag → Explain → Review</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <SummaryCard icon={<Clock3 className="w-4 h-4" />} label="Waiting for HSE review" value={counts.awaiting} tone="amber" />
          <SummaryCard icon={<TriangleAlert className="w-4 h-4" />} label="High / critical risk" value={counts.critical} tone="red" />
          <SummaryCard icon={<ShieldCheck className="w-4 h-4" />} label="AI-flagged SIF potential" value={counts.sif} tone="blue" />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-oil-navy">Reports that need attention</h2>
            <p className="text-xs text-slate-500 mt-1">Start with the highest-risk reports. Open one to see exactly why AI flagged it.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                ['Awaiting', `Needs review (${counts.awaiting})`],
                ['Critical', `High / critical (${counts.critical})`],
                ['All', `All SIF (${counts.sif})`],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setTriageFilter(value as typeof triageFilter)}
                  className={`px-3 py-2 rounded-md text-xs font-bold transition ${triageFilter === value ? 'bg-oil-navy text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}
                >{label}</button>
              ))}
            </div>
            <label className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 bg-white">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select value={selectedSiteFilter} onChange={(e) => setSiteFilter(e.target.value)} className="py-2 text-xs font-semibold text-slate-700 bg-transparent outline-none">
                <option value="All OIL Sites">All sites</option>
                {OIL_SITES.map((site) => <option key={site} value={site}>{site}</option>)}
              </select>
            </label>
          </div>
        </div>

        {selectedRuleName && (
          <div className="px-5 py-2.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-oil-navy flex items-center gap-1.5">
              <span className="font-bold">Filtered by Rule:</span> {selectedRuleName}
              {selectedSiteFilter !== 'All OIL Sites' && ` • Site: ${selectedSiteFilter} Field`}
            </span>
            <button
              onClick={() => navigateTo('triage', { ruleName: undefined })}
              className="text-blue-700 hover:text-blue-900 font-bold hover:underline"
            >
              Clear rule filter ✕
            </button>
          </div>
        )}

        <div className="p-5 space-y-3 bg-slate-50/60">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-800 mt-3">Nothing needs attention here</h3>
              <p className="text-sm text-slate-500 mt-1">Try another filter or view all reports.</p>
            </div>
          ) : filtered.map((report) => {
            const prob = report.p_sif * 100;
            const rule = report.life_saving_rules[0];
            return (
              <article key={report.report_id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${report.classification === 'PSIF Potential' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {report.classification === 'PSIF Potential' ? 'Possible SIF risk' : 'Lower SIF potential'}
                        </span>
                        <RiskBadge level={report.risk_level} size="sm" />
                        <span className="text-[11px] text-slate-400 font-mono">{report.report_id}</span>
                      </div>
                      <p className="text-sm text-slate-800 font-semibold leading-relaxed mt-3 max-w-4xl">“{report.description}”</p>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{report.site} · {report.location}</span>
                        <span>{report.activity}</span>
                        <span>{report.date}</span>
                      </div>
                    </div>
                    <div className="lg:w-48 shrink-0 bg-slate-50 rounded-xl border border-slate-200 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">AI SIF potential</p>
                      <p className="text-2xl font-extrabold text-oil-navy mt-1">{prob.toFixed(0)}%</p>
                      <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${prob >= 85 ? 'bg-red-500' : prob >= 65 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${prob}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2">Model confidence: {report.confidence.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <Insight label="Why flagged" value={report.highlighted_phrases[0]?.note || 'Potential precursor signal detected'} icon={<FileSearch className="w-4 h-4" />} />
                    <Insight label="Safety rule" value={rule?.rule || 'Needs mapping'} icon={<ShieldCheck className="w-4 h-4" />} />
                    <Insight label="Review status" value={report.review_status === 'Awaiting HSE Review' ? 'HSE review needed' : report.review_status} icon={<Clock3 className="w-4 h-4" />} />
                  </div>
                </div>
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">AI highlights the risk; <strong className="text-slate-700">HSE makes the final decision.</strong></p>
                  <button onClick={() => navigateTo('case-detail', { reportId: report.report_id })} className="inline-flex items-center gap-2 bg-oil-navy hover:bg-oil-navy-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition">
                    Review report <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

function SummaryCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: 'amber' | 'red' | 'blue' }) {
  const tones = {
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    blue: 'bg-blue-50 text-oil-blue border-blue-100',
  };
  return <div className={`rounded-xl border p-4 ${tones[tone]}`}><div className="flex items-center gap-2 text-xs font-bold"><span>{icon}</span>{label}</div><p className="text-2xl font-extrabold mt-2 text-slate-900">{value}</p></div>;
}

function Insight({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="bg-slate-50 rounded-lg p-3 border border-slate-100"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400"><span className="text-oil-blue">{icon}</span>{label}</div><p className="text-xs font-semibold text-slate-700 mt-1.5 leading-relaxed">{value}</p></div>;
}
