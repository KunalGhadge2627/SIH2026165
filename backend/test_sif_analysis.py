import unittest
import io
import json
from fastapi.testclient import TestClient
from app.main import app
from app.db.firestore_store import report_exists, get_report_by_id

class TestSafetyReportAnalysis(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_01_health_check(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        self.assertIn('status', res.json())

    def test_02_manual_report_analysis(self):
        payload = {
            "report_id": "TEST-REP-2026-001",
            "report_type": "near_miss",
            "site": "Duliajan",
            "date": "2026-08-31",
            "activity": "Confined Space Entry",
            "narrative": "Technician entered separator vessel V-201 without performing gas clearance test or establishing ventilation. H2S alarm triggered at 15ppm.",
            "location": "Separator Station 4",
            "person_type": "Contractor",
            "immediate_cause": "Omitted pre-task gas check.",
            "contributing_factors": "Detector calibration expired.",
            "corrective_action": "Work halted, vessel ventilated."
        }
        res = self.client.post('/api/reports/analyze', json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("analysis", data)
        self.assertIn("safety_report", data)
        ai = data["analysis"]
        self.assertIn("sif_potential", ai)
        self.assertIn("confidence", ai)
        self.assertIn("priority", ai)
        self.assertIn("life_saving_rules", ai)
        self.assertTrue(report_exists("TEST-REP-2026-001"))

    def test_03_duplicate_protection(self):
        payload = {
            "report_id": "TEST-REP-2026-001",
            "report_type": "near_miss",
            "site": "Duliajan",
            "date": "2026-08-31",
            "activity": "Confined Space Entry",
            "narrative": "Technician entered separator vessel V-201 without performing gas clearance test or establishing ventilation. H2S alarm triggered at 15ppm."
        }
        res = self.client.post('/api/reports/analyze', json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("is_duplicate"))

    def test_04_csv_template_download(self):
        res = self.client.get('/api/reports/template/csv')
        self.assertEqual(res.status_code, 200)
        self.assertIn("text/csv", res.headers.get("content-type", ""))
        self.assertIn("report_id,report_type,site", res.text)

    def test_05_non_csv_rejection(self):
        fake_excel = io.BytesIO(b"PK\x03\x04 fake excel content")
        files = {"file": ("data.xlsx", fake_excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        res = self.client.post('/api/reports/upload-csv', files=files)
        self.assertEqual(res.status_code, 400)

    def test_06_csv_upload_bulk(self):
        csv_content = """report_id,report_type,site,date,activity,location,person_type,narrative,immediate_cause,contributing_factors,corrective_action
TEST-CSV-001,near_miss,Duliajan,2026-08-31,Confined Space Entry,Vessel V-1,Contractor,"Worker entered vessel without oxygen test.",Omitted test,None,Halted work
TEST-CSV-002,unsafe_act,Digboi,2026-08-31,Hot Work,Header,Contractor,"Hot work near gas header without spading.",No spade,Overdue inspection,Spaded header
"""
        files = {"file": ("test_reports.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
        res = self.client.post('/api/reports/upload-csv', files=files)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["processed"], 2)
        self.assertIn("results", data)

if __name__ == "__main__":
    unittest.main()
