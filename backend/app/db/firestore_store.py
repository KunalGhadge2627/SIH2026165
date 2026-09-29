import os
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from ..db.store import save_analysis, get_reports as get_sqlite_reports, connect as sqlite_connect, init_db

logger = logging.getLogger("oil_safety.db")

_db_client = None
_using_firestore = False

def _ensure_sqlite_db():
    init_db()
    return sqlite_connect()

def init_firestore():
    """Initializes Firebase Firestore client if credentials are configured."""
    global _db_client, _using_firestore
    
    from dotenv import load_dotenv
    load_dotenv()
    
    cred_path = os.environ.get("FIREBASE_CREDENTIALS") or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    project_id = os.environ.get("FIREBASE_PROJECT_ID") or os.environ.get("GCP_PROJECT")

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            if cred_path and os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                logger.info(f"Initialized Firebase Admin with service account from {cred_path}")
            elif project_id:
                firebase_admin.initialize_app(options={"projectId": project_id})
                logger.info(f"Initialized Firebase Admin with project ID: {project_id}")
            else:
                # Try default app initialization
                firebase_admin.initialize_app()
                logger.info("Initialized Firebase Admin with Default Credentials.")

        _db_client = firestore.client()
        _using_firestore = True
        logger.info("Firebase Firestore initialized successfully.")
    except Exception as e:
        logger.warning(f"Firestore initialization skipped ({e}). Operating with unified persistent SQLite database.")
        _using_firestore = False
        _db_client = None


def get_report_by_id(report_id: str) -> Optional[Dict[str, Any]]:
    """Fetches a single report document by report_id."""
    if _using_firestore and _db_client:
        try:
            doc_ref = _db_client.collection("reports").document(report_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
        except Exception as e:
            logger.error(f"Error fetching document {report_id} from Firestore: {e}")

    # Fallback to local SQLite store
    with _ensure_sqlite_db() as c:
        row = c.execute("SELECT * FROM reports WHERE report_id = ?", (report_id,)).fetchone()
        if row:
            rep_dict = json.loads(row['report_json'])
            res_dict = json.loads(row['result_json'])
            return _format_unified_document(rep_dict, res_dict)
    return None


def report_exists(report_id: str) -> bool:
    """Checks if a report with report_id already exists in Firestore/Database."""
    return get_report_by_id(report_id) is not None


def save_report_document(doc_data: Dict[str, Any], is_update: bool = False) -> bool:
    """
    Saves or updates ONE report document in Firestore under `reports/{report_id}`.
    Enforces single document per report (no duplicates).
    """
    report_id = doc_data["report_id"]
    now_str = datetime.now(timezone.utc).isoformat()

    doc_data["updated_at"] = now_str
    if "created_at" not in doc_data:
        doc_data["created_at"] = now_str

    if _using_firestore and _db_client:
        try:
            doc_ref = _db_client.collection("reports").document(report_id)
            doc_ref.set(doc_data, merge=True)
            logger.info(f"Report {report_id} saved to Firestore collection 'reports'.")
        except Exception as e:
            logger.error(f"Error writing report {report_id} to Firestore: {e}")

    # Sync to local SQLite store for complete consistency
    _sync_to_sqlite(doc_data)
    return True


def get_all_reports(limit: int = 100) -> List[Dict[str, Any]]:
    """Retrieves all stored safety report documents."""
    if _using_firestore and _db_client:
        try:
            docs = _db_client.collection("reports").order_by("created_at", direction="DESCENDING").limit(limit).stream()
            res = [d.to_dict() for d in docs]
            if res:
                return res
        except Exception as e:
            logger.error(f"Error streaming reports from Firestore: {e}")

    # Fallback to SQLite
    rows = get_sqlite_reports(limit)
    formatted = []
    for r in rows:
        rep_dict = json.loads(r['report_json'])
        res_dict = json.loads(r['result_json'])
        formatted.append(_format_unified_document(rep_dict, res_dict))
    return formatted


def _sync_to_sqlite(doc_data: Dict[str, Any]):
    """Syncs unified report document into SQLite storage."""
    report_id = doc_data["report_id"]
    report_json = json.dumps(doc_data)
    result_json = json.dumps(doc_data.get("ai_analysis", {}))
    created_at = doc_data.get("created_at", datetime.now(timezone.utc).isoformat())

    with _ensure_sqlite_db() as c:
        c.execute(
            "INSERT OR REPLACE INTO reports (report_id, report_json, result_json, created_at) VALUES (?, ?, ?, ?)",
            (report_id, report_json, result_json, created_at)
        )
        c.commit()


def _format_unified_document(rep_dict: Dict[str, Any], res_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Builds unified document structure matching Firestore schema."""
    if "ai_analysis" in rep_dict:
        return rep_dict

    report_id = rep_dict.get("report_id") or res_dict.get("report_id") or "OIL-REP-001"
    narrative = rep_dict.get("narrative") or rep_dict.get("text") or rep_dict.get("description") or ""

    return {
        "report_id": report_id,
        "report_type": rep_dict.get("report_type", "near_miss"),
        "site": rep_dict.get("site", "Duliajan"),
        "date": rep_dict.get("date") or rep_dict.get("reported_at") or "2026-08-31",
        "activity": rep_dict.get("activity") or res_dict.get("activity") or "General Operations",
        "location": rep_dict.get("location", "Process Site"),
        "person_type": rep_dict.get("person_type") or rep_dict.get("contractor_type") or "Contractor",
        "narrative": narrative,
        "immediate_cause": rep_dict.get("immediate_cause") or rep_dict.get("immediate_causes") or "",
        "contributing_factors": rep_dict.get("contributing_factors") or "",
        "corrective_action": rep_dict.get("corrective_action") or rep_dict.get("corrective_actions") or "",
        "ai_analysis": {
            "sif_potential": bool(res_dict.get("sif_potential", res_dict.get("confidence", 0) >= 0.55)),
            "confidence": res_dict.get("confidence", 0.75),
            "priority": res_dict.get("priority", "Medium"),
            "life_saving_rules": res_dict.get("life_saving_rules") or [
                {"rule": res_dict.get("life_saving_rule", "Work Authorisation"), "confidence": res_dict.get("rule_confidence", 0.85)}
            ],
            "activity": res_dict.get("activity") or rep_dict.get("activity") or "General Operations",
            "hazards": res_dict.get("hazards", []),
            "precursors": res_dict.get("precursors", []),
            "barrier_failures": res_dict.get("barrier_failures", []),
            "exposure": res_dict.get("exposure", []),
            "evidence": res_dict.get("evidence", []),
            "explanation": res_dict.get("explanation", ""),
            "analyzed_at": res_dict.get("analyzed_at") or datetime.now(timezone.utc).isoformat(),
            "model_version": res_dict.get("model_version", "gemini-sif-v1"),
        },
        "review": {
            "status": rep_dict.get("review_status", "Awaiting HSE Review" if res_dict.get("sif_potential") else "Reviewed"),
            "reviewed_by": None,
            "reviewed_at": None,
        },
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
