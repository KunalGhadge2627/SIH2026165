import React, { useState } from 'react';
import { TrendingUp, Bell, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useAppState } from '../../context/AppStateContext';
import { RiskBadge } from '../common/RiskBadge';
import { EarlyWarningAlert } from '../../types/safety';

export const TrendEarlyWarningView: React.FC = () => {
  const { reports, alerts, updateAlertStatus: contextUpdateAlertStatus, navigateTo } = useAppState();
  const [alertList, setAlertList] = useState<EarlyWarningAlert[]>(alerts);
  const [dbTrend, setDbTrend] = useState<any[] | null>(null);

  React.useEffect(() => {
    setAlertList(alerts);
  }, [alerts]);

  React.useEffect(() => {
    import('../../services/api').then(({ api }) => {
      api.getDashboard().then((data) => {
        if (data && data.monthly_trend) {
          setDbTrend(data.monthly_trend);
        }
      }).catch(() => {});

      api.getAlerts().then((data) => {
        if (data && data.length >= 0) {
          setAlertList(data);
        }
      }).catch(() => {});
    });
  }, []);

  // Compute dynamic monthly trend from reports if backend hasn't returned yet or fallback
  const trendData = React.useMemo(() => {
    if (dbTrend && dbTrend.length > 0) return dbTrend;

    const monthNames: Record<string, string> = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
      '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };
    const groups: Record<string, { total: number; psif: number }> = {};
    reports.forEach((r) => {
      const d = r.date || '2026-08-31';
      const key = d.length >= 7 && d[4] === '-' ? d.substring(0, 7) : '2026-08';
      if (!groups[key]) groups[key] = { total: 0, psif: 0 };
      groups[key].total += 1;
      if (r.p_sif >= 0.55 || r.classification === 'PSIF Potential') {
        groups[key].psif += 1;
      }
    });

    return Object.keys(groups).sort().map((key) => {
      const val = groups[key];
      const [yr, mo] = key.split('-');
      const mName = monthNames[mo] || mo;
      const sifRate = Math.round((val.psif / Math.max(1, val.total)) * 1000) / 10;
      return {
        month: `${mName} ${yr}`,
        month_short: mName,
        total: val.total,
        psif: val.psif,
        reports: val.total,
        sif: val.psif,
        sifRate: sifRate,
        sif_rate: sifRate
      };
    });
  }, [dbTrend, reports]);

  const updateAlertStatus = (id: string, newStatus: EarlyWarningAlert['status']) => {
    setAlertList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (contextUpdateAlertStatus) {
      contextUpdateAlertStatus(id, newStatus);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              Safety Trends & Alerts System
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Time-series SIF rate tracking and automated precursor spike detection alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-red-50 text-red-800 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold">
          <Bell className="w-4 h-4 text-red-600 animate-bounce" />
          {alertList.filter((a) => a.status === 'Active').length} Active Early Warnings
        </div>
      </div>

      {/* Main Time Series Chart Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-oil-navy">
              Total Reports vs SIF-Potential Reports (Monthly Trend)
            </h2>
            <p className="text-xs text-slate-500">
              Tracking precursor report volume alongside SIF rate % over the last 8 months.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 bg-slate-300 rounded"></span> Total Reports
            </span>
            <span className="flex items-center gap-1.5 text-red-700">
              <span className="w-3 h-3 bg-red-500 rounded"></span> PSIF Reports
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-3 h-0.5 bg-amber-500"></span> SIF Rate %
            </span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" style={{ fontSize: '11px' }} />
              <YAxis yAxisId="left" style={{ fontSize: '11px' }} />
              <YAxis yAxisId="right" orientation="right" unit="%" style={{ fontSize: '11px' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" dataKey="total" name="Total Safety Reports" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="psif" name="PSIF Potential Reports" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="sifRate" name="SIF Rate %" stroke="#d97706" strokeWidth={3} dot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert Center Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-oil-navy flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Automated HSSE Early Warning Alerts Center
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Real-time trigger alerts evaluated by AI anomaly detection models.
          </span>
        </div>

        {alertList.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-xl border border-slate-200">
            No active early warnings detected from the current dataset.
          </div>
        ) : (
          <div className="space-y-4">
            {alertList.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl p-5 border transition shadow-sm ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-red-50/50 border-red-200'
                    : 'bg-orange-50/50 border-orange-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-oil-navy bg-white px-2.5 py-1 rounded border border-slate-200">
                      {alert.id}
                    </span>
                    <RiskBadge level={alert.severity} size="sm" />
                    <span className="bg-white text-oil-navy font-bold text-xs px-2.5 py-1 rounded border border-slate-200">
                      Site: {alert.site} Field
                    </span>
                    <span className="text-[11px] text-slate-500">{alert.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded border ${
                        alert.status === 'Active'
                          ? 'bg-red-600 text-white border-red-700 animate-pulse'
                          : alert.status === 'Investigating'
                          ? 'bg-amber-500 text-oil-navy border-amber-600'
                          : 'bg-emerald-600 text-white border-emerald-700'
                      }`}
                    >
                      Status: {alert.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  EARLY WARNING: {alert.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs my-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-bold block mb-0.5">Trigger Anomaly Metric:</span>
                    <strong className="text-red-700">{alert.metric_text}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-bold block mb-0.5">Common Driver Precursor:</span>
                    <strong className="text-slate-800">{alert.common_precursor}</strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs mb-4">
                  <span className="font-bold text-oil-navy block mb-0.5">Recommended HSE Intervention:</span>
                  <p className="text-slate-700 font-medium">{alert.recommended_action}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => updateAlertStatus(alert.id, 'Acknowledged')}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-3 py-1.5 rounded transition"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => updateAlertStatus(alert.id, 'Investigating')}
                      className="bg-amber-500 hover:bg-amber-600 text-oil-navy font-bold px-3 py-1.5 rounded transition"
                    >
                      Investigate Case
                    </button>
                    <button
                      onClick={() => updateAlertStatus(alert.id, 'Resolved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded transition"
                    >
                      Mark Resolved
                    </button>
                  </div>

                  <button
                    onClick={() => navigateTo('triage', { site: alert.site })}
                    className="text-xs font-bold text-oil-blue hover:underline flex items-center gap-1"
                  >
                    View Related Site Reports <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
