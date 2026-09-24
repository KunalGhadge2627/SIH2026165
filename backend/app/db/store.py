import json, sqlite3
from pathlib import Path
from ..core.config import settings

DB_PATH = Path(settings.database_url.replace("sqlite:///", ""))

def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    return c

def init_db():
    with connect() as c:
        c.execute("CREATE TABLE IF NOT EXISTS reports (report_id TEXT PRIMARY KEY, report_json TEXT NOT NULL, result_json TEXT NOT NULL, created_at TEXT NOT NULL)")
        c.commit()
    
    # Check if empty and seed initial data
    with connect() as c:
        count = c.execute("SELECT COUNT(*) FROM reports").fetchone()[0]
        if count == 0:
            _seed_initial_reports()

def _seed_initial_reports():
    from ..schemas.report import ReportInput
    from ..engines.sif_engine import analyze_report
    
    seed_data = [
        {
            "report_id": "OIL-INC-2026-00482",
            "report_type": "near_miss",
            "text": "Technician entered separator vessel V-201 for internal weld inspection without performing gas clearance test or establishing continuous forced draft ventilation. H2S detector alarm triggered at 15ppm shortly after entry.",
            "site": "Duliajan",
            "location": "Separator Station 4 - Vessel V-201",
            "activity": "Confined Space Entry"
        },
        {
            "report_id": "OIL-INC-2026-00419",
            "report_type": "unsafe_condition",
            "text": "Hot work welding was initiated on high pressure gas header pipework without installing isolation spade or verifying zero hydrocarbon gas concentration with calibrated gas tester.",
            "site": "Digboi",
            "location": "GGS 2 Process Header",
            "activity": "Hot Work"
        },
        {
            "report_id": "OIL-INC-2026-00394",
            "report_type": "unsafe_act",
            "text": "Contractor technician bypassed electrical LOTO padlocks on main switchgear breaker feeder 4B during pump motor servicing while equipment was energized.",
            "site": "Moran",
            "location": "Main Substation B",
            "activity": "Equipment Maintenance"
        },
        {
            "report_id": "OIL-INC-2026-00355",
            "report_type": "near_miss",
            "text": "Scaffold platform erected at 8m height missing toe-boards and guardrails. Operator was observed leaning over open edge without wearing safety harness fall arrest lanyard.",
            "site": "Jorhat",
            "location": "Drilling Rig 7 Substructure",
            "activity": "Work at Height"
        },
        {
            "report_id": "OIL-INC-2026-00312",
            "report_type": "unsafe_act",
            "text": "Mobile crane lifting 3.5 ton compressor package over active hydrocarbon piping header without taglines or barricading exclusion zone underneath suspended load.",
            "site": "Duliajan",
            "location": "Central Maintenance Yard",
            "activity": "Lifting Operations"
        },
        {
            "report_id": "OIL-INC-2026-00288",
            "report_type": "unsafe_condition",
            "text": "Work permit for hot grinding inside hydrocarbon manifold area was issued without explosive gas testing or fire watch standby technician present.",
            "site": "Rajasthan",
            "location": "Manifold Building A",
            "activity": "Hot Work"
        },
        {
            "report_id": "OIL-INC-2026-00241",
            "report_type": "near_miss",
            "text": "Roustabout was standing inside winch cable line of fire tension path during heavy tubular pulling operations when cable snapped.",
            "site": "Duliajan",
            "location": "Rig Site 12",
            "activity": "Vehicle/Equipment Operations"
        },
        {
            "report_id": "OIL-INC-2026-00199",
            "report_type": "unsafe_act",
            "text": "Operator opened sampling valve on live crude pipeline without wearing chemical goggles, face shield or protective nitrile gloves.",
            "site": "Digboi",
            "location": "Sampling Station 1",
            "activity": "General Operations"
        }
    ]
    for item in seed_data:
        rep = ReportInput(**item)
        res = analyze_report(rep)
        save_analysis(rep, res)

def save_analysis(report, result):
    with connect() as c:
        c.execute("INSERT OR REPLACE INTO reports VALUES (?, ?, ?, ?)", (result.report_id, json.dumps(report.model_dump(mode='json')), json.dumps(result.model_dump(mode='json')), result.analyzed_at.isoformat()))
        c.commit()

def get_reports(limit=100):
    with connect() as c:
        return [dict(r) for r in c.execute("SELECT * FROM reports ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()]

