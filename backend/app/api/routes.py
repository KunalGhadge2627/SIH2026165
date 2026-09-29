import csv, io, json, uuid
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, HTTPException, Response
from ..schemas.report import ReportInput
from ..services.llm_service import analyze_report_with_llm
from ..db.firestore_store import save_report_document, get_all_reports, get_report_by_id, report_exists
from ..services.patterns import discover_patterns
from ..services.alerts import generate_early_warnings, update_alert_status

router = APIRouter()

def _build_safety_report_format(doc: dict) -> dict:
    """Formats unified report document for frontend SafetyReport type compatibility."""
    ai = doc.get("ai_analysis", {})
    rules = ai.get("life_saving_rules") or []
    rule_map = {
        "Energy Isolation": "Energy Isolation",
        "Line of Fire": "Line of Fire",
        "Hot Work": "Hot Work",
        "Confined Space": "Confined Space",
        "Work at Height": "Working at Height",
        "Working at Height": "Working at Height",
        "Lifting": "Safe Mechanical Lifting",
        "Safe Mechanical Lifting": "Safe Mechanical Lifting",
        "Driving": "Driving",
        "Bypassing Safety Controls": "Bypassing Safety Controls",
        "Work Authorisation": "Work Authorisation",
        "Work Authorization": "Work Authorisation"
    }
    raw_lsr = rules[0].get("rule") if rules else "Work Authorisation"
    lsr_name = rule_map.get(raw_lsr, "Work Authorisation")
    rule_conf = rules[0].get("confidence", 0.85) if rules else 0.85
    if rule_conf <= 1.0: rule_conf = round(rule_conf * 100, 1)

    sif_potential = bool(ai.get("sif_potential", False))
    conf = float(ai.get("confidence", 0.75))
    if conf <= 1.0: conf = round(conf * 100, 1)

    priority = ai.get("priority", "Medium")
    risk_level = "CRITICAL" if priority == "Critical" else "HIGH" if priority == "High" else "MEDIUM" if priority == "Medium" else "LOW"

    narrative = doc.get("narrative") or doc.get("text") or ""
    rep_type_raw = doc.get("report_type", "near_miss").lower()
    rep_type_map = {
        "near_miss": "Near Miss",
        "unsafe_act": "Unsafe Act (UA)",
        "unsafe_condition": "Unsafe Condition (UC)",
        "incident": "Incident",
        "observation": "Near Miss"
    }

    return {
        "report_id": doc.get("report_id"),
        "report_type": rep_type_map.get(rep_type_raw, "Near Miss"),
        "site": doc.get("site", "Duliajan"),
        "date": doc.get("date", "2026-08-31"),
        "activity": ai.get("activity") or doc.get("activity") or "General Operations",
        "location": doc.get("location", "Process Site"),
        "contractor_type": doc.get("person_type") or doc.get("contractor_type") or "Contractor",
        "description": narrative,
        "immediate_causes": doc.get("immediate_cause") or ai.get("explanation") or "",
        "contributing_factors": doc.get("contributing_factors") or ", ".join(ai.get("precursors", [])[:2]),
        "corrective_actions": doc.get("corrective_action") or "Work halted, safety barrier restored.",
        "p_sif": round(conf / 100.0, 3),
        "classification": "PSIF Potential" if sif_potential else "Non-SIF Potential",
        "confidence": conf,
        "life_saving_rules": [
            {
                "rule": lsr_name,
                "confidence": rule_conf,
                "reason": ai.get("explanation", "")
            }
        ],
        "precursors": {
            "activity": ai.get("activity") or doc.get("activity") or "General Operations",
            "location": doc.get("location", "Process Site"),
            "energy_sources": ai.get("hazards") or ["Operating Hazard"],
            "barrier_failures": ai.get("barrier_failures") or ["Control gap identified"],
            "human_factors": ["Compliance / Omission Signal"],
            "organizational_factors": ["Verification Backlog"]
        },
        "highlighted_phrases": [
            {
                "text": ev,
                "category": "High Energy" if i == 0 else "Barrier Failure",
                "note": f"AI Extracted Signal: {ev}"
            } for i, ev in enumerate(ai.get("evidence", [narrative[:40]]))
        ] if ai.get("evidence") else [
            {"text": narrative[:40], "category": "Barrier Failure", "note": "Precursor risk signal flagged by LLM Engine"}
        ],
        "risk_level": risk_level,
        "review_status": doc.get("review", {}).get("status", "Awaiting HSE Review" if sif_potential else "Reviewed")
    }


@router.get('/health')
def health():
    return {"status": "ok", "service": "OIL Safety Intelligence V5 (LLM Engine)", "version": "5.0.0"}


@router.post('/reports/analyze')
def analyze(report: ReportInput):
    """
    Analyzes one safety report via backend LLM API, enforces duplicate protection,
    persists in Firestore under reports/{report_id}, and returns full AI result.
    """
    report_id = report.report_id or f"OIL-INC-2026-{uuid.uuid4().hex[:5].upper()}"
    narrative = report.narrative or report.text or ""

    if len(narrative.strip()) < 5:
        raise HTTPException(400, "Narrative report description must be at least 5 characters long.")

    report_data = {
        "report_id": report_id,
        "report_type": report.report_type,
        "site": report.site or "Duliajan",
        "date": report.date or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "activity": report.activity or "General Operations",
        "location": report.location or "Process Site",
        "person_type": report.person_type or report.metadata.get("contractor_type") or "Contractor",
        "narrative": narrative,
        "immediate_cause": report.immediate_cause or report.metadata.get("immediate_causes") or "",
        "contributing_factors": report.contributing_factors or report.metadata.get("contributing_factors") or "",
        "corrective_action": report.corrective_action or report.metadata.get("corrective_actions") or "",
    }

    # Duplicate Protection Check
    is_duplicate = report_exists(report_id)

    # Invoke Backend LLM AI Service
    ai_result = analyze_report_with_llm(report_data)

    unified_document = {
        **report_data,
        "ai_analysis": {
            **ai_result,
            "analyzed_at": datetime.now(timezone.utc).isoformat(),
            "model_version": "gemini-sif-v1"
        },
        "review": {
            "status": "Awaiting HSE Review" if ai_result.get("sif_potential") else "Reviewed",
            "reviewed_by": None,
            "reviewed_at": None
        },
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    # Save to Firestore as one document: reports/{report_id}
    save_report_document(unified_document, is_update=is_duplicate)

    safety_report_fmt = _build_safety_report_format(unified_document)

    return {
        "is_duplicate": is_duplicate,
        "analysis": ai_result,
        "document": unified_document,
        "safety_report": safety_report_fmt
    }


@router.get('/reports/template/csv')
def download_csv_template():
    """Generates and returns downloadable CSV template."""
    csv_headers = "report_id,report_type,site,date,activity,location,person_type,narrative,immediate_cause,contributing_factors,corrective_action\n"
    sample_row = 'OIL-SAMPLE-001,near_miss,Duliajan,2026-08-31,Confined Space Entry,Vessel V-201,Contractor,"Technician entered vessel without gas clearance check. H2S alarm triggered at 15ppm.","Omitted pre-task gas test.","Gas detector calibration overdue.","Work halted, vessel ventilated, fresh gas test performed."\n'
    content = csv_headers + sample_row
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=oil_safety_report_template.csv"}
    )


@router.post('/reports/upload-csv')
async def upload_csv(file: UploadFile = File(...)):
    """
    Accepts CSV ONLY. Validates rows, analyzes each valid report using backend LLM API,
    enforces duplicate protection, stores in Firestore, and returns detailed summary.
    """
    if not file.filename or not file.filename.lower().endswith('.csv'):
        raise HTTPException(400, 'Invalid file format. Bulk upload supports CSV files ONLY (.csv).')

    raw = await file.read()
    try:
        content_str = raw.decode('utf-8-sig')
        reader = csv.DictReader(io.StringIO(content_str))
        rows = list(reader)
    except Exception as e:
        raise HTTPException(400, f'Invalid CSV format or encoding: {e}')

    total_rows = len(rows)
    processed_reports = []
    failed_count = 0
    duplicate_count = 0
    sif_count = 0

    seen_ids_in_batch = set()

    for i, row in enumerate(rows, 1):
        narrative = row.get('narrative') or row.get('text') or row.get('description') or row.get('report') or row.get('Narrative')
        if not narrative or len(narrative.strip()) < 5:
            failed_count += 1
            continue

        raw_id = row.get('report_id') or row.get('id')
        report_id = raw_id.strip() if raw_id and raw_id.strip() else f"OIL-CSV-{uuid.uuid4().hex[:6].upper()}"

        if report_id in seen_ids_in_batch or report_exists(report_id):
            duplicate_count += 1
            # If ID was already processed in this batch or DB, update/analyze existing rather than creating new record
            is_dup = True
        else:
            is_dup = False

        seen_ids_in_batch.add(report_id)

        rep_type = row.get('report_type') or 'near_miss'
        rep_type_lower = rep_type.lower().strip()
        if 'near' in rep_type_lower: rep_type = 'near_miss'
        elif 'act' in rep_type_lower or 'ua' in rep_type_lower: rep_type = 'unsafe_act'
        elif 'condition' in rep_type_lower or 'uc' in rep_type_lower: rep_type = 'unsafe_condition'
        elif 'incident' in rep_type_lower: rep_type = 'incident'
        else: rep_type = 'near_miss'

        report_data = {
            "report_id": report_id,
            "report_type": rep_type,
            "site": row.get('site') or 'Duliajan',
            "date": row.get('date') or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "activity": row.get('activity') or 'General Operations',
            "location": row.get('location') or 'Process Site',
            "person_type": row.get('person_type') or row.get('contractor_type') or 'Contractor',
            "narrative": narrative,
            "immediate_cause": row.get('immediate_cause') or row.get('immediate_causes') or '',
            "contributing_factors": row.get('contributing_factors') or '',
            "corrective_action": row.get('corrective_action') or row.get('corrective_actions') or '',
        }

        try:
            ai_result = analyze_report_with_llm(report_data)
            if ai_result.get("sif_potential"):
                sif_count += 1

            doc = {
                **report_data,
                "ai_analysis": {
                    **ai_result,
                    "analyzed_at": datetime.now(timezone.utc).isoformat(),
                    "model_version": "gemini-sif-v1"
                },
                "review": {
                    "status": "Awaiting HSE Review" if ai_result.get("sif_potential") else "Reviewed",
                    "reviewed_by": None,
                    "reviewed_at": None
                },
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            save_report_document(doc, is_update=is_dup)
            processed_reports.append(_build_safety_report_format(doc))
        except Exception as err:
            logger.error(f"Failed to process CSV row {i}: {err}")
            failed_count += 1

    return {
        'total_rows': total_rows,
        'processed': len(processed_reports),
        'failed': failed_count,
        'duplicates': duplicate_count,
        'sif_potential': sif_count,
        'results': processed_reports
    }


@router.get('/reports')
def get_reports_endpoint(limit: int = 100):
    """Returns stored reports from Firestore / database single source of truth."""
    docs = get_all_reports(min(max(limit, 1), 1000))
    return [_build_safety_report_format(doc) for doc in docs]


@router.get('/reports/{report_id}')
def get_single_report_endpoint(report_id: str):
    """Returns complete single report and its AI analysis by report_id."""
    doc = get_report_by_id(report_id)
    if not doc:
        raise HTTPException(404, f"Report with ID '{report_id}' not found.")
    return {
        "document": doc,
        "safety_report": _build_safety_report_format(doc)
    }


@router.get('/patterns')
def patterns(limit: int = 20):
    return discover_patterns(min(max(limit, 1), 100))


@router.get('/dashboard')
def dashboard():
    docs = get_all_reports(10000)
    formatted = [_build_safety_report_format(d) for d in docs]
    total = len(formatted)
    sif = sum(1 for r in formatted if r['p_sif'] >= 0.55)
    awaiting = sum(1 for r in formatted if (r['p_sif'] >= 0.55 or r.get('classification') == 'PSIF Potential') and r['review_status'] == 'Awaiting HSE Review')
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

    month_names = {
        "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
        "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
        "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    }
    monthly_groups = {}
    for r in formatted:
        d = str(r.get("date") or "2026-08-31")
        key = d[:7] if len(d) >= 7 and d[4] == '-' else "2026-08"
        if key not in monthly_groups:
            monthly_groups[key] = {"total": 0, "sif": 0}
        monthly_groups[key]["total"] += 1
        if r["p_sif"] >= 0.55 or r.get("classification") == "PSIF Potential":
            monthly_groups[key]["sif"] += 1

    trend = []
    for key in sorted(monthly_groups.keys()):
        val = monthly_groups[key]
        yr, mo = key.split('-')
        m_name = month_names.get(mo, mo)
        t_cnt = val["total"]
        s_cnt = val["sif"]
        rate = round((s_cnt / max(1, t_cnt)) * 100, 1)
        trend.append({
            "month": f"{m_name} {yr}",
            "month_short": m_name,
            "reports": t_cnt,
            "total": t_cnt,
            "sif": s_cnt,
            "psif": s_cnt,
            "sif_rate": rate,
            "sifRate": rate
        })

    alerts = generate_early_warnings(10)
    top_alert = alerts[0] if alerts else None

    return {
        "total_reports": total,
        "sif_potential": sif,
        "awaiting_review": awaiting,
        "high_priority": critical,
        "sif_rate": round((sif / max(1, total)) * 100, 1),
        "site_distribution": site_dist,
        "monthly_trend": trend,
        "top_alert": top_alert,
        "alerts": alerts,
        "patterns": discover_patterns(5)
    }


@router.get('/alerts')
def get_alerts():
    """Returns all dynamically generated early warning alerts based on real safety report data."""
    return generate_early_warnings(20)


@router.post('/alerts/{alert_id}/status')
def set_alert_status(alert_id: str, payload: dict):
    """Updates status of an early warning alert (Active, Acknowledged, Investigating, Resolved)."""
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(400, "Missing status in payload")
    success = update_alert_status(alert_id, new_status)
    if not success:
        raise HTTPException(400, f"Invalid status '{new_status}'")
    return {"status": "ok", "alert_id": alert_id, "new_status": new_status}


def _normalize_site(s: str) -> str:
    sl = (s or "").lower()
    if 'digboi' in sl: return 'Digboi'
    if 'duliajan' in sl: return 'Duliajan'
    if 'naharkatia' in sl: return 'Naharkatia'
    if 'moran' in sl: return 'Moran'
    if 'jorhat' in sl: return 'Jorhat'
    if 'lakhimpur' in sl: return 'Lakhimpur'
    if 'shalmari' in sl: return 'Shalmari'
    if 'kumchai' in sl: return 'Kumchai'
    if sl.strip() == "": return "Unknown"
    return s.strip()

@router.get('/analytics')
def analytics():
    docs = get_all_reports(10000)
    formatted = [_build_safety_report_format(d) for d in docs]

    site_data = {}
    for doc in docs:
        raw_site = doc.get('site', 'Unknown')
        s = _normalize_site(raw_site)
        if s not in site_data:
            site_data[s] = {"site": s, "Total": 0, "PSIF": 0}
        site_data[s]["Total"] += 1
        
        is_sif = doc.get("ai_analysis", {}).get("sif_potential", False)
        if not is_sif:
            conf = float(doc.get("ai_analysis", {}).get("confidence", 0))
            if conf > 1.0: conf /= 100.0
            is_sif = conf >= 0.55
            
        if is_sif:
            site_data[s]["PSIF"] += 1

    act_data = {}
    for doc in docs:
        a = (doc.get('activity') or 'General Operations').strip()
        if a not in act_data:
            act_data[a] = {"activity": a, "Total": 0, "PSIF": 0}
        act_data[a]["Total"] += 1
        
        is_sif = doc.get("ai_analysis", {}).get("sif_potential", False)
        if not is_sif:
            conf = float(doc.get("ai_analysis", {}).get("confidence", 0))
            if conf > 1.0: conf /= 100.0
            is_sif = conf >= 0.55
            
        if is_sif:
            act_data[a]["PSIF"] += 1

    from collections import Counter as _Counter
    barrier_counter = _Counter()
    
    for doc in docs:
        ai = doc.get("ai_analysis", {})
        bf_list = ai.get("barrier_failures") or []
        for bf in bf_list:
            bf = bf.strip()
            if bf:
                barrier_counter[bf] += 1
                
    top_n = 5
    top_raw = barrier_counter.most_common(top_n)
    total_occurrences = sum(barrier_counter.values())
    top_barrier_failures = []
    for barrier, count in top_raw:
        pct = round((count / max(1, total_occurrences)) * 100, 1)
        top_barrier_failures.append({
            "barrier": barrier,
            "count": count,
            "percentage": pct
        })

    _LSR_CANON = {
        "Energy Isolation": "Energy Isolation",
        "Line of Fire": "Line of Fire",
        "Hot Work": "Hot Work",
        "Confined Space": "Confined Space",
        "Work at Height": "Working at Height",
        "Working at Height": "Working at Height",
        "Lifting": "Safe Mechanical Lifting",
        "Safe Mechanical Lifting": "Safe Mechanical Lifting",
        "Driving": "Driving",
        "Bypassing Safety Controls": "Bypassing Safety Controls",
        "Work Authorisation": "Work Authorisation",
        "Work Authorization": "Work Authorisation",
    }
    _ALL_RULES = [
        "Bypassing Safety Controls", "Confined Space", "Driving",
        "Energy Isolation", "Hot Work", "Line of Fire",
        "Safe Mechanical Lifting", "Work Authorisation", "Working at Height",
    ]

    _site_sif_total = {}
    _cell_count = {}

    for doc in docs:
        is_sif = doc.get("ai_analysis", {}).get("sif_potential", False)
        if not is_sif:
            conf = float(doc.get("ai_analysis", {}).get("confidence", 0))
            if conf > 1.0: conf /= 100.0
            is_sif = conf >= 0.55
            
        if not is_sif:
            continue
            
        raw_site = doc.get('site', 'Unknown')
        _site = _normalize_site(raw_site)
        _site_sif_total[_site] = _site_sif_total.get(_site, 0) + 1
        
        _lsrs_raw = []
        ai_rules = doc.get("ai_analysis", {}).get("life_saving_rules") or []
        for _item in ai_rules:
            if isinstance(_item, dict):
                _r = _item.get("rule") or ""
                if _r: _lsrs_raw.append(_r)
            elif isinstance(_item, str) and _item:
                _lsrs_raw.append(_item)
                
        if not _lsrs_raw:
            ai = doc.get("ai_analysis", {})
            if "life_saving_rule" in ai and ai["life_saving_rule"]:
                _lsrs_raw.append(ai["life_saving_rule"])
                
        _lsrs_canon = list(dict.fromkeys(
            _LSR_CANON[_r] for _r in _lsrs_raw
            if _r in _LSR_CANON and _LSR_CANON[_r] in _ALL_RULES
        ))

        for _lsr in _lsrs_canon:
            _key = (_site, _lsr)
            _cell_count[_key] = _cell_count.get(_key, 0) + 1

    _heatmap_cells = []
    for (_site, _rule), _cnt in sorted(_cell_count.items(), key=lambda x: -x[1]):
        _site_total = _site_sif_total.get(_site, 1)
        _pct = round((_cnt / _site_total) * 100, 1)
        _risk = (
            "CRITICAL" if _pct >= 35.0 else
            "HIGH"     if _pct >= 25.0 else
            "MEDIUM"   if _pct >= 15.0 else
            "LOW"
        )
        _heatmap_cells.append({
            "site":       _site,
            "rule":       _rule,
            "psif_count": _cnt,
            "total_sif_at_site": _site_total,
            "density":    _pct,
            "risk_level": _risk,
        })

    return {
        "sites": list(site_data.values()),
        "activities": list(act_data.values()),
        "contractor_psif": sum(1 for r in formatted if r.get('contractor_type') == 'Contractor' and r['p_sif'] >= 0.55),
        "staff_psif": sum(1 for r in formatted if r.get('contractor_type') == 'OIL Staff' and r['p_sif'] >= 0.55),
        "total_psif": sum(1 for r in formatted if r['p_sif'] >= 0.55),
        "top_barrier_failures": top_barrier_failures,
        "heatmap": _heatmap_cells,
    }

