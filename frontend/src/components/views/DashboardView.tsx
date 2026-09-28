import React, { useState } from 'react';

import { AlertTriangle, ArrowRight, BrainCircuit, FileText, MapPin, ShieldCheck, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useAppState } from '../../context/AppStateContext';
import { OIL_SITES } from '../../data/mockReports';

const Stat = ({ label, value, note, icon: Icon, tone = 'default', onClick }: any) => (
  <button onClick={onClick} className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition w-full">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        <div className="mt-2 text-2xl font-extrabold text-oil-navy">{value}</div>
        <div className="mt-1 text-[11px] text-slate-500">{note}</div>
      </div>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tone}`}><Icon className="w-4 h-4" /></div>
    </div>
  </button>
);

export const DashboardView: React.FC = () => {
  const { reports, alerts, navigateTo } = useAppState();
  const [dbMetrics, setDbMetrics] = useState<any>(null);

  React.useEffect(() => {
    import('../../services/api').then(({ api }) => {
      api.getDashboard().then((data) => {
        if (data) setDbMetrics(data);
      }).catch(() => {});
    });
  }, []);

  const total = dbMetrics?.total_reports ?? reports.length;
  const sif = dbMetrics?.sif_potential ?? reports.filter((r) => r.p_sif >= 0.55).length;
  const review = dbMetrics?.awaiting_review ?? reports.filter((r) => (r.p_sif >= 0.55 || r.classification === 'PSIF Potential') && r.review_status === 'Awaiting HSE Review').length;
  const critical = dbMetrics?.high_priority ?? reports.filter((r) => r.risk_level === 'CRITICAL').length;
  const sifRate = dbMetrics?.sif_rate ?? (Math.round((sif / Math.max(1, total)) * 1000) / 10);

  const dynamicTrendFromReports = React.useMemo(() => {
    const monthNames: Record<string, string> = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
      '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };
    const groups: Record<string, { total: number; sif: number }> = {};
    reports.forEach((r) => {
      const d = r.date || '2026-08-31';
      const key = d.length >= 7 && d[4] === '-' ? d.substring(0, 7) : '2026-08';
      if (!groups[key]) groups[key] = { total: 0, sif: 0 };
      groups[key].total += 1;
      if (r.p_sif >= 0.55 || r.classification === 'PSIF Potential') {
        groups[key].sif += 1;
      }
    });
    return Object.keys(groups).sort().map((key) => {
      const val = groups[key];
      const [, mo] = key.split('-');
      return {
        month: monthNames[mo] || mo,
        reports: val.total,
        sif: val.sif
      };
    });
  }, [reports]);

  const trend = dbMetrics?.monthly_trend?.map((t: any) => ({
    ...t,
    month: t.month_short || t.month
  })) || dynamicTrendFromReports;

  const siteData = dbMetrics?.site_distribution || OIL_SITES.map((site) => {
    const siteReports = reports.filter((r) => r.site === site);
    const siteSif = siteReports.filter((r) => r.p_sif >= 0.55).length;
    return { site, total: siteReports.length, sif: siteSif };
  }).sort((a, b) => b.sif - a.sif).slice(0, 4);

  const topAlert = dbMetrics?.top_alert || alerts.find((a) => a.status === 'Active') || alerts[0];


  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-oil-gold">OIL Safety Intelligence</p>
          <h1 className="mt-1 text-2xl lg:text-3xl font-extrabold tracking-tight text-oil-navy">Safety overview</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">AI reads safety reports, highlights possible serious risks, connects them to safety rules, and helps you spot recurring patterns.</p>
        </div>
        <button onClick={() => navigateTo('ingestion')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-oil-navy px-4 py-2.5 text-xs font-bold text-white hover:bg-oil-navy-dark transition">
          Upload safety reports <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Safety reports" value={total.toLocaleString()} note="Reports processed by the platform" icon={FileText} tone="bg-slate-100 text-oil-navy" onClick={() => navigateTo('reports')} />
        <Stat label="Possible serious risks" value={sif.toLocaleString()} note={`${sifRate}% of reports flagged for SIF potential`} icon={AlertTriangle} tone="bg-red-50 text-red-600" onClick={() => navigateTo('triage')} />
        <Stat label="Needs HSE review" value={review.toLocaleString()} note="Reports waiting for human validation" icon={BrainCircuit} tone="bg-amber-50 text-amber-700" onClick={() => navigateTo('triage', { statusFilter: 'Awaiting HSE Review' })} />
        <Stat label="High-priority cases" value={critical.toLocaleString()} note="Critical cases in the current dataset" icon={ShieldCheck} tone="bg-emerald-50 text-emerald-700" onClick={() => navigateTo('case-detail')} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-extrabold text-oil-navy">Are serious safety risks increasing?</h2>
              <p className="text-xs text-slate-500 mt-1">Monthly reports compared with reports flagged for SIF potential.</p>
            </div>
            <button onClick={() => navigateTo('trend')} className="text-xs font-bold text-oil-blue">View trends →</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="sifFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dc2626" stopOpacity={0.22} /><stop offset="100%" stopColor="#dc2626" stopOpacity={0.02} /></linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="reports" stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.45} strokeWidth={2} name="All reports" />
                <Area type="monotone" dataKey="sif" stroke="#dc2626" fill="url(#sifFill)" strokeWidth={3} name="SIF-potential" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-5 text-[11px] text-slate-500 mt-1">
            <span><i className="inline-block w-2 h-2 rounded-full bg-slate-400 mr-1" />All reports</span>
            <span><i className="inline-block w-2 h-2 rounded-full bg-red-600 mr-1" />Possible serious risks</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-extrabold text-oil-navy">What needs attention?</h2>
              <p className="text-xs text-slate-500 mt-1">The most recent active warning.</p>
            </div>
            <span className="rounded-full bg-red-50 text-red-700 px-2.5 py-1 text-[10px] font-bold">{alerts.filter(a => a.status === 'Active').length} active</span>
          </div>
          {topAlert ? (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
              <div className="flex items-center gap-2 text-red-700 text-[10px] font-extrabold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> {topAlert.severity} priority
              </div>
              <h3 className="mt-2 font-extrabold text-slate-900">{topAlert.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">{topAlert.common_precursor}</p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <MapPin className="w-3.5 h-3.5" /> {topAlert.site} Field
              </div>
              <button onClick={() => navigateTo('trend')} className="mt-4 text-xs font-bold text-red-700 flex items-center gap-1">Review warning <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          ) : <div className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-800">No active warnings right now.</div>}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="font-extrabold text-oil-navy">Where are risks appearing?</h2><p className="text-xs text-slate-500 mt-1">Sites with the most SIF-potential reports.</p></div>
            <button onClick={() => navigateTo('heatmap')} className="text-xs font-bold text-oil-blue">View locations →</button>
          </div>
          <div className="space-y-3">
            {siteData.map((row: any) => (
              <button key={row.site} onClick={() => navigateTo('triage', { site: row.site })} className="w-full flex items-center gap-3 text-left group">

                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><MapPin className="w-4 h-4 text-oil-navy" /></div>
                <div className="flex-1 min-w-0"><div className="text-xs font-bold text-slate-800 truncate">{row.site} Field</div><div className="h-1.5 mt-1 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, (row.sif / Math.max(1, siteData[0]?.sif || 1)) * 100)}%` }} /></div></div>
                <div className="text-xs font-extrabold text-red-600">{row.sif}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="font-extrabold text-oil-navy">How the AI helps</h2><p className="text-xs text-slate-500 mt-1">A simple view of the system workflow.</p></div>
            <BrainCircuit className="w-5 h-5 text-oil-gold" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[['01', 'Read', 'AI reads the free-text safety report.'], ['02', 'Flag', 'Possible SIF risks are highlighted.'], ['03', 'Connect', 'Rules and recurring patterns are identified.']].map(([n, title, text]) => (
              <div key={n} className="rounded-xl bg-slate-50 border border-slate-100 p-4"><div className="text-[10px] font-bold text-oil-gold">{n}</div><div className="mt-2 text-sm font-extrabold text-oil-navy">{title}</div><p className="mt-1 text-[11px] leading-5 text-slate-500">{text}</p></div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 p-3 text-[11px] text-blue-900"><TrendingUp className="w-4 h-4 shrink-0" /> AI flags reports for HSE review; final decisions remain with the HSE team.</div>
        </div>
      </section>
    </div>
  );
};
