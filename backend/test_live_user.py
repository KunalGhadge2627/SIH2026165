import urllib.request
import json

url = "http://127.0.0.1:8000/api/reports/analyze"
payload = {
    "report_type": "near_miss",
    "text": "Worker entered confined space vessel without verifying oxygen levels or gas clearance certificate.",
    "site": "Moran",
    "location": "Process Vessel V-304",
    "activity": "Plant Startup / Shutdown"
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print("\n--- LIVE API OUTPUT FOR USER SCREENSHOT INPUT ---")
        print("Report ID:", res["safety_report"]["report_id"])
        print("Classification:", res["safety_report"]["classification"])
        print("PSIF Probability:", res["safety_report"]["p_sif"], f"({res['safety_report']['confidence']}%)")
        print("Mapped Life-Saving Rule:", res["safety_report"]["life_saving_rules"][0]["rule"])
        print("Risk Level:", res["safety_report"]["risk_level"])
        print("Explanation:", res["safety_report"]["life_saving_rules"][0]["reason"])
except Exception as e:
    print("Error:", e)
