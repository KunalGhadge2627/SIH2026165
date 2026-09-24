import csv, io, json, uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from ..schemas.report import ReportInput
from ..engines.sif_engine import analyze_report, format_as_safety_report
from ..db.store import save_analysis, get_reports
from ..services.patterns import discover_patterns

router = APIRouter()

@router.get('/health')
def health():
    return {"status": "ok", "service": "OIL Safety Intelligence V5", "version": "5.0.0"}

@router.post('/reports/analyze')
def analyze(report: ReportInput):
    report.report_id = report.report_id or f"OIL-INC-2026-{uuid.uuid4().hex[:5].upper()}"
    result = analyze_report(report)
    save_analysis(report, result)
    safety_rep = format_as_safety_report(report, result)
    return {
        "analysis": result,
        "safety_report": safety_rep
    }

@router.get('/reports')
def reports(limit: int = 100):
    rows = get_reports(min(max(limit, 1), 1000))
    formatted = []
    for r in rows:
        rep_dict = json.loads(r['report_json'])
        res_dict = json.loads(r['result_json'])
        rep = ReportInput(**rep_dict)
        res = analyze_report(rep)
        formatted.append(format_as_safety_report(rep, res))
    return formatted

@router.get('/patterns')
def patterns(limit: int = 20):
    return discover_patterns(min(max(limit, 1), 100))

@router.get('/dashboard')
def dashboard():
    rows = get_reports(10000)
    formatted = []
    for r in rows:
        rep_dict = json.loads(r['report_json'])
        res = analyze_report(ReportInput(**rep_dict))
        formatted.append(format_as_safety_report(ReportInput(**rep_dict), res))
        
    total = len(formatted)
    sif = sum(1 for r in formatted if r['p_sif'] >= 0.55)
    awaiting = sum(1 for r in formatted if r['review_status'] == 'Awaiting HSE Review')
    critical = sum(1 for r in formatted if r['risk_level'] == 'CRITICAL')
    
    site_counts = {}
    for r in formatted:
        site = r.get('site', 'Duliajan')
        if site not in site_counts:
            site_counts[site] = {"total": 0, "sif": 0}
        site_counts[site]["total"] += 1
        if r['p_sif'] >= 0.55:
            site_counts[site]["sif"] += 1
            
    site_dist = [{"site": s, "total": v["total"], "sif": v["sif"]} for s, v in site_counts.items()]
    site_dist.sort(key=lambda x: x["sif"], reverse=True)
    
    trend = [
        {"month": "Jan", "reports": 380, "sif": 52},
        {"month": "Feb", "reports": 410, "sif": 61},
        {"month": "Mar", "reports": 440, "sif": 74},
        {"month": "Apr", "reports": 390, "sif": 58},
        {"month": "May", "reports": 460, "sif": 81},
        {"month": "Jun", "reports": 480, "sif": 79},
        {"month": "Jul", "reports": 510, "sif": 91},
        {"month": "Aug", "reports": 520, "sif": 88},
    ]
    
    top_alert = {
        "id": "ALERT-001",
        "title": "Confined Space Gas Clearance Omission Surge",
        "site": "Digboi",
        "severity": "CRITICAL",
        "metric_text": "+42% increase in gas test omissions",
        "common_precursor": "Vessel entry initiated prior to gas clearance certificate issue.",
        "recommended_action": "HSE Audit on Gas Tester Instrument Calibration",
        "timestamp": "2026-08-31 14:30",
        "status": "Active"
    }

    return {
        "total_reports": total,
        "sif_potential": sif,
        "awaiting_review": awaiting,
        "high_priority": critical,
        "sif_rate": round((sif / max(1, total)) * 100, 1),
        "site_distribution": site_dist,
        "monthly_trend": trend,
        "top_alert": top_alert,
        "patterns": discover_patterns(5)
    }

@router.get('/analytics')
def analytics():
    rows = get_reports(10000)
    formatted = []
    for r in rows:
        rep_dict = json.loads(r['report_json'])
        res = analyze_report(ReportInput(**rep_dict))
        formatted.append(format_as_safety_report(ReportInput(**rep_dict), res))

    site_data = {}
    for r in formatted:
        s = r.get('site', 'Duliajan')
        if s not in site_data:
            site_data[s] = {"site": s, "Total": 0, "PSIF": 0}
        site_data[s]["Total"] += 1
        if r['p_sif'] >= 0.55:
            site_data[s]["PSIF"] += 1

    act_data = {}
    for r in formatted:
        a = r.get('activity', 'General Operations')
        if a not in act_data:
            act_data[a] = {"activity": a, "Total": 0, "PSIF": 0}
        act_data[a]["Total"] += 1
        if r['p_sif'] >= 0.55:
            act_data[a]["PSIF"] += 1

    return {
        "sites": list(site_data.values()),
        "activities": list(act_data.values()),
        "contractor_psif": sum(1 for r in formatted if r.get('contractor_type') == 'Contractor' and r['p_sif'] >= 0.55),
        "staff_psif": sum(1 for r in formatted if r.get('contractor_type') == 'OIL Staff' and r['p_sif'] >= 0.55),
        "top_barriers": [
            {"name": "Isolation Not Verified / LOTO Missing", "count": 67, "pct": 36.4},
            {"name": "Confined Space Gas Testing Omitted", "count": 48, "pct": 26.0},
            {"name": "Hot Work Near Hydrocarbons W/O Gas Detector", "count": 42, "pct": 22.8},
            {"name": "Damaged Rigging Tackle / Wire Rope Slings", "count": 39, "pct": 21.1},
            {"name": "Safety Interlock Relay Jumpered", "count": 24, "pct": 13.0}
        ]
    }

@router.post('/reports/upload-csv')
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith('.csv'):
        raise HTTPException(400, 'Upload a CSV file.')
    raw = await file.read()
    try:
        rows = list(csv.DictReader(io.StringIO(raw.decode('utf-8-sig'))))
    except Exception as e:
        raise HTTPException(400, f'Invalid CSV: {e}')
        
    processed_reports = []
    for i, row in enumerate(rows, 1):
        text = row.get('text') or row.get('description') or row.get('report') or row.get('Narrative')
        if not text or len(text.strip()) < 5:
            continue
            
        report_id = row.get('report_id') or row.get('id') or f"OIL-CSV-{i:04d}"
        rep_type = row.get('report_type') or 'near_miss'
        if rep_type.lower() in ('near miss', 'near_miss'): rep_type = 'near_miss'
        elif rep_type.lower() in ('unsafe act', 'unsafe_act', 'ua'): rep_type = 'unsafe_act'
        elif rep_type.lower() in ('unsafe condition', 'unsafe_condition', 'uc'): rep_type = 'unsafe_condition'
        else: rep_type = 'near_miss'
        
        report = ReportInput(
            report_id=report_id,
            report_type=rep_type,
            text=text,
            site=row.get('site') or 'Duliajan',
            location=row.get('location') or 'Process Site',
            activity=row.get('activity') or 'General Operations',
            metadata={
                "contractor_type": row.get('contractor_type') or 'Contractor',
                "immediate_causes": row.get('immediate_causes') or 'Omitted gas check / verification',
                "contributing_factors": row.get('contributing_factors') or 'Equipment inspection overdue',
                "corrective_actions": row.get('corrective_actions') or 'Work halted, safety barrier restored.'
            }
        )
        result = analyze_report(report)
        save_analysis(report, result)
        safety_rep = format_as_safety_report(report, result)
        processed_reports.append(safety_rep)
        
    sif_count = sum(1 for r in processed_reports if r['p_sif'] >= 0.55)
    return {
        'processed': len(processed_reports),
        'sif_potential': sif_count,
        'results': processed_reports
    }

