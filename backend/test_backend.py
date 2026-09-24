import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_all():
    print("--- 1. Testing GET /api/health ---")
    r = client.get("/api/health")
    assert r.status_code == 200, r.text
    print("Health:", r.json())

    print("\n--- 2. Testing POST /api/reports/analyze ---")
    r = client.post("/api/reports/analyze", json={
        "report_type": "near_miss",
        "text": "Worker entered confined space vessel V-304 without verifying oxygen levels or gas clearance certificate.",
        "site": "Duliajan",
        "location": "Process Vessel V-304",
        "activity": "Confined Space Entry"
    })
    assert r.status_code == 200, r.text
    res = r.json()
    print("Analysis output:", json.dumps(res, indent=2))

    print("\n--- 3. Testing GET /api/reports ---")
    r = client.get("/api/reports")
    assert r.status_code == 200, r.text
    reps = r.json()
    print(f"Fetched {len(reps)} reports from DB")

    print("\n--- 4. Testing GET /api/patterns ---")
    r = client.get("/api/patterns")
    assert r.status_code == 200, r.text
    patterns = r.json()
    print(f"Fetched {len(patterns)} precursor patterns:", [p['id'] for p in patterns])

    print("\n--- 5. Testing GET /api/dashboard ---")
    r = client.get("/api/dashboard")
    assert r.status_code == 200, r.text
    dash = r.json()
    print("Dashboard metrics:", {k: dash[k] for k in ('total_reports', 'sif_potential', 'awaiting_review', 'high_priority', 'sif_rate')})

    print("\n--- 6. Testing GET /api/analytics ---")
    r = client.get("/api/analytics")
    assert r.status_code == 200, r.text
    analytics = r.json()
    print("Analytics metrics:", {k: len(analytics[k]) if isinstance(analytics[k], list) else analytics[k] for k in analytics})

    print("\n--- 7. Testing POST /api/reports/upload-csv ---")
    with open("data/sample_reports.csv", "rb") as f:
        r = client.post("/api/reports/upload-csv", files={"file": ("sample_reports.csv", f, "text/csv")})
    assert r.status_code == 200, r.text
    csv_res = r.json()
    print("CSV Upload response:", {"processed": csv_res["processed"], "sif_potential": csv_res["sif_potential"]})

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
