import json
import hashlib
from datetime import datetime
from collections import defaultdict, Counter
from typing import List, Dict, Any, Optional
from ..db.store import get_reports

LSR_CANON = {
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

LSR_TITLES = {
    "Energy Isolation": "Energy Isolation Precursor Recurrence",
    "Working at Height": "Working at Height Fall Protection Deficit",
    "Confined Space": "Confined Space Entry Barrier Failure",
    "Hot Work": "Hot Work Ignition Precursor Density Spike",
    "Safe Mechanical Lifting": "Mechanical Lifting Zone Violation Pattern",
    "Driving": "Vehicle Movement Safety Control Gap",
    "Bypassing Safety Controls": "Safety Critical Control Bypass Anomaly",
    "Work Authorisation": "Work Permit Authorisation Protocol Gap",
    "Line of Fire": "Line of Fire Machinery Exclusion Gap",
}

LSR_ACTIONS = {
    "Energy Isolation": "Conduct targeted Energy Isolation & LOTO verification audit across {site} process units and maintenance teams.",
    "Working at Height": "Inspect all elevated work platforms and enforce 100% tie-off compliance and toe-board installation at {site} Field.",
    "Confined Space": "Enforce mandatory gas clearance testing and dedicated standby attendant verification prior to vessel entry at {site}.",
    "Hot Work": "Inspect hot work permit conditions and verify continuous combustible gas detector calibration at {site}.",
    "Safe Mechanical Lifting": "Verify crane rigging tackle certification and re-establish barricaded exclusion zones for lifting operations at {site}.",
    "Line of Fire": "Audit exclusion zones and ensure clear line-of-sight communication between spotters and operators at {site}.",
    "Driving": "Reinforce speed limits and mandatory seatbelt compliance for all field vehicles operating in {site}.",
    "Bypassing Safety Controls": "Review all active safety device overrides and ensure Management of Change (MOC) sign-off at {site}.",
    "Work Authorisation": "Audit active PTW documentation and verify pre-job toolbox talks across all active work sites in {site}.",
}

# In-memory status store to preserve status updates (Active, Acknowledged, Investigating, Resolved)
_alert_status_store: Dict[str, str] = {}

def update_alert_status(alert_id: str, new_status: str) -> bool:
    """Updates status for a dynamically generated alert."""
    if new_status in ("Active", "Acknowledged", "Investigating", "Resolved"):
        _alert_status_store[alert_id] = new_status
        return True
    return False

def generate_early_warnings(limit: int = 10) -> List[Dict[str, Any]]:
    """
    Analyzes actual stored safety reports and generates deterministic, evidence-based
    Early Warning Alerts for recurring SIF-potential precursors and barrier failures.
    """
    rows = get_reports(10000)
    if not rows:
        return []

    parsed_reports = []
    for row in rows:
        try:
            rep = json.loads(row['report_json'])
            res = json.loads(row['result_json'])
        except Exception:
            continue

        ai = rep.get("ai_analysis", {})

        # SIF potential evaluation
        is_sif = False
        res_conf = float(res.get("confidence", 0) or 0)
        if res_conf > 1.0: res_conf /= 100.0
        
        if res.get("sif_potential") is not None:
            is_sif = bool(res["sif_potential"])
        elif ai.get("sif_potential") is not None:
            is_sif = bool(ai["sif_potential"])
        else:
            is_sif = res_conf >= 0.55

        date_str = rep.get("date") or "2026-08-31"
        site = rep.get("site") or "Unknown"
        report_id = rep.get("report_id") or row.get("report_id") or "UNKNOWN"

        # Life-Saving Rules extraction
        raw_lsrs = []
        if res.get("life_saving_rule"):
            raw_lsrs.append(res.get("life_saving_rule"))
        for l in res.get("life_saving_rules") or []:
            if isinstance(l, dict): raw_lsrs.append(l.get("rule"))
            elif isinstance(l, str): raw_lsrs.append(l)
        for l in ai.get("life_saving_rules") or []:
            if isinstance(l, dict): raw_lsrs.append(l.get("rule"))
            elif isinstance(l, str): raw_lsrs.append(l)

        canon_lsrs = list(set(LSR_CANON[r] for r in raw_lsrs if r in LSR_CANON))
        barriers = res.get("barrier_failures") or ai.get("barrier_failures") or []

        parsed_reports.append({
            "report_id": report_id,
            "date": date_str,
            "site": site,
            "is_sif": is_sif,
            "conf": res_conf,
            "lsrs": canon_lsrs,
            "barriers": barriers
        })

    # Group SIF reports by (site, LSR) pattern
    sif_groups = defaultdict(list)
    for r in parsed_reports:
        if r["is_sif"]:
            for lsr in r["lsrs"]:
                sif_groups[(r["site"], lsr)].append(r)

    alerts = []
    for (site, lsr), group_reps in sif_groups.items():
        count = len(group_reps)
        # Concentration threshold: at least 2 SIF-potential reports for the same site & LSR
        if count < 2:
            continue

        report_ids = sorted([r["report_id"] for r in group_reps])
        dates = sorted([r["date"] for r in group_reps])
        latest_date = dates[-1]

        # Time span calculation
        try:
            d1 = datetime.strptime(dates[0], "%Y-%m-%d")
            d2 = datetime.strptime(dates[-1], "%Y-%m-%d")
            span_days = (d2 - d1).days
        except Exception:
            span_days = None

        # Extract primary barrier failure driver
        all_barriers = [b.strip() for r in group_reps for b in r["barriers"] if b and b.strip()]
        if all_barriers:
            top_barrier = Counter(all_barriers).most_common(1)[0][0]
        else:
            top_barrier = f"{lsr} control verification omission"

        # Deterministic alert ID
        raw_hash = hashlib.md5(f"{site}_{lsr}".encode()).hexdigest()[:4].upper()
        alert_id = f"ALT-2026-{raw_hash}"

        # Metric text
        if span_days is not None and span_days > 0:
            metric_text = f"{count} PSIF reports flagged ({dates[0]} to {dates[-1]})"
        else:
            metric_text = f"{count} PSIF reports flagged for {lsr}"

        title = LSR_TITLES.get(lsr, f"{lsr} Precursor Pattern Detected")
        action_tpl = LSR_ACTIONS.get(lsr, "Conduct safety barrier review and compliance audit at {site} Field.")
        recommended = action_tpl.format(site=site)

        # Severity
        severity = "CRITICAL" if count >= 2 else "HIGH"

        # Stored or default status
        status = _alert_status_store.get(alert_id, "Active")

        alert = {
            "id": alert_id,
            "title": title,
            "site": site,
            "severity": severity,
            "metric_text": metric_text,
            "common_precursor": top_barrier,
            "recommended_action": recommended,
            "timestamp": f"{latest_date} 14:30",
            "status": status,
            "related_report_ids": report_ids
        }
        alerts.append(alert)

    # Sort alerts by date descending, count descending
    alerts.sort(key=lambda x: (x["timestamp"], len(x["related_report_ids"])), reverse=True)
    return alerts[:limit]
