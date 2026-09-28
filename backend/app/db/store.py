import json, sqlite3
from datetime import datetime, timezone
from pathlib import Path
from ..core.config import settings

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
raw_db_path = settings.database_url.replace("sqlite:///", "")
DB_PATH = Path(raw_db_path) if Path(raw_db_path).is_absolute() else BACKEND_DIR / raw_db_path

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
    import csv
    from ..schemas.report import ReportInput
    from ..engines.sif_engine import analyze_report
    
    csv_path = Path(__file__).resolve().parent.parent.parent / "data" / "sample_reports.csv"
    if csv_path.exists():
        try:
            with open(csv_path, mode='r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    try:
                        rep = ReportInput(
                            report_id=row['report_id'],
                            report_type=row['report_type'],
                            date=row.get('date', '2026-08-31'),
                            text=row['text'],
                            site=row.get('site', 'Duliajan'),
                            location=row.get('location', 'Process Site'),
                            activity=row.get('activity', 'General Operations')
                        )
                        res = analyze_report(rep)
                        save_analysis(rep, res)
                    except Exception as e:
                        print(f"[store] Seed row failed for {row.get('report_id', '?')}: {e}")
        except Exception as e:
            print(f"[store] Failed reading sample_reports.csv for seeding: {e}")

def save_analysis(report, result):
    with connect() as c:
        report_dict = report.model_dump(mode='json')
        if not report_dict.get('date'):
            report_dict['date'] = report.date or getattr(result, 'analyzed_at', datetime.now(timezone.utc)).strftime('%Y-%m-%d')
        c.execute("INSERT OR REPLACE INTO reports VALUES (?, ?, ?, ?)", (result.report_id, json.dumps(report_dict), json.dumps(result.model_dump(mode='json')), result.analyzed_at.isoformat()))
        c.commit()

def get_reports(limit=100):
    with connect() as c:
        return [dict(r) for r in c.execute("SELECT * FROM reports ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()]
