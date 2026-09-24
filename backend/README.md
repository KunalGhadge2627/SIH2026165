# OIL Safety Intelligence V5 — Backend

Functional FastAPI prototype for the OIL SIF precursor problem statement.

## What V5 does
- SIF-potential classification with a transparent hybrid scoring engine
- Life-Saving Rule mapping
- Hazard, precursor, exposure and barrier-failure extraction
- Human-readable AI explanation
- SQLite persistence
- CSV batch analysis
- Recurring precursor pattern discovery
- Dashboard aggregation APIs

## Run

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Test a report

POST `/api/reports/analyze`

```json
{
  "report_type": "near_miss",
  "text": "During maintenance the technician started work without isolating the electrical supply.",
  "site": "Duliajan",
  "activity": "Equipment Maintenance"
}
```

## Batch data

```text
POST /api/reports/upload-csv
```

Use `data/sample_reports.csv` for a quick demo.

## Architecture note

V5 intentionally starts with a deterministic, explainable NLP/rule engine so the prototype remains testable without a paid LLM API. An LLM provider can be added later as a secondary explanation/review layer; it should not silently replace the evidence-based classification.
