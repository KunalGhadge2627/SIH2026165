import React, { useState } from 'react';
import {
  ShieldAlert,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  UserCheck,
  FileText,
  Tag,
  Info,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { RiskBadge } from '../common/RiskBadge';

export const CaseDetailView: React.FC = () => {
  const { reports, selectedReportId, updateReportStatus, navigateTo, currentUser } = useAppState();

  const report = reports.find((r) => r.report_id === selectedReportId) || reports[0];

  const [reviewDecision, setReviewDecision] = useState<'Confirmed PSIF' | 'Rejected PSIF' | 'Further Review'>(
    report.review_status === 'Confirmed PSIF'
      ? 'Confirmed PSIF'
      : report.review_status === 'Rejected PSIF'
      ? 'Rejected PSIF'
      : 'Confirmed PSIF'
  );
  const [commentText, setCommentText] = useState(
    report.hse_feedback?.comment || 'Confirmed. Confined-space entry occurred without gas testing or attendant.'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    updateReportStatus(report.report_id, reviewDecision, commentText);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Navigation Top Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('triage')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-oil-navy hover:text-oil-blue transition bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to AI Triage Queue
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Review Status:</span>
          <span
            className={`text-xs font-extrabold px-3 py-1 rounded-md border ${
              report.review_status === 'Confirmed PSIF'
                ? 'bg-red-100 text-red-800 border-red-300'
                : report.review_status === 'Rejected PSIF'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {report.review_status}
          </span>
        </div>
      </div>

      {/* Case Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-oil-gold">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-oil-navy font-mono tracking-tight">
              Report {report.report_id}
            </h1>
            <span
              className={`px-3 py-1 rounded-md font-extrabold text-xs tracking-wider uppercase border ${
                report.classification === 'PSIF Potential'
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              {report.classification}
            </span>
            <RiskBadge level={report.risk_level} size="md" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <strong className="text-slate-800">{report.site} Field</strong> ({report.location})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {report.date}
            </span>
            <span>•</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
              {report.contractor_type}
            </span>
          </div>
        </div>

        {/* AI Probability Gauge Card */}
        <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 text-center min-w-[200px] shadow-inner">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            AI PSIF Probability
          </div>
          <div className="text-3xl font-extrabold text-oil-gold font-mono my-1">
            {report.confidence.toFixed(1)}%
          </div>
          <div className="text-[10px] text-emerald-400 font-bold">
            High NLP Classification Score
          </div>
        </div>
      </div>

      {/* Grid: Original Report vs AI Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Original Safety Report (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original Text Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-oil-navy flex items-center gap-2">
                <FileText className="w-4 h-4 text-oil-blue" />
                Original HSSE Safety Observation Report
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                Type: {report.report_type}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Report Description:
              </span>
              <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed font-medium">
                “{report.description}”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Immediate Causes:</span>
                <p className="text-slate-600">{report.immediate_causes}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Contributing Factors:</span>
                <p className="text-slate-600">{report.contributing_factors}</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950">
              <span className="font-bold block mb-0.5">Corrective Action Taken at Site:</span>
              <p>{report.corrective_actions}</p>
            </div>
          </div>

          {/* AI Explanation / Phrase Highlighting */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-oil-navy flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-oil-gold" />
                  Why did AI flag this report as PSIF Potential?
                </h2>
                <p className="text-xs text-slate-500">
                  NLP keyphrase extraction and causal signal analysis breakdown.
                </p>
              </div>
              <span className="bg-oil-navy text-white text-xs font-bold px-2.5 py-1 rounded font-mono">
                Model Confidence: {report.confidence}%
              </span>
            </div>

            {/* Sentence Highlighting Component */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
              <span className="text-xs font-bold text-amber-900 block mb-2">
                Highlighted Phrase Rationale in Text:
              </span>
              <div className="space-y-3">
                {report.highlighted_phrases.map((hp, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      #{idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 bg-amber-100 px-2 py-0.5 rounded font-mono">
                          "{hp.text}"
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                          {hp.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">{hp.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Life-Saving Rules */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-oil-navy flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Detected Life-Saving Rules (Multi-Label NLP Tagging)
              </h2>
              <p className="text-xs text-slate-500">
                IOGP Life-Saving Rules automatically tagged based on contextual text patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.life_saving_rules.map((lsr) => (
                <div key={lsr.rule} className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-oil-navy uppercase flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-oil-blue" />
                      {lsr.rule}
                    </span>
                    <span className="bg-oil-navy text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      {lsr.confidence.toFixed(1)}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{lsr.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Structured Precursors Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-oil-navy flex items-center gap-2">
                <Tag className="w-5 h-5 text-oil-gold" />
                Extracted SIF Precursor Signals
              </h2>
              <p className="text-xs text-slate-500">
                Structured safety parameters extracted from unstructured report narrative.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Activity</span>
                <span className="font-bold text-slate-900 mt-1 block">{report.precursors.activity}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                <span className="font-bold text-slate-900 mt-1 block">{report.precursors.location}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Energy Source</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {report.precursors.energy_sources.map((es) => (
                    <span key={es} className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {es}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Barrier Failure</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {report.precursors.barrier_failures.map((bf) => (
                    <span key={bf} className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {bf}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Human Factor</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {report.precursors.human_factors.map((hf) => (
                    <span key={hf} className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {hf}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Organizational Factor</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {report.precursors.organizational_factors.map((of) => (
                    <span key={of} className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {of}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Score Panel & HSE Review Workbench (1 Col) */}
        <div className="space-y-6">
          {/* AI Score Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-oil-navy">AI Risk Assessment</h3>
              <RiskBadge level={report.risk_level} size="sm" />
            </div>

            <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-semibold uppercase">SIF Potential Probability</div>
              <div className="text-4xl font-extrabold text-red-600 font-mono my-1">
                {(report.p_sif * 100).toFixed(1)}%
              </div>
              <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                CRITICAL SIF EXPOSURE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Identified Risk Factors:</span>
              <ul className="space-y-1 text-slate-600 list-disc pl-4">
                <li>Missing safety critical control / barrier</li>
                <li>High-energy atmospheric hazard present</li>
                <li>Confined-space exposure without gas test</li>
                <li>Departure from standard operating procedure</li>
                <li>High potential fatal consequence severity</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>HSE Governance Disclaimer:</strong> AI-generated assessment. Final safety classification requires authorized HSE Officer validation.
              </div>
            </div>
          </div>

          {/* HSE Case Review Workbench */}
          <div className="bg-white rounded-xl border-2 border-oil-gold p-5 shadow-md space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-oil-navy flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-oil-gold" />
                HSE Case Review Workbench
              </h3>
              <p className="text-xs text-slate-500">Validate AI classification & log human-in-the-loop retraining feedback.</p>
            </div>

            {isSubmitted && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3 rounded-lg text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Review submitted successfully! Human-in-the-loop feedback recorded.
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-2">HSE Validation Decision:</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewDecision('Confirmed PSIF')}
                    className={`p-2.5 rounded-lg font-bold border transition text-left flex items-center justify-between ${
                      reviewDecision === 'Confirmed PSIF'
                        ? 'bg-red-600 text-white border-red-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Confirm PSIF Potential</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewDecision('Rejected PSIF')}
                    className={`p-2.5 rounded-lg font-bold border transition text-left flex items-center justify-between ${
                      reviewDecision === 'Rejected PSIF'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Reject PSIF (False Positive)</span>
                    <XCircle className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewDecision('Further Review')}
                    className={`p-2.5 rounded-lg font-bold border transition text-left flex items-center justify-between ${
                      reviewDecision === 'Further Review'
                        ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Send for Further Field Investigation</span>
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  HSE Officer Comments / Justification:
                </label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter detailed validation rationale for audit trail..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:border-oil-blue"
                  required
                ></textarea>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-500 font-medium">
                Reviewer: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role})
              </div>

              <button
                type="submit"
                className="w-full bg-oil-navy hover:bg-oil-navy-dark text-white font-extrabold py-2.5 px-4 rounded-lg transition shadow flex items-center justify-center gap-2"
              >
                Submit Review & Record Retraining Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
