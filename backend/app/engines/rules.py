import re
from dataclasses import dataclass

@dataclass(frozen=True)
class RuleDefinition:
    name: str
    keywords: tuple[str, ...]
    hazards: tuple[str, ...]
    precursors: tuple[str, ...]
    barriers: tuple[str, ...]
    weight: float

RULES = [
    RuleDefinition(
        "Confined Space",
        ("confined space", "confined", "vessel", "tank", "manhole", "oxygen", "gas clearance", "toxic", "gas test", "entry permit", "h2s", "atmosphere", "ventilated", "vessel entry", "tank entry"),
        ("Toxic atmosphere", "Oxygen deficiency", "Hazardous gas accumulation"),
        ("Personnel entering restricted space", "Atmospheric hazard exposure", "Unverified gas clearance"),
        ("Gas clearance testing failure", "Entry permit protocol failure", "Attendant / standby failure"),
        1.35
    ),
    RuleDefinition(
        "Energy Isolation",
        ("isolation", "isolated", "lockout", "tagout", "loto", "energized", "electrical", "stored energy", "pressure", "live line", "breaker", "switchgear", "voltage", "padlock", "feeder"),
        ("Electrical energy", "Stored mechanical energy", "High pressure release"),
        ("Uncontrolled hazardous energy", "Maintenance on live equipment", "LOTO bypass"),
        ("Energy isolation verification failure", "Lockout/tagout control failure", "Spade / blind isolation missing"),
        1.35
    ),
    RuleDefinition(
        "Hot Work",
        ("hot work", "welding", "grinding", "cutting", "spark", "ignition", "flammable", "gas tester", "fire watch", "hydrocarbon", "manifold", "header", "combustible"),
        ("Fire hazard", "Flammable gas ignition", "Explosive atmosphere"),
        ("Ignition source near flammables", "Unmonitored hot work area", "Missing fire watch"),
        ("Hot work permit failure", "Continuous gas testing failure", "Fire watch standby missing"),
        1.30
    ),
    RuleDefinition(
        "Work at Height",
        ("work at height", "working at height", "height", "scaffold", "scaffolding", "ladder", "fall", "roof", "platform", "elevated", "harness", "lanyard", "toe-board", "guardrail", "fall arrest", "fall protection"),
        ("Fall from height", "Dropped objects from elevated structure"),
        ("Unprotected elevated work edge", "Unclipped safety harness", "Substandard scaffolding"),
        ("Fall protection tie-off failure", "Scaffolding tag/inspection failure", "Toe-board / guardrail missing"),
        1.25
    ),
    RuleDefinition(
        "Lifting",
        ("lifting", "crane", "rigging", "sling", "suspended load", "suspended", "load", "swing radius", "tagline", "winch", "rigging tackle", "wire rope", "crane operator"),
        ("Suspended load drop", "Struck by moving heavy load"),
        ("Person under suspended load", "Overloaded lifting tackle", "Unbarricaded lift radius"),
        ("Lifting plan protocol failure", "Exclusion zone barricading failure", "Rigging tackle inspection failure"),
        1.25
    ),
    RuleDefinition(
        "Line of Fire",
        ("line of fire", "struck by", "caught between", "pinch point", "moving equipment", "vehicle movement", "danger zone", "tension path", "winch cable", "snapped"),
        ("Moving machinery impact", "High tension cable snap", "Struck-by moving object"),
        ("Person in machinery danger zone", "Tension line exposure", "Uncontrolled vehicle movement"),
        ("Barricading / exclusion zone failure", "Machine guarding failure", "Spotter communication gap"),
        1.25
    ),
    RuleDefinition(
        "Bypassing Safety Controls",
        ("bypass", "bypassed", "jumpered", "interlock", "disabled", "tampered", "override", "overridden", "safety trip", "relay"),
        ("Unprotected process operation", "Safety instrument failure"),
        ("Bypassed safety interlock", "Unapproved trip override"),
        ("Management of Change (MOC) failure", "Safety device integrity failure"),
        1.20
    ),
    RuleDefinition(
        "Work Authorisation",
        ("permit", "ptw", "work authorization", "unauthorized", "no permit", "permit missing", "clearance certificate"),
        ("Uncontrolled work activity", "Unapproved hazardous job"),
        ("Work started without approved permit", "Expired work permit"),
        ("Work permit approval gap", "Pre-job safety assessment missing"),
        1.15
    )
]

SIF_AMPLIFIERS = (
    "serious injury", "fatal", "fatality", "death", "life threatening", "high potential",
    "potential fatal", "could have killed", "could result in fatality", "severe injury",
    "confined", "vessel", "oxygen", "toxic", "h2s", "gas", "loto", "energized", "live line",
    "high pressure", "scaffold", "height", "fall", "suspended load", "crane", "welding",
    "flammable", "hydrocarbon", "explosion", "without gas", "without verifying", "without permit",
    "no permit", "omitted", "missing", "expired", "bypassed", "unisolated"
)

GENERAL_SIGNALS = (
    "no permit", "permit missing", "procedure not followed", "barrier failed", "barrier missing",
    "barricade missing", "ppe missing", "unsafe position", "unauthorized", "bypassed",
    "without verifying", "without testing", "without checking", "omitted", "expired",
    "failed", "missing", "untested", "unchecked", "without"
)

def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()

def score_rule(text: str, rule: RuleDefinition, user_activity: str | None = None):
    t = normalize(text)
    hits = [k for k in rule.keywords if k in t]
    
    activity_boost = 0.0
    if user_activity:
        u_act = normalize(user_activity)
        rule_lower = rule.name.lower()
        if rule_lower in u_act or any(k in u_act for k in rule.keywords[:4]):
            activity_boost = 0.45
            hits.insert(0, f"Selected Activity: {user_activity}")
            
    if not hits:
        return 0.0, []
        
    raw_score = min(1.0, max(0.55, len(hits) * 0.30 + activity_boost) * rule.weight)
    return raw_score, hits

def analyze_rules(text: str, user_activity: str | None = None):
    results = [(score_rule(text, r, user_activity=user_activity), r) for r in RULES]
    results.sort(key=lambda x: x[0][0], reverse=True)
    return results


