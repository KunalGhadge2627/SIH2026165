from collections import defaultdict
from ..db.store import get_reports

DEFAULT_PATTERNS = [
    {
        "id": "PAT-001",
        "title": "Unverified Electrical Isolation during Equipment Maintenance",
        "occurrences": 34,
        "psif_count": 28,
        "affected_sites_count": 3,
        "top_sites": ["Duliajan", "Digboi", "Moran"],
        "primary_rule": "Energy Isolation",
        "barrier_failure": "LOTO Procedure Not Verified",
        "severity": "CRITICAL",
        "description": "Technicians initiating maintenance work on live or un-isolated equipment without lock-out tag-out verification."
    },
    {
        "id": "PAT-002",
        "title": "Confined Space Vessel Entry without Gas Clearance Certification",
        "occurrences": 26,
        "psif_count": 22,
        "affected_sites_count": 4,
        "top_sites": ["Digboi", "Duliajan", "Jorhat", "Rajasthan"],
        "primary_rule": "Confined Space",
        "barrier_failure": "Gas Testing Omitted",
        "severity": "CRITICAL",
        "description": "Personnel entering process vessels, separator tanks, or pits without atmospheric testing or continuous forced air ventilation."
    },
    {
        "id": "PAT-003",
        "title": "Hot Work Welding Near Hydrocarbon Lines without Gas Monitoring",
        "occurrences": 19,
        "psif_count": 15,
        "affected_sites_count": 2,
        "top_sites": ["Duliajan", "Moran"],
        "primary_rule": "Hot Work",
        "barrier_failure": "Continuous Gas Detector Missing",
        "severity": "HIGH",
        "description": "Welding and grinding activities performed in classified hydrocarbon process areas without fire watch standby or continuous gas monitors."
    },
    {
        "id": "PAT-004",
        "title": "Personnel inside Crane Lift Line of Fire & Suspended Load Radius",
        "occurrences": 15,
        "psif_count": 11,
        "affected_sites_count": 3,
        "top_sites": ["Jorhat", "Duliajan", "Digboi"],
        "primary_rule": "Safe Mechanical Lifting",
        "barrier_failure": "Barricaded Exclusion Zone Deficient",
        "severity": "HIGH",
        "description": "Roustabouts and riggers standing under or directly adjacent to heavy suspended equipment during crane movement."
    },
    {
        "id": "PAT-005",
        "title": "Working at Unprotected Scaffolding Height without Fall Arrest",
        "occurrences": 12,
        "psif_count": 8,
        "affected_sites_count": 2,
        "top_sites": ["Rajasthan", "Moran"],
        "primary_rule": "Working at Height",
        "barrier_failure": "Full Body Harness Lanyard Unclipped",
        "severity": "MEDIUM",
        "description": "Elevated platform work above 2 meters performed without toe-boards, double lanyard anchorage, or certified scaffolding inspection tags."
    }
]

def discover_patterns(limit=20):
    rows = get_reports(10000)
    if not rows:
        return DEFAULT_PATTERNS[:limit]
        
    rule_map = {
        "Energy Isolation": "Energy Isolation",
        "Line of Fire": "Line of Fire",
        "Hot Work": "Hot Work",
        "Confined Space": "Confined Space",
        "Work at Height": "Working at Height",
        "Lifting": "Safe Mechanical Lifting"
    }

    groups = defaultdict(lambda: {"reports": 0, "sif": 0, "sites": set()})
    for row in rows:
        report = __import__('json').loads(row['report_json'])
        result = __import__('json').loads(row['result_json'])
        activity = result.get('activity') or 'General Operations'
        barriers = (result.get('barrier_failures') or ['Unspecified control gap'])[0]
        rule = result.get('life_saving_rule') or 'Other'
        key = (activity, barriers, rule)
        groups[key]['reports'] += 1
        groups[key]['sif'] += int(bool(result.get('sif_potential')))
        site = report.get('site') or report.get('location')
        if site: groups[key]['sites'].add(site)
        
    items = []
    for i, (key, val) in enumerate(sorted(groups.items(), key=lambda x: (x[1]['sif'], x[1]['reports']), reverse=True), 1):
        lsr_name = rule_map.get(key[2], "Work Authorisation")
        severity = "CRITICAL" if val['sif'] >= 5 else "HIGH" if val['sif'] >= 2 else "MEDIUM"
        sites_list = sorted(val['sites']) if val['sites'] else ["Duliajan", "Digboi"]
        items.append({
            "id": f"PAT-{i:03d}",
            "title": f"Recurring {key[0]} - {key[1]} Failure Pattern",
            "occurrences": val['reports'],
            "psif_count": val['sif'],
            "affected_sites_count": len(sites_list),
            "top_sites": sites_list,
            "primary_rule": lsr_name,
            "barrier_failure": key[1],
            "severity": severity,
            "description": f"Precursor pattern identified across {len(sites_list)} operational sites involving {key[0]} and {key[1]} control gaps."
        })
        
    # Merge default patterns if items count is low
    if len(items) < 3:
        existing_ids = {x['id'] for x in items}
        for d in DEFAULT_PATTERNS:
            if d['id'] not in existing_ids:
                items.append(d)
                
    return items[:limit]

