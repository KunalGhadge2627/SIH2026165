from app.schemas.report import ReportInput
from app.engines.sif_engine import analyze_report, format_as_safety_report

test_cases = [
    {
        "text": "Worker leaning over edge without harness tie-off lanyard",
        "activity": "Work at Height",
        "location": "Scaffold 4 at 15m height",
        "site": "Moran",
        "metadata": {
            "immediate_causes": "Safety harness unclipped",
            "contributing_factors": "No guardrail installed",
            "corrective_actions": "Harness secured, work halted"
        }
    },
    {
        "text": "Roustabout standing inside winch cable tension path under crane boom",
        "activity": "Lifting Operations",
        "location": "Rig Site 12 Central Yard",
        "site": "Duliajan",
        "metadata": {
            "immediate_causes": "Standing inside line of fire",
            "contributing_factors": "No exclusion zone barricade",
            "corrective_actions": "Area evacuated and barricaded"
        }
    },
    {
        "text": "Welding initiated near gas header without fire watch or continuous gas tester",
        "activity": "Hot Work",
        "location": "Manifold GGS 2 Header",
        "site": "Digboi",
        "metadata": {
            "immediate_causes": "Gas tester instrument missing",
            "contributing_factors": "Hot work permit unapproved",
            "corrective_actions": "Welding stopped, gas check completed"
        }
    }
]

print("--- MULTI-INPUT NLP AI ENGINE VERIFICATION ---")
for tc in test_cases:
    rep = ReportInput(
        text=tc["text"],
        activity=tc["activity"],
        location=tc["location"],
        site=tc["site"],
        metadata=tc["metadata"]
    )
    res = analyze_report(rep)
    formatted = format_as_safety_report(rep, res)
    print(f"\n[INPUTS] Site: {formatted['site']} | Activity: {formatted['activity']} | Location: {formatted['location']}")
    print(f"[NARRATIVE]: '{formatted['description']}'")
    print(f" -> Mapped Life-Saving Rule: {formatted['life_saving_rules'][0]['rule']} ({formatted['life_saving_rules'][0]['confidence']}%)")
    print(f" -> Classification: {formatted['classification']} ({formatted['confidence']}%)")
    print(f" -> Risk Level: {formatted['risk_level']}")
    print(f" -> Explanation: {formatted['life_saving_rules'][0]['reason']}")
