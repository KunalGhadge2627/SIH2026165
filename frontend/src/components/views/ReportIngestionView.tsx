import React, { useState } from 'react';
import { UploadCloud, BrainCircuit, CheckCircle2, FileSpreadsheet, Sparkles, ArrowRight, RefreshCw, Download, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { OIL_SITES, ACTIVITIES } from '../../data/mockReports';
import { SafetyReport, ReportType, RiskLevel } from '../../types/safety';

export const ReportIngestionView: React.FC = () => {
  const { addReport, addBatchReports, navigateTo, currentUser } = useAppState();

  const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');
  const isSiteManager = currentUser.role === 'Site Manager';

  // Manual Form State
  const [reportIdInput, setReportIdInput] = useState('');
  const [reportType, setReportType] = useState<ReportType>('Near Miss');
  const [site, setSite] = useState(isSiteManager ? 'Duliajan' : 'Duliajan');
  const [activity, setActivity] = useState('Confined Space Entry');
  const [location, setLocation] = useState('Process Vessel V-304');
  const [personType, setPersonType] = useState<'OIL Staff' | 'Contractor'>('Contractor');
  const [date, setDate] = useState('2026-08-31');
  const [narrative, setNarrative] = useState(
    'Worker entered confined space vessel V-304 without verifying oxygen levels or gas clearance certificate. H2S alarm sounded at 15ppm shortly after entry.'
  );
  const [immediateCause, setImmediateCause] = useState('Omitted pre-task gas clearance test.');
  const [contributingFactors, setContributingFactors] = useState('Gas detector calibration expired.');
  const [correctiveAction, setCorrectiveAction] = useState('Work halted, vessel ventilated, fresh gas check performed.');

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedReport, setAnalyzedReport] = useState<SafetyReport | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Bulk Upload State
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkComplete, setBulkComplete] = useState(false);
  const [bulkStats, setBulkStats] = useState<{ total_rows: number; processed: number; failed: number; duplicates: number; sif: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleManualAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setAnalyzedReport(null);
    setUploadError(null);
    setIsDuplicate(false);

    const typeMap: Record<string, string> = {
      'Near Miss': 'near_miss',
      'Unsafe Act (UA)': 'unsafe_act',
      'Unsafe Condition (UC)': 'unsafe_condition',
      'Incident': 'incident'
    };

    try {
      const { api } = await import('../../services/api');
      const res = await api.analyzeReport({
        report_id: reportIdInput.trim() || undefined,
        report_type: typeMap[reportType] || 'near_miss',
        site,
        date,
        activity,
        narrative,
        location,
        person_type: personType,
        immediate_cause: immediateCause,
        contributing_factors: contributingFactors,
        corrective_action: correctiveAction
      });

      setIsDuplicate(!!res.is_duplicate);
      addReport(res.safety_report);
      setAnalyzedReport(res.safety_report);
    } catch (err: any) {
      setUploadError(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const processCsvFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadError('Invalid file format. Bulk upload supports CSV files ONLY (.csv). Excel files (.xlsx/.xls) are not supported.');
      return;
    }

    setBulkProcessing(true);
    setBulkProgress(30);
    setBulkComplete(false);
    setUploadError(null);

    try {
      setBulkProgress(60);
      const { api } = await import('../../services/api');
      const res = await api.uploadCsv(file);
      setBulkProgress(95);

      if (res.results && res.results.length > 0) {
        addBatchReports(res.results);
      }

      setBulkStats({
        total_rows: res.total_rows || res.processed + res.failed,
        processed: res.processed,
        failed: res.failed || 0,
        duplicates: res.duplicates || 0,
        sif: res.sif_potential
      });
      setBulkProgress(100);
      setBulkComplete(true);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process CSV file');
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processCsvFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const { api } = await import('../../services/api');
      api.downloadCsvTemplate();
    } catch (err: any) {
      setUploadError('Failed to download CSV template');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-oil-navy" />
            <h1 className="text-xl font-extrabold text-oil-navy tracking-tight">
              Safety Report Ingestion & AI/NLP Analyzer
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyze single safety reports or bulk process CSV archives via backend AI/NLP SIF Precursor Engine.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('manual'); setUploadError(null); }}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'manual' ? 'bg-oil-navy text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Enter Report Manually
          </button>
          <button
            onClick={() => { setActiveTab('bulk'); setUploadError(null); }}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'bulk' ? 'bg-oil-navy text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Bulk CSV Upload
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 text-red-700 text-xs font-bold p-3.5 rounded-xl border border-red-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-800 text-xs font-extrabold">Dismiss</button>
        </div>
      )}

      {activeTab === 'manual' ? (
        <div className="space-y-6">
          {/* Manual Entry Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-oil-navy border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-oil-gold" />
              Safety Report Observation Form (AI/NLP Analysis)
            </h2>

            <form onSubmit={handleManualAnalyze} className="space-y-4 text-xs">
              {/* Optional Report ID & Required Report Type / Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Report ID <span className="font-normal text-slate-400">(Optional — auto-generated if blank)</span>:
                  </label>
                  <input
                    type="text"
                    value={reportIdInput}
                    onChange={(e) => setReportIdInput(e.target.value)}
                    placeholder="e.g. OIL-INC-2026-00892"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Report Type <span className="text-red-500">*</span>:</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as ReportType)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    required
                  >
                    <option value="Near Miss">Near Miss</option>
                    <option value="Unsafe Act (UA)">Unsafe Act (UA)</option>
                    <option value="Unsafe Condition (UC)">Unsafe Condition (UC)</option>
                    <option value="Incident">Incident</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date <span className="text-red-500">*</span>:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Required Site, Activity & Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    OIL Field Site <span className="text-red-500">*</span>:
                    {isSiteManager && <span className="text-[10px] text-amber-700 font-normal ml-1">(Assigned Site Only)</span>}
                  </label>
                  <select
                    value={site}
                    disabled={isSiteManager}
                    onChange={(e) => setSite(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-75 disabled:bg-slate-100"
                    required
                  >
                    {OIL_SITES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Main Activity <span className="text-red-500">*</span>:</label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    required
                  >
                    {ACTIVITIES.map((act) => (
                      <option key={act} value={act}>
                        {act}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / Tag <span className="font-normal text-slate-400">(Optional)</span>:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Process Vessel V-304"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              {/* Narrative & Person Type */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">
                    Report Narrative / Description <span className="text-red-500">*</span>:
                  </label>
                  <textarea
                    rows={3}
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    placeholder="Describe the safety observation, near miss, or incident in detail..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Person Type <span className="font-normal text-slate-400">(Optional)</span>:</label>
                  <select
                    value={personType}
                    onChange={(e) => setPersonType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="Contractor">Contractor Personnel</option>
                    <option value="OIL Staff">OIL Direct Staff</option>
                  </select>
                </div>
              </div>

              {/* Optional Fields: Immediate Cause, Contributing Factors, Corrective Action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Immediate Cause <span className="font-normal text-slate-400">(Optional)</span>:</label>
                  <input
                    type="text"
                    value={immediateCause}
                    onChange={(e) => setImmediateCause(e.target.value)}
                    placeholder="e.g. Omitted gas test"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contributing Factors <span className="font-normal text-slate-400">(Optional)</span>:</label>
                  <input
                    type="text"
                    value={contributingFactors}
                    onChange={(e) => setContributingFactors(e.target.value)}
                    placeholder="e.g. Calibration expired"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Corrective Action Taken <span className="font-normal text-slate-400">(Optional)</span>:</label>
                  <input
                    type="text"
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    placeholder="e.g. Work halted, vessel ventilated"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full bg-oil-navy hover:bg-oil-navy-dark text-white font-extrabold py-3 px-4 rounded-lg transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-oil-gold" />
                    Running AI/NLP Model Analysis...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-oil-gold" />
                    Analyze with AI/NLP
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Structured AI Analysis Result Output */}
          {analyzedReport && (
            <div className="bg-white rounded-xl border-2 border-oil-gold p-6 shadow-md space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>
                    LLM Analysis Completed & Logged to Firestore!
                    {isDuplicate && <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded border border-amber-300 font-normal">(Updated Existing Record ID)</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-oil-navy">
                  <span>Report ID:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{analyzedReport.report_id}</span>
                </div>
              </div>

              {/* 10 AI Required Outputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
                {/* 1. SIF Potential */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">1. SIF Potential</span>
                  <span className={`font-extrabold text-sm px-2.5 py-1 rounded ${analyzedReport.classification === 'PSIF Potential' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                    {analyzedReport.classification}
                  </span>
                </div>

                {/* 2. SIF Confidence */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">2. SIF Confidence</span>
                  <span className="font-extrabold text-oil-navy text-base font-mono">
                    {analyzedReport.confidence.toFixed(1)}%
                  </span>
                </div>

                {/* 3. Priority */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">3. Assigned Priority</span>
                  <span className={`font-extrabold text-sm font-mono ${analyzedReport.risk_level === 'CRITICAL' ? 'text-red-700' : analyzedReport.risk_level === 'HIGH' ? 'text-orange-600' : 'text-emerald-700'}`}>
                    {analyzedReport.risk_level}
                  </span>
                </div>

                {/* 4. Mapped Life-Saving Rule */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">4. Life-Saving Rule(s)</span>
                  <span className="font-extrabold text-oil-blue text-sm block truncate">
                    {analyzedReport.life_saving_rules[0]?.rule || 'Work Authorisation'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">({analyzedReport.life_saving_rules[0]?.confidence || 95}% rule confidence)</span>
                </div>
              </div>

              {/* Detailed Extracted AI Fields (5. Hazards, 6. Precursors, 7. Barrier Failures, 8. Exposure, 9. Main Activity, 10. Evidence & Explanation) */}
              <div className="bg-slate-900 text-white rounded-xl p-5 text-xs space-y-4">
                <div className="flex items-center justify-between text-oil-gold font-bold border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>LLM Safety Intelligence Diagnostic Summary</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">9. Main Activity: <strong className="text-white">{analyzedReport.activity}</strong></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 5. Extracted Hazards & 6. Precursors */}
                  <div className="bg-slate-800/90 rounded-lg p-3.5 border border-slate-700 space-y-2">
                    <span className="text-[10px] text-oil-gold uppercase font-bold block">5. Extracted Hazards & 6. SIF Precursors:</span>
                    <ul className="list-disc list-inside text-amber-300 font-medium space-y-1">
                      {(analyzedReport.precursors?.energy_sources || []).map((h, i) => (
                        <li key={`h-${i}`}>Hazard: <span className="text-slate-200">{h}</span></li>
                      ))}
                      {(analyzedReport.precursors?.barrier_failures || []).map((p, i) => (
                        <li key={`p-${i}`}>Precursor: <span className="text-slate-200">{p}</span></li>
                      ))}
                    </ul>
                  </div>

                  {/* 7. Barrier Failures & 8. Exposure */}
                  <div className="bg-slate-800/90 rounded-lg p-3.5 border border-slate-700 space-y-2">
                    <span className="text-[10px] text-oil-gold uppercase font-bold block">7. Barrier Failures & 8. Exposure:</span>
                    <p className="text-slate-300 font-medium">
                      <strong>Barrier Failures:</strong> {analyzedReport.precursors?.barrier_failures?.join(", ") || "Safety control omission"}
                    </p>
                    <p className="text-slate-300 font-medium mt-1">
                      <strong>Exposed Personnel:</strong> {analyzedReport.contractor_type} technician / operator
                    </p>
                  </div>
                </div>

                {/* 10. Supporting Evidence & AI Explanation */}
                <div className="bg-oil-navy/90 rounded-lg p-3.5 border border-slate-700 space-y-2 text-slate-200">
                  <span className="text-[10px] text-oil-gold uppercase font-bold block">10. Supporting Evidence & AI Risk Explanation:</span>
                  {analyzedReport.highlighted_phrases && analyzedReport.highlighted_phrases.length > 0 && (
                    <div className="text-xs text-slate-300 italic mb-2 bg-slate-950/60 p-2 rounded border border-slate-800">
                      Evidence Quote: "{analyzedReport.highlighted_phrases[0]?.text}"
                    </div>
                  )}
                  <p className="leading-relaxed text-slate-200 font-medium">
                    {analyzedReport.life_saving_rules[0]?.reason || analyzedReport.immediate_causes}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-medium">Single report record stored in Firestore collection <code>reports/{analyzedReport.report_id}</code>.</span>
                <button
                  onClick={() => navigateTo('case-detail', { reportId: analyzedReport.report_id })}
                  className="bg-oil-navy text-white font-bold text-xs py-2.5 px-5 rounded-lg hover:bg-oil-navy-dark transition flex items-center gap-1.5 shadow"
                >
                  View Full Case Record <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Bulk CSV Upload Section */
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="max-w-md mx-auto border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50 hover:bg-slate-100/80 transition text-center space-y-3">
            <FileSpreadsheet className="w-12 h-12 text-oil-navy mx-auto" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-800">Select or Drop CSV Safety Archive</h3>
              <p className="text-xs text-slate-500 mt-1">Supports <strong>.csv ONLY</strong> files. Excel (.xlsx/.xls) is not supported.</p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              <label className="bg-oil-navy hover:bg-oil-navy-dark text-white font-extrabold py-2.5 px-4 rounded-lg transition shadow inline-flex items-center gap-2 text-xs cursor-pointer">
                <UploadCloud className="w-4 h-4 text-oil-gold" />
                Upload CSV File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-2.5 px-4 rounded-lg transition border border-slate-300 inline-flex items-center gap-2 text-xs"
              >
                <Download className="w-4 h-4 text-slate-600" />
                Download CSV Template
              </button>
            </div>
          </div>

          {bulkProcessing && (
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Processing Rows via LLM Analysis Engine...</span>
                <span>{bulkProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-oil-navy h-full rounded-full transition-all duration-200" style={{ width: `${bulkProgress}%` }}></div>
              </div>
            </div>
          )}

          {bulkComplete && bulkStats && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-950 space-y-4 max-w-xl mx-auto animate-in fade-in duration-200">
              <div className="flex items-center justify-center gap-2 font-extrabold text-base text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                CSV Processing Complete & Stored in Firestore!
              </div>

              {/* Summary Cards: Total rows, Successfully analyzed, Failed rows, Duplicate rows */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-left">
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-slate-400 font-bold block">Total Rows:</span>
                  <strong className="text-slate-800 text-sm">{bulkStats.total_rows}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-slate-400 font-bold block">Successfully Analyzed:</span>
                  <strong className="text-emerald-700 text-sm">{bulkStats.processed}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-slate-400 font-bold block">Failed Rows:</span>
                  <strong className="text-amber-700 text-sm">{bulkStats.failed}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="text-slate-400 font-bold block">Duplicate Rows:</span>
                  <strong className="text-slate-600 text-sm">{bulkStats.duplicates}</strong>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                <span className="text-slate-600 font-semibold">SIF Potential Identified:</span>
                <strong className="text-red-700 font-extrabold">{bulkStats.sif} Reports</strong>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('reports')}
                  className="bg-oil-navy hover:bg-oil-navy-dark text-white font-bold text-xs py-2.5 px-5 rounded-lg transition shadow"
                >
                  View All Stored Reports
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
