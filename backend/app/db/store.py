import json, sqlite3
from pathlib import Path
from ..core.config import settings

DB_PATH = Path(settings.database_url.replace("sqlite:///", ""))

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
    from ..schemas.report import ReportInput
    from ..engines.sif_engine import analyze_report
    
    # 20 unique seed reports — each covers a distinct site, hazard scenario, and life-saving rule
    seed_data = [
        {
            "report_id": "OIL-INC-2026-00482",
            "report_type": "near_miss",
            "text": "Technician entered separator vessel V-201 for internal weld inspection without performing gas clearance test or establishing continuous forced draft ventilation. H2S detector alarm triggered at 15ppm shortly after entry.",
            "site": "Duliajan",
            "location": "Separator Station 4 - Vessel V-201",
            "activity": "Confined Space Entry"
        },
        {
            "report_id": "OIL-INC-2026-00391",
            "report_type": "unsafe_condition",
            "text": "High-pressure hydrocarbon line flange break was initiated on compressor station manifold V-402 before double block and bleed isolation was physically verified. Residual pressure at 14 bar remained when mechanic began unbolting.",
            "site": "Digboi",
            "location": "Compressor Station 3 - Line 4B",
            "activity": "Energy Isolation"
        },
        {
            "report_id": "OIL-INC-2026-00512",
            "report_type": "unsafe_act",
            "text": "Contractor welder continued grinding and arc welding at Tank Farm 12 crude oil separator drain area after the hot work permit had expired by 2 hours. Portable gas detector registered 12% LEL at the work location.",
            "site": "Naharkatia",
            "location": "Crude Oil Tank Farm 12",
            "activity": "Hot Work"
        },
        {
            "report_id": "OIL-INC-2026-00204",
            "report_type": "near_miss",
            "text": "A rigging sling with 4 visible broken wire strands was attached to a 4.2-ton blowout preventer component and hoisted over the active rig cellar floor. No taglines were used to control the suspended load.",
            "site": "Moran",
            "location": "Drilling Rig 7 Cellar Floor",
            "activity": "Mechanical Lifting"
        },
        {
            "report_id": "OIL-INC-2026-00188",
            "report_type": "unsafe_act",
            "text": "Instrument technician applied a physical wire jumper across the safety instrumented system relay on crude booster pump P-201A to bypass the high discharge pressure trip during commissioning. No management of change approval was obtained.",
            "site": "Jorhat",
            "location": "Pump House 2 - Booster Skid",
            "activity": "Plant Startup / Shutdown"
        },
        {
            "report_id": "OIL-NM-2026-01102",
            "report_type": "near_miss",
            "text": "Scaffold fitter observed working at 11 meters elevation on flare stack inspection platform without any fall arrest harness. The only available harness anchor point was more than 4 meters from the work position.",
            "site": "Lakhimpur",
            "location": "Flare Stack Structure - Level 3 Platform",
            "activity": "Working at Height"
        },
        {
            "report_id": "OIL-OBS-2026-01344",
            "report_type": "unsafe_condition",
            "text": "LV switchgear panel 6F at 415V found left open with live busbar fully accessible in an unmarked area. Metal shavings from adjacent drilling workshop were found inside the panel enclosure.",
            "site": "Shalmari",
            "location": "LV Switchgear Room - Panel 6F",
            "activity": "Electrical Work"
        },
        {
            "report_id": "OIL-OBS-2026-01287",
            "report_type": "unsafe_condition",
            "text": "Corrosion pit measuring 7mm deep on a 9.5mm wall thickness export crude trunk line at KM-14 discovered during inline inspection. Cathodic protection monitoring data had not been reviewed for 8 months.",
            "site": "Kumchai",
            "location": "Export Trunk Line KP-14",
            "activity": "Pipeline Maintenance"
        },
        {
            "report_id": "OIL-NM-2026-01421",
            "report_type": "near_miss",
            "text": "Drilling crew ran 9-5/8 inch casing without a stabbing guide during tripping-in at well pad D-12. The casing tilted at 25 degrees with the derrickman positioned directly below in the potential drop zone during night shift.",
            "site": "Duliajan",
            "location": "Well Pad D-12 Derrick Floor",
            "activity": "Drilling Operations"
        },
        {
            "report_id": "OIL-INC-2026-00156",
            "report_type": "incident",
            "text": "Wireline operator opened the swab valve on Well T-44 without confirming well shut-in pressure. Crude oil spray-out occurred causing minor face and arm burns to the operator. Oil spill estimated at 200 litres.",
            "site": "Digboi",
            "location": "Well T-44 Christmas Tree Assembly Area",
            "activity": "Well Testing & Servicing"
        },
        {
            "report_id": "OIL-OBS-2026-01188",
            "report_type": "unsafe_condition",
            "text": "Scaffold platform on separator column S-301 at 7.5 meters found missing mid-rail on the north face. Base plates were resting on soft mud without sole boards and 3 coupling clamps on vertical standards were loose.",
            "site": "Naharkatia",
            "location": "Separator S-301 Column Scaffold",
            "activity": "Scaffolding & Rigging"
        },
        {
            "report_id": "OIL-NM-2026-01056",
            "report_type": "near_miss",
            "text": "A 20-ton crude tanker truck travelling at 68 km/h on a rain-slicked access road at Moran GGS skidded at a blind bend and narrowly avoided a head-on collision with an oncoming OIL escort vehicle. Driver had been driving continuously for 14 hours.",
            "site": "Moran",
            "location": "Access Road 3 - Moran GGS Junction",
            "activity": "Driving"
        },
        {
            "report_id": "OIL-OBS-2026-01622",
            "report_type": "unsafe_condition",
            "text": "LOTO station at MCC room JP-3 on wellhead platform found with 4 out of 6 padlock hasps broken or missing. Maintenance personnel proceeding with ESP pump changeout could not enforce individual LOTO as required.",
            "site": "Jorhat",
            "location": "Wellhead Platform JP-3 MCC Room",
            "activity": "Energy Isolation"
        },
        {
            "report_id": "OIL-INC-2026-00088",
            "report_type": "incident",
            "text": "Overhead gantry crane hook block in workshop bay 4 dropped 2.4 meters after the rope drum end fastening bolt sheared. The crane had not been serviced for 22 months. Two technicians narrowly avoided being struck by the falling 1.8-ton load.",
            "site": "Lakhimpur",
            "location": "Workshop Bay 4 - Overhead Gantry Crane",
            "activity": "Mechanical Lifting"
        },
        {
            "report_id": "OIL-NM-2026-01789",
            "report_type": "near_miss",
            "text": "Contractor worker became semi-conscious after 11 minutes inside produced water pit chamber C-7 at Shalmari. H2S concentration measured at 22ppm post-recovery. The worker had silenced the gas detector alarm assuming it was a false positive before entry.",
            "site": "Shalmari",
            "location": "Produced Water Pit Chamber C-7",
            "activity": "Confined Space Entry"
        },
        {
            "report_id": "OIL-NM-2026-02012",
            "report_type": "near_miss",
            "text": "Condensate vapours briefly ignited at the drain leg of GGS-5 knock-out drum while grinding work was in progress on the bypass flange. The drain valve had been opened by operations 30 minutes earlier for sampling without informing the hot work supervisor.",
            "site": "Duliajan",
            "location": "GGS-5 Process Area - Condensate KO Drum",
            "activity": "Hot Work"
        },
        {
            "report_id": "OIL-INC-2026-00621",
            "report_type": "incident",
            "text": "Scaffold board fell from a 14.5 metre working platform during column C-112 scaffold maintenance at Digboi Refinery. The 2.4 metre plank was not secured with plank clips and was displaced by 28 km/h wind. A labourer below sustained soft tissue shoulder injury.",
            "site": "Digboi",
            "location": "Refinery Column C-112 Scaffold",
            "activity": "Scaffolding & Rigging"
        },
        {
            "report_id": "OIL-OBS-2026-02155",
            "report_type": "unsafe_act",
            "text": "Two electricians observed testing HV relay panel at field substation NHK-4 without arc flash PPE. The panel is rated for 40 cal/cm2 minimum arc flash protection. Arc flash PPE was unavailable at the remote substation location.",
            "site": "Naharkatia",
            "location": "Field Substation NHK-4 - HV Panel Room",
            "activity": "Electrical Work"
        },
        {
            "report_id": "OIL-NM-2026-02287",
            "report_type": "near_miss",
            "text": "HSE officer discovered during random inspection that the rescue tripod and retrieval winch for slug catcher SC-201 confined space entry were positioned 800 metres away at a different job site while the entry operation was actively in progress.",
            "site": "Moran",
            "location": "Slug Catcher SC-201 Liquid Compartment",
            "activity": "Confined Space Entry"
        },
        {
            "report_id": "OIL-NM-2026-02609",
            "report_type": "near_miss",
            "text": "Well test flow rate surged uncontrolled from 1200 to 6800 barrels per day at well KM-09 after a contractor technician installed the wrong choke size during the test. Flare pit capacity was overwhelmed and burning crude escaped the pit boundary igniting perimeter dry grass.",
            "site": "Kumchai",
            "location": "Well Test Flare Pit KM-09",
            "activity": "Well Testing & Servicing"
        }
    ]
    
    for item in seed_data:
        try:
            rep = ReportInput(**item)
            res = analyze_report(rep)
            save_analysis(rep, res)
        except Exception as e:
            print(f"[store] Seed failed for {item.get('report_id', '?')}: {e}")

def save_analysis(report, result):
    with connect() as c:
        c.execute("INSERT OR REPLACE INTO reports VALUES (?, ?, ?, ?)", (result.report_id, json.dumps(report.model_dump(mode='json')), json.dumps(result.model_dump(mode='json')), result.analyzed_at.isoformat()))
        c.commit()

def get_reports(limit=100):
    with connect() as c:
        return [dict(r) for r in c.execute("SELECT * FROM reports ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()]
