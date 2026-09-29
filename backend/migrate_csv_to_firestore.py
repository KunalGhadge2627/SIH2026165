import sys
import os
import csv
from datetime import datetime, timezone

# Add the backend dir to the path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.firestore_store import init_firestore, save_report_document, report_exists, get_all_reports, _db_client
from app.services.llm_service import analyze_report_with_llm

def run_migration():
    init_firestore()
    
    # Check fallback / initialization state
    from app.db.firestore_store import _using_firestore
    if not _using_firestore:
        print("Failed to initialize Firestore!")
        return

    # Count before
    before_reports = get_all_reports(1000)
    before_count = len(before_reports) if before_reports else 0
    print(f"Firestore reports before migration: {before_count}")
    
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "sample_reports.csv")
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return
        
    with open(csv_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
    total_csv_rows = len(rows)
    print(f"CSV reports found: {total_csv_rows}")
    
    imported = 0
    skipped = 0
    failed = 0
    
    for i, row in enumerate(rows, 1):
        narrative = row.get('narrative') or row.get('text') or row.get('description') or row.get('report') or row.get('Narrative')
        if not narrative or len(narrative.strip()) < 5:
            print(f"Row {i} failed: No narrative")
            failed += 1
            continue
            
        raw_id = row.get('report_id') or row.get('id')
        report_id = raw_id.strip() if raw_id and raw_id.strip() else None
        
        if not report_id:
            print(f"Row {i} failed: No report_id")
            failed += 1
            continue
            
        # VERY IMPORTANT: Only check Firestore specifically so we don't skip just because SQLite has it.
        # But report_exists checks both. If it exists in Firestore, we should skip it.
        # Let's use Firestore directly here to be absolutely safe
        from app.db.firestore_store import _db_client
        doc_ref = _db_client.collection("reports").document(report_id)
        if doc_ref.get().exists:
            print(f"Row {i} skipped: {report_id} already exists in Firestore")
            skipped += 1
            continue
            
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
            print(f"Analyzing {report_id}...")
            ai_result = analyze_report_with_llm(report_data)
            
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
            save_report_document(doc, is_update=False)
            print(f"Successfully imported {report_id}")
            imported += 1
        except Exception as e:
            print(f"Failed to process {report_id}: {e}")
            failed += 1

    after_reports = get_all_reports(1000)
    after_count = len(after_reports) if after_reports else 0
    
    print("\n--- MIGRATION RESULTS ---")
    print(f"CSV reports found: {total_csv_rows}")
    print(f"Firestore reports before migration: {before_count}")
    print(f"Successfully imported: {imported}")
    print(f"Already existing/skipped: {skipped}")
    print(f"Failed: {failed}")
    print(f"Firestore reports after migration: {after_count}")
    print(f"GET /api/reports count: {after_count}")

if __name__ == "__main__":
    run_migration()
