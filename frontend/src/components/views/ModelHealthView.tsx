import React from 'react';
import { Cpu, CheckCircle2, RefreshCw, Database, Server, Activity, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const ModelHealthView: React.FC = () => {
  const { modelHealth } = useAppState();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              AI Model Performance & System Health
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry, classifier accuracy metrics, and continuous human-in-the-loop retraining statistics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          AI Engine Status: Operational (Model v2.4-SIF)
        </div>
      </div>

      {/* Model Performance Gauges */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-oil-navy flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-oil-blue" />
            SIF Classifier Performance Metrics
          </h2>
          <span className="text-xs font-mono font-bold text-slate-500">
            Validated against 15,000+ Historical OIL HSSE Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Precision</span>
            <div className="text-3xl font-extrabold text-oil-navy font-mono my-1">
              {(modelHealth.classifier_precision * 100).toFixed(0)}%
            </div>
            <span className="text-[10px] text-slate-400">Positive Predictive Value</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">Recall</span>
            <div className="text-3xl font-extrabold text-emerald-700 font-mono my-1">
              {(modelHealth.classifier_recall * 100).toFixed(0)}%
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">Minimizes Missed SIF Cases</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">F1-Score</span>
            <div className="text-3xl font-extrabold text-oil-navy font-mono my-1">
              {(modelHealth.classifier_f1 * 100).toFixed(0)}%
            </div>
            <span className="text-[10px] text-slate-400">Harmonic Mean Balance</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">ROC-AUC</span>
            <div className="text-3xl font-extrabold text-oil-gold font-mono my-1">
              {(modelHealth.classifier_roc_auc * 100).toFixed(0)}%
            </div>
            <span className="text-[10px] text-slate-400">Area Under ROC Curve</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">LSR Macro F1</span>
            <div className="text-3xl font-extrabold text-oil-blue font-mono my-1">
              {(modelHealth.lsr_macro_f1 * 100).toFixed(0)}%
            </div>
            <span className="text-[10px] text-slate-400">9 Rules Classification</span>
          </div>
        </div>
      </div>

      {/* Continuous Learning / Human-in-the-Loop Feedback Section */}
      <div className="bg-white rounded-xl border-2 border-oil-gold p-6 shadow-md space-y-4">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-oil-navy flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-oil-gold" />
            Continuous Learning & Active Human-in-the-Loop Feedback Loop
          </h2>
          <span className="bg-oil-navy text-white text-xs font-bold px-2.5 py-1 rounded">
            Scheduled Retraining Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-bold block mb-1">Reports Reviewed by HSE:</span>
            <strong className="text-xl font-extrabold text-oil-navy font-mono">
              {modelHealth.reviewed_reports_count.toLocaleString()}
            </strong>
          </div>

          <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200">
            <span className="text-amber-900 font-bold block mb-1">HSE Label Corrections:</span>
            <strong className="text-xl font-extrabold text-amber-700 font-mono">
              {modelHealth.corrections_count}
            </strong>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
            <span className="text-emerald-900 font-bold block mb-1">New Training Feedback Labels:</span>
            <strong className="text-xl font-extrabold text-emerald-700 font-mono">
              {modelHealth.new_training_labels}
            </strong>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-bold block mb-1">Next Retraining Cycle:</span>
            <strong className="text-sm font-extrabold text-oil-navy block mt-1">
              {modelHealth.next_retraining_date}
            </strong>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-oil-gold flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block mb-0.5">Continuous Improvement Architecture:</strong>
            “All HSE Officer confirmations and rejections submitted in the Case Review Workbench are automatically queued as ground-truth feedback labels for quarterly fine-tuning of the transformer NLP model.”
          </div>
        </div>
      </div>

      {/* System Infrastructure Telemetry */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-oil-navy border-b border-slate-100 pb-3 flex items-center gap-2">
          <Server className="w-5 h-5 text-slate-600" />
          Enterprise System Health Telemetry
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { name: 'OIL HSSE Database', icon: Database, status: modelHealth.system_status.database, latency: '4ms' },
            { name: 'AI NLP Inference API', icon: Cpu, status: modelHealth.system_status.ai_api, latency: '82ms' },
            { name: 'Real-time Data Pipeline', icon: Activity, status: modelHealth.system_status.data_pipeline, latency: '12ms' },
            { name: 'Executive Dashboard Engine', icon: Server, status: modelHealth.system_status.dashboard, latency: '2ms' }
          ].map((item) => (
            <div key={item.name} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-oil-blue" />
                <div>
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Latency: {item.latency}</div>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-300">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
