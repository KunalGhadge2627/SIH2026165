import React, { useState } from 'react';
import { UploadCloud, BrainCircuit, CheckCircle2, FileSpreadsheet, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { OIL_SITES, ACTIVITIES } from '../../data/mockReports';
import { SafetyReport, ReportType, RiskLevel } from '../../types/safety';

export const ReportIngestionView: React.FC = () => {
  const { addReport, addBatchReports, navigateTo } = useAppState();

  const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');

  // Form State
  const [reportType, setReportType] = useState<ReportType>('Near Miss');
  const [site, setSite] = useState('Duliajan');
  const [activity, setActivity] = useState('Confined Space Entry');
  const [location, setLocation] = useState('Process Vessel V-304');
  const [contractorType, setContractorType] = useState<'OIL Staff' | 'Contractor'>('Contractor');
  const [date, setDate] = useState('2026-08-31');
  const [description, setDescription] = useState(
    'Worker entered confined space vessel without verifying oxygen levels or gas clearance certificate.'
  );
  const [immediateCauses, setImmediateCauses] = useState('Omitted pre-task gas test.');
  const [contributingFactors, setContributingFactors] = useState('Gas detector calibration expired.');
  const [correctiveAction, setCorrectiveAction] = useState('Work halted, vessel ventilated, fresh gas check performed.');

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedReport, setAnalyzedReport] = useState<SafetyReport | null>(null);

  // Bulk Upload State
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkComplete, setBulkComplete] = useState(false);

  const handleManualAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setAnalyzedReport(null);

    setTimeout(() => {
      const isPsif = description.toLowerCase().includes('confined') || description.toLowerCase().includes('gas') || description.toLowerCase().includes('loto');
      const p_sif = isPsif ? 0.932 : 0.284;
      const risk_level: RiskLevel = p_sif >= 0.85 ? 'CRITICAL' : p_sif >= 0.5 ? 'HIGH' : 'LOW';

      const newRep: SafetyReport = {
        report_id: `OIL-INC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        report_type: reportType,
        site,
        date,
        activity,
        location,
        contractor_type: contractorType,
        description,
        immediate_causes: immediateCauses,
        contributing_factors: contributingFactors,
        corrective_actions: correctiveAction,
        p_sif,
        classification: p_sif >= 0.55 ? 'PSIF Potential' : 'Non-SIF Potential',
        confidence: 93.2,
        life_saving_rules: [
          {
            rule: activity === 'Confined Space Entry' ? 'Confined Space' : 'Work Authorisation',
            confidence: 96.4,
            reason: 'NLP model flagged confined space entry without atmospheric testing.'
          }
        ],
        precursors: {
          activity,
          location,
          energy_sources: ['Hydrocarbon Gas', 'Toxic Atmosphere'],
          barrier_failures: ['No Gas Test', 'Missing Attendant'],
          human_factors: ['Omission Error'],
          organizational_factors: ['Calibration Backlog']
        },
        highlighted_phrases: [
          { text: 'without verifying oxygen levels', category: 'Barrier Failure', note: 'Unchecked atmospheric hazard' }
        ],
        risk_level,
        review_status: 'Awaiting HSE Review'
      };

      addReport(newRep);
      setAnalyzedReport(newRep);
      setAnalyzing(false);
    }, 1200);
  };

  const handleBulkUploadSim = () => {
    setBulkProcessing(true);
    setBulkProgress(0);
    setBulkComplete(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setBulkProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setBulkProcessing(false);
        setBulkComplete(true);
      }
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              Safety Report Ingestion & Batch AI Processor
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ingest single safety reports or batch process CSV/Excel archives for automated AI NLP triage.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'manual' ? 'bg-oil-navy text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Enter Report Manually
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'bulk' ? 'bg-oil-navy text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Bulk CSV / Excel Upload
          </button>
        </div>
      </div>

      {activeTab === 'manual' ? (
        <div className="space-y-6">
          {/* Manual Entry Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-oil-navy border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-oil-gold" />
              Manual Observation Entry & Live AI Analysis
            </h2>

            <form onSubmit={handleManualAnalyze} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Report Type:</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as ReportType)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="Near Miss">Near Miss</option>
                    <option value="Unsafe Act (UA)">Unsafe Act (UA)</option>
                    <option value="Unsafe Condition (UC)">Unsafe Condition (UC)</option>
                    <option value="Incident">Incident</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">OIL Field Site:</label>
                  <select
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {OIL_SITES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Activity:</label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {ACTIVITIES.map((act) => (
                      <option key={act} value={act}>
                        {act}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / Tag:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Process Vessel V-304"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contractor / Staff:</label>
                  <select
                    value={contractorType}
                    onChange={(e) => setContractorType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="Contractor">Contractor Personnel</option>
                    <option value="OIL Staff">OIL Direct Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Report Description Narrative:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Immediate Cause:</label>
                  <input
                    type="text"
                    value={immediateCauses}
                    onChange={(e) => setImmediateCauses(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contributing Factors:</label>
                  <input
                    type="text"
                    value={contributingFactors}
                    onChange={(e) => setContributingFactors(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Corrective Action Taken:</label>
                  <input
                    type="text"
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full bg-oil-navy hover:bg-oil-navy-dark text-white font-extrabold py-3 px-4 rounded-lg transition shadow flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-oil-gold" />
                    Running AI NLP Model Analysis...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-oil-gold" />
                    Analyze with AI NLP Engine
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Analysis Result Output */}
          {analyzedReport && (
            <div className="bg-white rounded-xl border-2 border-oil-gold p-6 shadow-md space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Report Successfully Processed & Logged!
                </div>
                <span className="font-mono text-xs font-bold text-oil-navy">{analyzedReport.report_id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Classification</span>
                  <span className="font-extrabold text-red-600 text-sm">{analyzedReport.classification}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">PSIF Probability</span>
                  <span className="font-extrabold text-oil-navy text-sm font-mono">
                    {(analyzedReport.p_sif * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mapped Life-Saving Rule</span>
                  <span className="font-extrabold text-oil-blue text-sm">
                    {analyzedReport.life_saving_rules[0]?.rule || 'Mapped'}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Risk Level</span>
                  <span className="font-extrabold text-red-700 text-sm">{analyzedReport.risk_level}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigateTo('case-detail', { reportId: analyzedReport.report_id })}
                  className="bg-oil-navy text-white font-bold text-xs py-2 px-4 rounded-lg hover:bg-oil-navy-dark transition flex items-center gap-1.5"
                >
                  View Full Case Detail <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Bulk Upload Processing Simulation */
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="max-w-md mx-auto border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer">
            <FileSpreadsheet className="w-12 h-12 text-oil-navy mx-auto mb-3" />
            <h3 className="font-extrabold text-sm text-slate-800">Drop CSV / Excel Safety Archive File</h3>
            <p className="text-xs text-slate-500 mt-1">Supports .csv, .xlsx format (up to 10,000 reports per batch)</p>
          </div>

          {!bulkProcessing && !bulkComplete && (
            <button
              onClick={handleBulkUploadSim}
              className="bg-oil-navy hover:bg-oil-navy-dark text-white font-extrabold py-3 px-6 rounded-lg transition shadow inline-flex items-center gap-2 text-xs"
            >
              <UploadCloud className="w-4 h-4 text-oil-gold" />
              Simulate Bulk Upload (2,500 Reports)
            </button>
          )}

          {bulkProcessing && (
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Processing Reports Batch...</span>
                <span>{bulkProgress}% ({Math.round((bulkProgress / 100) * 2500)} / 2,500)</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-oil-navy h-full rounded-full transition-all duration-200" style={{ width: `${bulkProgress}%` }}></div>
              </div>
            </div>
          )}

          {bulkComplete && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-950 space-y-4 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 font-extrabold text-base text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                AI Analysis Complete for 2,500 Reports!
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-left">
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-slate-400 font-bold block">PSIF Potential Flagged:</span>
                  <strong className="text-red-700 text-sm">384 Reports (15.3%)</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-slate-400 font-bold block">Non-SIF Potential:</span>
                  <strong className="text-emerald-700 text-sm">2,036 Reports</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-slate-400 font-bold block">High Priority Cases:</span>
                  <strong className="text-amber-700 text-sm">91 Cases</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-slate-400 font-bold block">Life-Saving Rules Tagged:</span>
                  <strong className="text-oil-navy text-sm">647 Rules</strong>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('triage')}
                  className="bg-oil-navy hover:bg-oil-navy-dark text-white font-bold text-xs py-2.5 px-4 rounded-lg transition shadow"
                >
                  View Analysis Results Queue
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
