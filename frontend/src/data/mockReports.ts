import { SafetyReport, LifeSavingRuleName, RiskLevel, ReportType, ReviewStatus } from '../types/safety';

export const OIL_SITES = [
  'Duliajan',
  'Digboi',
  'Naharkatia',
  'Moran',
  'Jorhat',
  'Lakhimpur',
  'Shalmari',
  'Kumchai'
];

export const ACTIVITIES = [
  'Confined Space Entry',
  'Hot Work',
  'Mechanical Lifting',
  'Energy Isolation',
  'Pipeline Maintenance',
  'Electrical Work',
  'Drilling Operations',
  'Plant Startup / Shutdown',
  'Scaffolding & Rigging',
  'Well Testing & Servicing'
];

// 30 completely unique, realistic OIL India HSE safety reports
// Each has distinct narrative, location, hazard, barriers, and risk level
export const MOCK_SAFETY_REPORTS: SafetyReport[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00482',
    report_type: 'Near Miss',
    site: 'Duliajan',
    date: '2026-08-28',
    activity: 'Confined Space Entry',
    location: 'Process Vessel V-102 (Desalter Unit)',
    contractor_type: 'Contractor',
    description: 'During maintenance activity, a worker entered a confined space before gas testing was completed and without an attendant present at the manway.',
    immediate_causes: 'Worker proceeded into vessel entry port without waiting for certified HSE gas technician verification tag.',
    contributing_factors: 'Inadequate pre-task planning, shift changeover communication gap, and missing entry barrier tape.',
    corrective_actions: 'Work stopped immediately. Confined space entry permit revoked. Site safety stand-down conducted for process crew.',
    p_sif: 0.947,
    classification: 'PSIF Potential',
    confidence: 94.7,
    life_saving_rules: [
      { rule: 'Confined Space', confidence: 97.0, reason: 'Confined space entry detected with missing gas testing and attendant control.' },
      { rule: 'Work Authorisation', confidence: 84.2, reason: 'Entry proceeded prior to valid permit sign-off and gas test tag issuance.' }
    ],
    precursors: {
      activity: 'Confined Space Entry',
      location: 'Process Vessel V-102',
      energy_sources: ['Toxic Gas (H2S)', 'Flammable Hydrocarbons', 'Atmospheric Nitrogen'],
      barrier_failures: ['No Gas Test', 'No Standby Attendant', 'Unsealed Manway'],
      human_factors: ['Inadequate Pre-task Planning', 'Perceived Schedule Pressure'],
      organizational_factors: ['Departure from Routine', 'Handover Communication Gap']
    },
    highlighted_phrases: [
      { text: 'entered a confined space', category: 'Activity', note: 'High-risk activity: vessel entry' },
      { text: 'before gas testing was completed', category: 'Barrier Failure', note: 'Critical barrier failure: zero atmospheric verification' },
      { text: 'without an attendant present', category: 'Control Failure', note: 'Control failure: missing mandatory standby rescue attendant' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00391',
    report_type: 'Near Miss',
    site: 'Digboi',
    date: '2026-08-26',
    activity: 'Energy Isolation',
    location: 'Compressor Station #3 - Line 4B',
    contractor_type: 'OIL Staff',
    description: 'High-pressure hydrocarbon line flange break initiated without verifying double block and bleed energy isolation on manifold V-402. Residual pressure remained at 14 bar.',
    immediate_causes: 'Maintenance technician relied on verbal confirmation instead of physical zero-energy check bleed valve open test.',
    contributing_factors: 'LOTO tag fell off manifold valve. Missing blind plate specification on work permit.',
    corrective_actions: 'Line re-isolated, zero pressure confirmed. LOTO audit issued across Compressor Station #3.',
    p_sif: 0.912,
    classification: 'PSIF Potential',
    confidence: 91.2,
    life_saving_rules: [
      { rule: 'Energy Isolation', confidence: 96.5, reason: 'Flange break initiated on energized pressurized hydrocarbon pipeline.' },
      { rule: 'Work Authorisation', confidence: 79.1, reason: 'Verification checklist incomplete prior to line break.' }
    ],
    precursors: {
      activity: 'Energy Isolation & Flange Breaking',
      location: 'Compressor Station #3',
      energy_sources: ['High Pressure Gas (14 bar)', 'Flammable Condensate'],
      barrier_failures: ['Isolation Not Verified', 'No Zero-Energy Check', 'LOTO Lock Missing'],
      human_factors: ['Complacency', 'Verbal Confirmation Reliance'],
      organizational_factors: ['LOTO Tag Durability Issue', 'Permit Audit Gap']
    },
    highlighted_phrases: [
      { text: 'flange break initiated', category: 'Activity', note: 'Line breaking activity on live hydrocarbon system' },
      { text: 'without verifying double block and bleed energy isolation', category: 'Barrier Failure', note: 'Primary isolation barrier not verified' },
      { text: 'Residual pressure remained at 14 bar', category: 'High Energy', note: 'Severe high-energy pressure hazard present' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00512',
    report_type: 'Unsafe Act (UA)',
    site: 'Naharkatia',
    date: '2026-08-27',
    activity: 'Hot Work',
    location: 'Crude Oil Tank Farm 12',
    contractor_type: 'Contractor',
    description: 'Welding sparks observed near crude oil separator drain valve where portable gas detector registered 12% LEL reading. Hot work permit was expired by 2 hours.',
    immediate_causes: 'Contractor welder continued grinding and arc welding after morning permit validity period expired.',
    contributing_factors: 'Continuous gas monitor battery died and was not replaced by safety watcher.',
    corrective_actions: 'Hot work stopped immediately. Gas testing re-conducted, area ventilated, welder re-trained on permit rules.',
    p_sif: 0.885,
    classification: 'PSIF Potential',
    confidence: 88.5,
    life_saving_rules: [
      { rule: 'Hot Work', confidence: 95.8, reason: 'Arc welding in hydrocarbon zone with 12% LEL gas presence.' },
      { rule: 'Bypassing Safety Controls', confidence: 82.0, reason: 'Continued work with dead continuous gas monitor.' }
    ],
    precursors: {
      activity: 'Grinding & Arc Welding',
      location: 'Tank Farm 12 Separator Area',
      energy_sources: ['Flammable Vapor (12% LEL)', 'Welding Arc / Sparks'],
      barrier_failures: ['Expired Hot Work Permit', 'Unmonitored LEL Atmosphere', 'Inadequate Fire Watch'],
      human_factors: ['Time Pressure', 'Lack of Vigilance'],
      organizational_factors: ['Equipment Battery Maintenance', 'Contractor Supervision Gap']
    },
    highlighted_phrases: [
      { text: 'Welding sparks observed near crude oil separator drain', category: 'Activity', note: 'Ignition source introduced near fuel source' },
      { text: '12% LEL reading', category: 'High Energy', note: 'Flammable gas concentration above safe hot work threshold' },
      { text: 'permit was expired by 2 hours', category: 'Control Failure', note: 'Un-authorized hot work window' }
    ],
    risk_level: 'HIGH',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00204',
    report_type: 'Near Miss',
    site: 'Moran',
    date: '2026-08-25',
    activity: 'Mechanical Lifting',
    location: 'Drilling Rig #7 Floor',
    contractor_type: 'OIL Staff',
    description: 'Rigging sling with 4 visible broken wire strands was used to hoist a 4.2-ton blowout preventer (BOP) component over active rig cellar floor without taglines.',
    immediate_causes: 'Rigger failed to perform pre-use sling inspection prior to hooking load.',
    contributing_factors: 'Sling storage rack exposed to weather causing corrosion; lift area barricade not extended to cellar floor.',
    corrective_actions: 'Load lowered safely. Damaged sling destroyed on site. Rigging gear audit ordered across all active rigs.',
    p_sif: 0.961,
    classification: 'PSIF Potential',
    confidence: 96.1,
    life_saving_rules: [
      { rule: 'Safe Mechanical Lifting', confidence: 98.2, reason: 'Damaged rigging gear used to lift heavy 4.2-ton overhead load.' },
      { rule: 'Line of Fire', confidence: 91.0, reason: 'Personnel working in cellar floor under un-tagged suspended load.' }
    ],
    precursors: {
      activity: 'Heavy Crane Lifting (4.2T)',
      location: 'Rig #7 Cellar Floor',
      energy_sources: ['Suspended Heavy Load (4.2 Tons)', 'Potential Gravitational Drop'],
      barrier_failures: ['Damaged Rigging Tackle', 'No Pre-lift Inspection', 'Missing Taglines'],
      human_factors: ['Routine Habituation', 'Inadequate Rigging Check'],
      organizational_factors: ['Rigging Inspection Tracking', 'Tool Storage Quality']
    },
    highlighted_phrases: [
      { text: '4 visible broken wire strands', category: 'Barrier Failure', note: 'Severe rigging tackle degradation' },
      { text: 'hoist a 4.2-ton blowout preventer', category: 'High Energy', note: 'Extremely high gravitational energy load' },
      { text: 'without taglines', category: 'Control Failure', note: 'Missing load control tagline barrier' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Confirmed PSIF',
    hse_feedback: {
      confirmed_by: 'M. K. Sharma (Senior HSE Specialist)',
      confirmed_at: '2026-08-25 14:30',
      comment: 'Confirmed critical SIF potential. Rigging tackle failure under 4.2T load could cause fatal drop incident.',
      decision: 'Confirmed PSIF'
    }
  },

  // ─── 5 ───────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00188',
    report_type: 'Unsafe Act (UA)',
    site: 'Jorhat',
    date: '2026-08-23',
    activity: 'Plant Startup / Shutdown',
    location: 'Pump House #2 - Booster Skid',
    contractor_type: 'OIL Staff',
    description: 'Instrument technician jumpered out high-discharge pressure trip interlock on crude booster pump P-201A during commissioning to bypass recurring false vibration trips.',
    immediate_causes: 'Technician applied physical wire jumper across safety instrumented system (SIS) relay without MOC.',
    contributing_factors: 'Pressure transmitter calibration overdue; urgency to meet daily oil pumping target.',
    corrective_actions: 'Jumper removed immediately. Pump shutdown. Formal MOC and instrument calibration completed.',
    p_sif: 0.924,
    classification: 'PSIF Potential',
    confidence: 92.4,
    life_saving_rules: [
      { rule: 'Bypassing Safety Controls', confidence: 97.4, reason: 'Physical jumper applied to critical safety instrumented system interlock.' },
      { rule: 'Work Authorisation', confidence: 85.5, reason: 'Safety override conducted without formal MOC or shift log approval.' }
    ],
    precursors: {
      activity: 'Interlock Override & Pump Trial',
      location: 'Pump House #2',
      energy_sources: ['High Pressure Crude Oil', 'Electrical Control Circuit'],
      barrier_failures: ['Safety Interlock Bypassed', 'No MOC Approval', 'Sensor Uncalibrated'],
      human_factors: ['Shortcut Taking', 'Production Pressure'],
      organizational_factors: ['Overdue Calibration Backlog', 'Override Logging Enforcement']
    },
    highlighted_phrases: [
      { text: 'jumpered out high-discharge pressure trip interlock', category: 'Barrier Failure', note: 'Direct override of critical safety barrier' },
      { text: 'without MOC', category: 'Control Failure', note: 'Unauthorized modification without Management of Change review' },
      { text: 'crude booster pump P-201A', category: 'High Energy', note: 'High pressure liquid hydrocarbon pumping system' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 6 ───────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-NM-2026-01102',
    report_type: 'Near Miss',
    site: 'Lakhimpur',
    date: '2026-08-20',
    activity: 'Working at Height',
    location: 'Flare Stack Structure - Level 3 Platform (11m)',
    contractor_type: 'Contractor',
    description: 'Scaffold fitter was observed working at 11m elevation on flare stack inspection platform without wearing fall arrest harness. A 6m drop zone existed below without edge netting.',
    immediate_causes: 'Fitter stated the harness anchor point was too far from the work area and he chose to work without it.',
    contributing_factors: 'Inadequate anchor point spacing on ageing scaffold structure; supervisor not physically present during task.',
    corrective_actions: 'Worker immediately secured. Rescue protocol reviewed. Extra anchor rings welded to platform structure.',
    p_sif: 0.876,
    classification: 'PSIF Potential',
    confidence: 87.6,
    life_saving_rules: [
      { rule: 'Working at Height', confidence: 96.0, reason: 'Personnel detected working 11m above ground level without fall protection.' },
      { rule: 'Line of Fire', confidence: 72.0, reason: 'Unprotected fall exposure zone directly below active work area.' }
    ],
    precursors: {
      activity: 'Scaffold Inspection at Height',
      location: 'Flare Stack Level 3',
      energy_sources: ['Gravitational Potential (11m Drop)'],
      barrier_failures: ['No Fall Arrest Harness', 'No Edge Safety Net', 'Anchor Point Gap'],
      human_factors: ['Risk Normalization', 'Convenience Shortcut'],
      organizational_factors: ['Scaffold Design Gap', 'Supervisor Absence']
    },
    highlighted_phrases: [
      { text: 'without wearing fall arrest harness', category: 'Barrier Failure', note: 'Critical fall protection barrier absent' },
      { text: '11m elevation', category: 'High Energy', note: 'Extreme gravitational energy exposure height' },
      { text: '6m drop zone below without edge netting', category: 'Control Failure', note: 'Secondary catch barrier missing' }
    ],
    risk_level: 'HIGH',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 7 ───────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-01344',
    report_type: 'Unsafe Condition (UC)',
    site: 'Shalmari',
    date: '2026-08-18',
    activity: 'Electrical Work',
    location: 'LV Switchgear Room - Panel 6F',
    contractor_type: 'OIL Staff',
    description: 'LV panel 6F door left open with live 415V busbar exposed in an unmarked area. Multiple housekeeping items including metal shavings were found inside the panel enclosure.',
    immediate_causes: 'Electrician completed cable termination work and left the panel open while attending to a phone call.',
    contributing_factors: 'No clear isolation zone marking around open panel. Metal debris from adjacent drilling workshop entered the switchgear room.',
    corrective_actions: 'Panel closed and secured. Hazard notification issued. Switchgear room access restricted to authorized personnel only.',
    p_sif: 0.743,
    classification: 'PSIF Potential',
    confidence: 74.3,
    life_saving_rules: [
      { rule: 'Energy Isolation', confidence: 88.0, reason: 'Live 415V busbar accessible without isolation barrier.' },
      { rule: 'Work Authorisation', confidence: 66.5, reason: 'Panel left unattended during live work without permit sign-off.' }
    ],
    precursors: {
      activity: 'LV Panel Cable Termination',
      location: 'LV Switchgear Room 6F',
      energy_sources: ['Live 415V AC Electrical Energy', 'Arc Flash Potential'],
      barrier_failures: ['Exposed Live Busbar', 'No Isolation Warning Tape', 'Conductive Debris in Panel'],
      human_factors: ['Task Interruption', 'Distraction by Phone'],
      organizational_factors: ['Housekeeping Control', 'Workshop Debris Segregation']
    },
    highlighted_phrases: [
      { text: 'live 415V busbar exposed', category: 'High Energy', note: 'Lethal electrical energy exposure' },
      { text: 'metal shavings inside the panel', category: 'Barrier Failure', note: 'Conductive material creating arc flash path' },
      { text: 'left the panel open', category: 'Control Failure', note: 'Panel enclosure isolation barrier removed' }
    ],
    risk_level: 'HIGH',
    review_status: 'Rejected PSIF'
  },

  // ─── 8 ───────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-01287',
    report_type: 'Unsafe Condition (UC)',
    site: 'Kumchai',
    date: '2026-08-16',
    activity: 'Pipeline Maintenance',
    location: 'Export Trunk Line KP-14 Section',
    contractor_type: 'Contractor',
    description: 'Corrosion pit measuring 7mm deep (wall thickness 9.5mm) discovered on export crude trunk line during inline inspection. CP monitoring data was not reviewed for 8 months.',
    immediate_causes: 'No scheduled cathodic protection inspection walkdown completed as per maintenance plan Q2 2026.',
    contributing_factors: 'Maintenance technician workload reassignment led to CP monitoring activities being deprioritized.',
    corrective_actions: 'Affected pipe section isolated and bypassed. Emergency repair clamp installed. Full CP survey initiated.',
    p_sif: 0.521,
    classification: 'PSIF Potential',
    confidence: 52.1,
    life_saving_rules: [
      { rule: 'Work Authorisation', confidence: 61.0, reason: 'Maintenance activity gap indicates systemic authorization gap in maintenance planning.' }
    ],
    precursors: {
      activity: 'Inline Pipeline Inspection',
      location: 'Trunk Line KP-14',
      energy_sources: ['High Pressure Crude Oil (48 bar)', 'Pipe Wall Thinning'],
      barrier_failures: ['Corrosion Monitoring Lapse', 'Maintenance Schedule Gap'],
      human_factors: ['Workload Reallocation', 'Complacency in Scheduling'],
      organizational_factors: ['Preventive Maintenance Backlog', 'CP Survey Program Adherence']
    },
    highlighted_phrases: [
      { text: '7mm deep corrosion pit', category: 'High Energy', note: 'Severe wall loss approaching failure threshold' },
      { text: 'CP monitoring data not reviewed for 8 months', category: 'Barrier Failure', note: 'Long-term monitoring barrier failure' }
    ],
    risk_level: 'MEDIUM',
    review_status: 'Confirmed PSIF',
    hse_feedback: {
      confirmed_by: 'B. N. Gogoi (Pipeline Integrity Lead)',
      confirmed_at: '2026-08-17 09:15',
      comment: 'Pipeline wall at 74% consumed. Potential rupture if undetected. Confirmed PSIF category.',
      decision: 'Confirmed PSIF'
    }
  },

  // ─── 9 ───────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-NM-2026-01421',
    report_type: 'Near Miss',
    site: 'Duliajan',
    date: '2026-08-15',
    activity: 'Drilling Operations',
    location: 'Well Pad D-12 (Appraisal Drilling Campaign)',
    contractor_type: 'Contractor',
    description: 'Drilling crew made up 9-5/8" casing without stabbing guide during tripping-in operation. A slip and drop nearly occurred when the casing tilted at 25° angle with derrickman in fall zone.',
    immediate_causes: 'Stabbing guide left behind at previous well pad. Driller proceeded without requesting replacement.',
    contributing_factors: 'Night shift fatigue due to back-to-back 12-hour shifts. Inadequate pre-job meeting for casing running procedure.',
    corrective_actions: 'Tripping operation halted. Tool transfer organized. Mandatory rest before restart. Pre-job meeting SOP enforced.',
    p_sif: 0.897,
    classification: 'PSIF Potential',
    confidence: 89.7,
    life_saving_rules: [
      { rule: 'Line of Fire', confidence: 93.5, reason: 'Derrickman positioned in drop zone of unstable casing during tripping.' },
      { rule: 'Safe Mechanical Lifting', confidence: 88.0, reason: 'Unsupported heavy tubular near tipping instability.' }
    ],
    precursors: {
      activity: 'Casing Running (9-5/8")',
      location: 'Well Pad D-12 Derrick Floor',
      energy_sources: ['Suspended Casing String Weight', 'Unstable Angular Load'],
      barrier_failures: ['Missing Stabbing Guide', 'No Secondary Restraint', 'Derrickman in Drop Zone'],
      human_factors: ['Fatigue (Night Shift)', 'Complacency in Tool Tracking'],
      organizational_factors: ['Pre-job Meeting Compliance', 'Tool Logistics Between Pads']
    },
    highlighted_phrases: [
      { text: 'without stabbing guide', category: 'Barrier Failure', note: 'Directional control tool absent during critical casing operation' },
      { text: 'derrickman in fall zone', category: 'Line of Fire', note: 'Personnel in gravity energy release zone' },
      { text: 'Night shift fatigue', category: 'Human Factor', note: 'Fatigue degraded situational awareness' }
    ],
    risk_level: 'HIGH',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 10 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00156',
    report_type: 'Incident',
    site: 'Digboi',
    date: '2026-08-12',
    activity: 'Well Testing & Servicing',
    location: 'Well T-44 Christmas Tree Assembly Area',
    contractor_type: 'Contractor',
    description: 'Crude oil spray-out occurred when a wireline operator opened the swab valve without confirming well shut-in pressure. Operator sustained minor face and arm burns. Oil spill estimated at 200 liters.',
    immediate_causes: 'Operator opened swab valve without checking pressure gauge — gauge face was obscured by mud splash from previous operation.',
    contributing_factors: 'No pressure verification step included in wire line job SSHE checklist. Chemical resistant PPE not worn.',
    corrective_actions: 'Well shut in, spill contained with absorbent pads. Operator received first aid. Wireline SSHE checklist updated with mandatory pressure verification step.',
    p_sif: 0.831,
    classification: 'PSIF Potential',
    confidence: 83.1,
    life_saving_rules: [
      { rule: 'Line of Fire', confidence: 91.2, reason: 'Operator directly in path of high-pressure spray release from swab valve.' },
      { rule: 'Work Authorisation', confidence: 76.0, reason: 'SSHE job checklist did not include pressure confirmation step.' }
    ],
    precursors: {
      activity: 'Wireline Swab Valve Operation',
      location: 'Well T-44 Christmas Tree',
      energy_sources: ['Well Reservoir Pressure', 'Crude Oil Spray Kinetic Energy'],
      barrier_failures: ['No Pre-open Pressure Check', 'Obstructed Pressure Gauge', 'Inadequate PPE'],
      human_factors: ['Assumption of Safe Condition', 'Poor Instrument Visibility'],
      organizational_factors: ['Checklist Completeness Review', 'PPE Selection for Well Operations']
    },
    highlighted_phrases: [
      { text: 'opened the swab valve without confirming well shut-in pressure', category: 'Barrier Failure', note: 'Pre-task verification step skipped' },
      { text: 'gauge face was obscured by mud', category: 'Barrier Failure', note: 'Safety instrument rendered unreadable' },
      { text: 'minor face and arm burns', category: 'Consequence', note: 'Personnel injury — recordable incident' }
    ],
    risk_level: 'HIGH',
    review_status: 'Under Investigation'
  },

  // ─── 11 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-01188',
    report_type: 'Unsafe Condition (UC)',
    site: 'Naharkatia',
    date: '2026-08-10',
    activity: 'Scaffolding & Rigging',
    location: 'Separator S-301 Column Scaffold (7.5m)',
    contractor_type: 'Contractor',
    description: 'Scaffold platform at 7.5m missing mid-rail on north face, with base plates resting directly on soft mud without sole boards. Inspector found 3 loose coupling clamps on main vertical standards.',
    immediate_causes: 'Scaffold was erected by unskilled laborers without supervision from certified scaffold inspector.',
    contributing_factors: 'Certified scaffolder called off due to illness; contractor deployed substitute without verifying competency.',
    corrective_actions: 'Platform use prohibited. Full dismantling and re-erection by certified scaffolders ordered.',
    p_sif: 0.782,
    classification: 'PSIF Potential',
    confidence: 78.2,
    life_saving_rules: [
      { rule: 'Working at Height', confidence: 92.0, reason: 'Structurally compromised scaffold at 7.5m with missing safety rails.' }
    ],
    precursors: {
      activity: 'Scaffold Erection at Height',
      location: 'Column S-301 North Face',
      energy_sources: ['Gravitational Energy (7.5m Drop)', 'Scaffold Collapse Potential'],
      barrier_failures: ['Missing Mid-rail', 'No Sole Boards', 'Loose Couplings', 'No Certified Inspector'],
      human_factors: ['Competency Gap', 'Workforce Substitution Without Verification'],
      organizational_factors: ['Contractor Competency Assurance', 'Scaffold Inspection Program']
    },
    highlighted_phrases: [
      { text: 'missing mid-rail on north face', category: 'Barrier Failure', note: 'Fall prevention rail absent' },
      { text: 'base plates resting on soft mud without sole boards', category: 'Barrier Failure', note: 'Foundation instability risk' },
      { text: 'erected by unskilled laborers without supervision', category: 'Control Failure', note: 'Competency and oversight gap' }
    ],
    risk_level: 'HIGH',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 12 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-NM-2026-01056',
    report_type: 'Near Miss',
    site: 'Moran',
    date: '2026-08-08',
    activity: 'Driving',
    location: 'Access Road 3 - Moran GGS Junction',
    contractor_type: 'Contractor',
    description: 'A 20-ton crude tanker truck travelling at 68 km/h (site limit 30 km/h) on a rain-slicked access road skidded at a blind bend and narrowly missed a head-on collision with an oncoming OIL escort vehicle.',
    immediate_causes: 'Driver admitted he had been on continuous driving duty for 14 hours without rest break.',
    contributing_factors: 'Journey management plan not completed by contractor. Truck speedometer recently repaired and potentially uncalibrated.',
    corrective_actions: 'Driver suspended. Fitness-for-duty checks reinstated. Journey management plan made mandatory for all HV contractors.',
    p_sif: 0.934,
    classification: 'PSIF Potential',
    confidence: 93.4,
    life_saving_rules: [
      { rule: 'Driving', confidence: 97.0, reason: 'Heavy vehicle over twice the speed limit with fatigued driver on hazardous road.' }
    ],
    precursors: {
      activity: 'Heavy Vehicle Road Transport',
      location: 'Access Road 3 Blind Bend',
      energy_sources: ['Kinetic Energy (20T @ 68 km/h)', 'Head-on Collision Potential'],
      barrier_failures: ['Journey Management Plan Not Done', 'Speed Limit Non-Compliance', 'Driver Fatigue'],
      human_factors: ['14-Hour Continuous Driving', 'Fatigue'],
      organizational_factors: ['Contractor Fitness-for-Duty Enforcement', 'Journey Management Compliance']
    },
    highlighted_phrases: [
      { text: '68 km/h (site limit 30 km/h)', category: 'High Energy', note: 'More than double posted speed limit' },
      { text: '14 hours without rest break', category: 'Human Factor', note: 'Severe driver fatigue condition' },
      { text: 'narrowly missed a head-on collision', category: 'Consequence', note: 'Near-fatal consequence avoided' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Confirmed PSIF',
    hse_feedback: {
      confirmed_by: 'S. K. Bora (Transport Safety Lead)',
      confirmed_at: '2026-08-09 08:00',
      comment: 'Fatigue + excessive speed on wet road = confirmed SIF potential. Systemic contractor JMP enforcement required.',
      decision: 'Confirmed PSIF'
    }
  },

  // ─── 13 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-01622',
    report_type: 'Unsafe Condition (UC)',
    site: 'Jorhat',
    date: '2026-08-06',
    activity: 'Energy Isolation',
    location: 'Wellhead Platform JP-3 MCC Room',
    contractor_type: 'OIL Staff',
    description: 'LOTO station at MCC Room JP-3 found with 4 out of 6 padlock hasps broken or missing. Maintenance personnel were unable to enforce per-person LOTO for planned ESP pump changeout.',
    immediate_causes: 'LOTO hasps not replaced after previous maintenance campaign. Spares not requisitioned from store.',
    contributing_factors: 'LOTO hardware inspection not included in monthly MCC room safety audit checklist.',
    corrective_actions: 'All broken hasps replaced with new multi-hasp lockout devices. LOTO audit checklist updated.',
    p_sif: 0.648,
    classification: 'PSIF Potential',
    confidence: 64.8,
    life_saving_rules: [
      { rule: 'Energy Isolation', confidence: 83.0, reason: 'Inadequate LOTO hardware prevents individual energy isolation for ESP changeout.' }
    ],
    precursors: {
      activity: 'ESP Pump Electrical Isolation',
      location: 'MCC Room JP-3',
      energy_sources: ['11kV Electrical Submersible Pump Power Feed'],
      barrier_failures: ['Broken LOTO Hasps (4/6)', 'No Spares Requisitioned', 'Hardware Not Inspected'],
      human_factors: ['Overlooked Follow-up', 'Reactive Maintenance Mode'],
      organizational_factors: ['LOTO Hardware Audit Integration', 'Spares Management Process']
    },
    highlighted_phrases: [
      { text: '4 out of 6 padlock hasps broken or missing', category: 'Barrier Failure', note: 'Majority of LOTO stations non-functional' },
      { text: 'LOTO hardware inspection not included in monthly audit', category: 'Control Failure', note: 'Systemic oversight gap in safety audit' }
    ],
    risk_level: 'MEDIUM',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 14 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00088',
    report_type: 'Incident',
    site: 'Lakhimpur',
    date: '2026-08-03',
    activity: 'Mechanical Lifting',
    location: 'Workshop Bay 4 - Overhead Gantry Crane',
    contractor_type: 'OIL Staff',
    description: 'Overhead gantry crane hook block dropped 2.4m after lifting rope drum end fastening bolt sheared during a 1.8-ton equipment lift. The load fell onto empty workbench below, narrowly missing two technicians.',
    immediate_causes: 'Rope fastening bolt found severely corroded; crane had not been serviced for 22 months despite 12-month service interval requirement.',
    contributing_factors: 'Crane pre-use checklist completed by technician without checking drum end bolt and rope anchoring fixture.',
    corrective_actions: 'Crane taken out of service. Structural assessment commissioned. Monthly crane inspection reinstated.',
    p_sif: 0.956,
    classification: 'PSIF Potential',
    confidence: 95.6,
    life_saving_rules: [
      { rule: 'Safe Mechanical Lifting', confidence: 98.5, reason: 'Catastrophic crane hook block drop due to maintenance failure on load-bearing component.' }
    ],
    precursors: {
      activity: 'Overhead Crane Lift (1.8T)',
      location: 'Workshop Bay 4',
      energy_sources: ['Suspended Mechanical Load (1.8 Tons)', 'Drop Energy from 2.4m Height'],
      barrier_failures: ['22-Month Service Gap', 'Corroded Rope Bolt', 'Incomplete Pre-use Check'],
      human_factors: ['Overconfidence in Familiar Equipment', 'Surface-Level Pre-use Inspection'],
      organizational_factors: ['Crane Service Schedule Tracking', 'Inspection Completeness Verification']
    },
    highlighted_phrases: [
      { text: 'hook block dropped 2.4m', category: 'Consequence', note: 'High-energy load drop — potential fatality consequence' },
      { text: 'not been serviced for 22 months', category: 'Barrier Failure', note: 'Preventive maintenance barrier completely failed' },
      { text: 'narrowly missing two technicians', category: 'Consequence', note: 'Near-fatal potential realized' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Under Investigation'
  },

  // ─── 15 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-NM-2026-01789',
    report_type: 'Near Miss',
    site: 'Shalmari',
    date: '2026-07-31',
    activity: 'Confined Space Entry',
    location: 'Produced Water Pit Chamber C-7',
    contractor_type: 'Contractor',
    description: 'Contractor worker became disoriented and semi-conscious inside the produced water pit chamber after 11 minutes. Rescue attendant detected slurred speech on radio and initiated retrieval. H2S concentration measured at 22ppm post-recovery.',
    immediate_causes: 'Gas detector alarmed at entry but technician silenced it, assuming it was a false positive based on previous calibration issues.',
    contributing_factors: 'Entry permit issued on the basis of a morning gas test that was conducted 4.5 hours before actual entry.',
    corrective_actions: 'Worker evacuated and provided oxygen therapy. Confined space rescue drill conducted. Gas re-test procedures tightened to 30 minutes before entry.',
    p_sif: 0.982,
    classification: 'PSIF Potential',
    confidence: 98.2,
    life_saving_rules: [
      { rule: 'Confined Space', confidence: 99.0, reason: 'Worker incapacitated by H2S in confined space — direct SIF potential realized.' },
      { rule: 'Bypassing Safety Controls', confidence: 87.0, reason: 'Gas detector alarm deliberately silenced by entrant.' }
    ],
    precursors: {
      activity: 'Pit Cleaning Entry',
      location: 'Water Pit Chamber C-7',
      energy_sources: ['H2S Toxic Atmosphere (22ppm)', 'Oxygen Deficiency Risk'],
      barrier_failures: ['Gas Alarm Silenced', 'Stale Gas Test (4.5hr Old)', 'Detector Credibility Gap'],
      human_factors: ['Alarm Desensitization', 'False Positive Assumption'],
      organizational_factors: ['Gas Test Validity Window', 'Alarm Response Protocol']
    },
    highlighted_phrases: [
      { text: 'silenced the gas detector alarm', category: 'Barrier Failure', note: 'Critical safety alarm deliberately overridden' },
      { text: 'semi-conscious inside the chamber', category: 'Consequence', note: 'Personnel incapacitation in confined space — life-threatening' },
      { text: 'H2S concentration measured at 22ppm', category: 'High Energy', note: 'Toxic gas concentration above incapacitation threshold' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Confirmed PSIF',
    hse_feedback: {
      confirmed_by: 'R. C. Hazarika (Corporate HSE Head)',
      confirmed_at: '2026-08-01 07:30',
      comment: 'H2S incapacitation in confined space with alarm bypass — highest SIF risk category. Systemic confined space program review initiated.',
      decision: 'Confirmed PSIF'
    }
  },

  // ─── 16 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-01901',
    report_type: 'Unsafe Condition (UC)',
    site: 'Kumchai',
    date: '2026-07-28',
    activity: 'Pipeline Maintenance',
    location: 'Above Ground Pipeline Crossing KM-7 Bridge Section',
    contractor_type: 'OIL Staff',
    description: 'Coating on above-ground 12" crude pipeline at KM-7 bridge section completely degraded over 3.8m stretch, with visible active surface pitting. No inspection record found in the last 18 months.',
    immediate_causes: 'Above-ground inspection program excluded this crossing due to access difficulty (bridge over active rail track).',
    contributing_factors: 'No alternate remote inspection method (drone/CCTV) specified for inaccessible sections.',
    corrective_actions: 'Section documented and risk-ranked. Emergency coating clamp fitted. Drone inspection program activated for 6 bridge crossings.',
    p_sif: 0.412,
    classification: 'Non-SIF Potential',
    confidence: 58.8,
    life_saving_rules: [
      { rule: 'Work Authorisation', confidence: 55.0, reason: 'Inspection gap indicates systematic oversight gap in maintenance authorization.' }
    ],
    precursors: {
      activity: 'Pipeline Coating Inspection',
      location: 'KM-7 Bridge Crossing',
      energy_sources: ['Internal Pipeline Pressure', 'External Corrosion Progression'],
      barrier_failures: ['18-Month Inspection Gap', 'No Remote Inspection Method'],
      human_factors: ['Access Difficulty Rationalization'],
      organizational_factors: ['Inspection Program Coverage for Inaccessible Assets']
    },
    highlighted_phrases: [
      { text: 'coating completely degraded over 3.8m stretch', category: 'Barrier Failure', note: 'Primary corrosion barrier failed' },
      { text: 'no inspection record in the last 18 months', category: 'Control Failure', note: 'Long-term monitoring gap' }
    ],
    risk_level: 'MEDIUM',
    review_status: 'Rejected PSIF'
  },

  // ─── 17 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-NM-2026-02012',
    report_type: 'Near Miss',
    site: 'Duliajan',
    date: '2026-07-25',
    activity: 'Hot Work',
    location: 'GGS-5 Process Area - Condensate Knock-out Drum',
    contractor_type: 'Contractor',
    description: 'Grinding work conducted on a condensate knock-out drum bypass flange while the drain leg valve was still open and draining residual condensate. Fumes ignited briefly at drain point before being smothered.',
    immediate_causes: 'Hot work supervisor did not check drain status during pre-job inspection. Drain log not consulted.',
    contributing_factors: 'Night shift communication gap: drain point was opened by operations for sampling 30 minutes before hot work commenced.',
    corrective_actions: 'Hot work halted. Area vented and gas-tested. Cross-discipline communication protocol between operations and maintenance revised.',
    p_sif: 0.908,
    classification: 'PSIF Potential',
    confidence: 90.8,
    life_saving_rules: [
      { rule: 'Hot Work', confidence: 96.0, reason: 'Ignition of hydrocarbon vapors during live drain condition near hot work.' },
      { rule: 'Work Authorisation', confidence: 81.0, reason: 'Operations drain activity not communicated to hot work supervisor.' }
    ],
    precursors: {
      activity: 'Flange Grinding near Live Drain',
      location: 'GGS-5 KOD Bypass Flange',
      energy_sources: ['Flammable Condensate Vapor', 'Grinding Spark'],
      barrier_failures: ['Open Drain During Hot Work', 'No Cross-discipline Check', 'Drain Log Not Consulted'],
      human_factors: ['Night Shift Communication Breakdown', 'Incomplete Pre-job Inspection'],
      organizational_factors: ['Operations-Maintenance Interface Protocol']
    },
    highlighted_phrases: [
      { text: 'drain leg valve was still open and draining condensate', category: 'Barrier Failure', note: 'Active hydrocarbon source present during ignition work' },
      { text: 'Fumes ignited briefly', category: 'Consequence', note: 'Partial ignition event — critical near-miss' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 18 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00621',
    report_type: 'Incident',
    site: 'Digboi',
    date: '2026-07-22',
    activity: 'Scaffolding & Rigging',
    location: 'Refinery Column C-112 Scaffold (14.5m)',
    contractor_type: 'Contractor',
    description: 'A scaffold board (2.4m x 225mm plank) fell from 14.5m working platform, striking a scaffold labourer on the shoulder below. The board was not secured with plank clips and was caught by cross-wind.',
    immediate_causes: 'Scaffold plank laid without plank clips or lashing at open-ended platform edge.',
    contributing_factors: 'Wind speed was 28 km/h — above the 20 km/h limit for open scaffold plank work without additional securing.',
    corrective_actions: 'Worker medically assessed (soft tissue injury). All planks on C-112 scaffold inspected and re-secured. Wind speed threshold enforced by OIL site observer.',
    p_sif: 0.724,
    classification: 'PSIF Potential',
    confidence: 72.4,
    life_saving_rules: [
      { rule: 'Working at Height', confidence: 89.5, reason: 'Unsecured scaffold board fell 14.5m in above-limit wind conditions.' },
      { rule: 'Line of Fire', confidence: 79.0, reason: 'Worker below active scaffold in line of falling object trajectory.' }
    ],
    precursors: {
      activity: 'Column Scaffold Maintenance (14.5m)',
      location: 'Refinery Column C-112',
      energy_sources: ['Falling Object Energy (14.5m Drop)', 'Wind Load on Plank'],
      barrier_failures: ['No Plank Clips', 'Wind Limit Breach', 'Inadequate Edge Securing'],
      human_factors: ['Task Rushing', 'Environmental Condition Ignored'],
      organizational_factors: ['Weather Monitoring in Scaffold Operations', 'Plank Security Inspection']
    },
    highlighted_phrases: [
      { text: 'scaffold board fell from 14.5m', category: 'High Energy', note: 'High-energy dropped object hazard realized' },
      { text: 'not secured with plank clips', category: 'Barrier Failure', note: 'Plank retaining barrier absent' },
      { text: 'wind speed was 28 km/h — above the 20 km/h limit', category: 'Control Failure', note: 'Environmental safety threshold exceeded' }
    ],
    risk_level: 'HIGH',
    review_status: 'Under Investigation'
  },

  // ─── 19 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-02155',
    report_type: 'Unsafe Act (UA)',
    site: 'Naharkatia',
    date: '2026-07-19',
    activity: 'Electrical Work',
    location: 'Field Substation NHK-4 - HV Panel Room',
    contractor_type: 'OIL Staff',
    description: 'Two electrical technicians observed testing HV panel relay without arc flash PPE. Both were wearing standard cotton overalls in a zone rated for minimum 40 cal/cm² arc flash hazard.',
    immediate_causes: 'Arc flash PPE kit not available at NHK-4 substation; technicians assumed low risk for relay testing.',
    contributing_factors: 'Arc flash hazard study completed in 2022 but PPE procurement not completed for remote field substations.',
    corrective_actions: 'Work stopped. PPE delivered from main workshop. Arc flash risk level posted at HV panel. Remote substation PPE inventory audited.',
    p_sif: 0.814,
    classification: 'PSIF Potential',
    confidence: 81.4,
    life_saving_rules: [
      { rule: 'Energy Isolation', confidence: 86.0, reason: 'HV relay work conducted without appropriate arc flash protection in energized panel.' }
    ],
    precursors: {
      activity: 'HV Relay Testing',
      location: 'NHK-4 HV Panel Room',
      energy_sources: ['11kV Arc Flash Energy (40 cal/cm²)', 'Thermal Radiation'],
      barrier_failures: ['No Arc Flash PPE', 'PPE Not Stocked at Location', 'Risk Underestimation'],
      human_factors: ['Optimism Bias', 'Familiarity Bias'],
      organizational_factors: ['Arc Flash PPE Procurement Gap', 'Remote Location Supply Chain']
    },
    highlighted_phrases: [
      { text: 'without arc flash PPE', category: 'Barrier Failure', note: 'Critical protection absent for arc flash hazard zone' },
      { text: '40 cal/cm² arc flash hazard', category: 'High Energy', note: 'Severe arc flash energy level — potentially fatal' },
      { text: 'PPE kit not available at NHK-4', category: 'Control Failure', note: 'Systemic PPE provision failure for remote site' }
    ],
    risk_level: 'HIGH',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 20 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-NM-2026-02287',
    report_type: 'Near Miss',
    site: 'Moran',
    date: '2026-07-16',
    activity: 'Confined Space Entry',
    location: 'Slug Catcher SC-201 Liquid Compartment',
    contractor_type: 'OIL Staff',
    description: 'HSE officer conducting random inspection discovered that the rescue tripod and retrieval winch for Slug Catcher SC-201 entry operation were 800m away at a different job site while entry was actively ongoing.',
    immediate_causes: 'Permit Issuer did not verify rescue equipment was physically positioned at the entry point before permit was signed.',
    contributing_factors: 'Two simultaneous confined space entries approved on same shift without resource allocation check.',
    corrective_actions: 'Entry suspended until rescue equipment repositioned. Simultaneous confined space entry limit set at 1 per shift per HSE officer.',
    p_sif: 0.871,
    classification: 'PSIF Potential',
    confidence: 87.1,
    life_saving_rules: [
      { rule: 'Confined Space', confidence: 94.0, reason: 'Active confined space entry conducted without rescue equipment at point of entry.' },
      { rule: 'Work Authorisation', confidence: 80.5, reason: 'Permit issuer failed to verify rescue readiness before sign-off.' }
    ],
    precursors: {
      activity: 'Slug Catcher Internal Inspection',
      location: 'SC-201 Liquid Compartment',
      energy_sources: ['Residual Hydrocarbon Atmosphere', 'Confined Space Asphyxiation Risk'],
      barrier_failures: ['Rescue Tripod Absent', 'Permit Verification Gap', 'Dual Entry Resource Conflict'],
      human_factors: ['Permit Sign-off Without Physical Verification', 'Workload Overload'],
      organizational_factors: ['Simultaneous Entry Resource Planning', 'Permit Issuer Competency Check']
    },
    highlighted_phrases: [
      { text: 'rescue tripod and retrieval winch were 800m away', category: 'Barrier Failure', note: 'Emergency rescue capability absent at entry point' },
      { text: 'entry was actively ongoing', category: 'Consequence', note: 'Personnel at risk without rescue capability' },
      { text: 'Permit Issuer did not verify', category: 'Control Failure', note: 'Permit control barrier ineffective' }
    ],
    risk_level: 'HIGH',
    review_status: 'Confirmed PSIF',
    hse_feedback: {
      confirmed_by: 'P. Kalita (District HSE Manager - Moran)',
      confirmed_at: '2026-07-17 10:00',
      comment: 'Rescue capability missing during live entry = confirmed SIF. Permit system improvement mandatory.',
      decision: 'Confirmed PSIF'
    }
  },

  // ─── 21 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-02388',
    report_type: 'Unsafe Condition (UC)',
    site: 'Jorhat',
    date: '2026-07-13',
    activity: 'Drilling Operations',
    location: 'Rig JT-2 Derrick - Crown Block Area',
    contractor_type: 'Contractor',
    description: 'Crown block safety platform handrail at 42m found to have 2 vertical stanchion welds cracked. Platform had been in service for 6 years without weld integrity inspection.',
    immediate_causes: 'Periodic structural inspection of crown block platform not scheduled in rig maintenance program.',
    contributing_factors: 'Rig maintenance program inherited from previous operator did not include derrick structural weld inspection frequency.',
    corrective_actions: 'Crown block access suspended. Structural engineer engaged for weld assessment. Rig maintenance program updated.',
    p_sif: 0.682,
    classification: 'PSIF Potential',
    confidence: 68.2,
    life_saving_rules: [
      { rule: 'Working at Height', confidence: 85.0, reason: 'Structural failure risk at 42m rig crown block platform.' }
    ],
    precursors: {
      activity: 'Crown Block Maintenance Access (42m)',
      location: 'Rig JT-2 Derrick Crown',
      energy_sources: ['Gravitational Energy (42m Drop)', 'Structure Collapse Potential'],
      barrier_failures: ['Cracked Stanchion Welds', '6-Year Weld Inspection Gap', 'No Structural Program'],
      human_factors: ['Inherited Practices Without Review'],
      organizational_factors: ['Structural Inspection Program for Aging Rigs', 'Maintenance Program Audit on Rig Acquisition']
    },
    highlighted_phrases: [
      { text: '2 vertical stanchion welds cracked', category: 'Barrier Failure', note: 'Structural integrity failure at height' },
      { text: '42m without weld integrity inspection', category: 'Control Failure', note: 'Six-year inspection gap at extreme elevation' }
    ],
    risk_level: 'HIGH',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 22 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00731',
    report_type: 'Incident',
    site: 'Lakhimpur',
    date: '2026-07-10',
    activity: 'Plant Startup / Shutdown',
    location: 'LPG Bottling Plant - Filler Carousel Area',
    contractor_type: 'OIL Staff',
    description: 'LPG leak detected at cylinder filler head connection during pressurization of carousel. Technician attempted to manually tighten connection with wrench while carousel was still pressurized to 8 bar.',
    immediate_causes: 'Operator applied wrench to live pressurized fitting as a first response without depressurizing the system.',
    contributing_factors: 'Emergency response drill had not covered pressurized leak response scenario. Depressurization valve location not posted near filler station.',
    corrective_actions: 'Operator safely removed. System depressurized. LPG leak response procedure revised with depressurize-first rule.',
    p_sif: 0.843,
    classification: 'PSIF Potential',
    confidence: 84.3,
    life_saving_rules: [
      { rule: 'Energy Isolation', confidence: 90.0, reason: 'Manual intervention on pressurized LPG fitting without depressurization.' },
      { rule: 'Bypassing Safety Controls', confidence: 75.0, reason: 'Improvised on-the-spot repair bypasses emergency depressurization protocol.' }
    ],
    precursors: {
      activity: 'LPG Cylinder Filling (Carousel)',
      location: 'LPG Bottling Plant Carousel',
      energy_sources: ['LPG Pressure (8 bar)', 'Flammable Gas Cloud Potential', 'Ignition Risk'],
      barrier_failures: ['No Depressurize Before Repair', 'No Posted Emergency Procedure', 'Inadequate Emergency Drill'],
      human_factors: ['Urgency-Driven Improvisation', 'Untrained Emergency Response'],
      organizational_factors: ['Emergency Response Drill Scenario Coverage', 'Depressurization Valve Labeling']
    },
    highlighted_phrases: [
      { text: 'manually tighten connection while still pressurized to 8 bar', category: 'Barrier Failure', note: 'Energized system intervention — direct SIF exposure' },
      { text: 'LPG leak detected', category: 'High Energy', note: 'Flammable gas release in enclosed plant area' }
    ],
    risk_level: 'HIGH',
    review_status: 'Under Investigation'
  },

  // ─── 23 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-02511',
    report_type: 'Unsafe Act (UA)',
    site: 'Shalmari',
    date: '2026-07-07',
    activity: 'Driving',
    location: 'Well Site Access Road SH-6',
    contractor_type: 'Contractor',
    description: 'Driver of a chemical delivery vehicle observed using mobile phone to navigate GPS application while the vehicle was in motion on a narrow unpaved well site access road at approximately 40 km/h.',
    immediate_causes: 'Driver unfamiliar with access road and used personal phone GPS instead of stopping to check route.',
    contributing_factors: 'No in-vehicle hands-free navigation system fitted. Driver not briefed on site access rules during induction.',
    corrective_actions: 'Verbal warning issued, entry permit revoked for the day. Site induction to include distracted driving prohibition.',
    p_sif: 0.391,
    classification: 'Non-SIF Potential',
    confidence: 60.9,
    life_saving_rules: [
      { rule: 'Driving', confidence: 72.0, reason: 'Phone use while driving on narrow unmaintained access road.' }
    ],
    precursors: {
      activity: 'Chemical Delivery Vehicle Trip',
      location: 'Well Site Access Road SH-6',
      energy_sources: ['Vehicle Kinetic Energy (40 km/h)'],
      barrier_failures: ['Mobile Phone Use While Driving', 'No Hands-free Nav System', 'Incomplete Site Induction'],
      human_factors: ['Distraction', 'Unfamiliarity with Route'],
      organizational_factors: ['Site Induction Content Gap', 'Vehicle Safety Equipment Policy']
    },
    highlighted_phrases: [
      { text: 'using mobile phone while vehicle was in motion', category: 'Barrier Failure', note: 'Distracted driving — prohibited act' },
      { text: 'narrow unpaved well site access road', category: 'High Energy', note: 'High-risk road type amplifies collision risk' }
    ],
    risk_level: 'LOW',
    review_status: 'Rejected PSIF'
  },

  // ─── 24 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-NM-2026-02609',
    report_type: 'Near Miss',
    site: 'Kumchai',
    date: '2026-07-04',
    activity: 'Well Testing & Servicing',
    location: 'Well Test Flare Pit KM-09',
    contractor_type: 'Contractor',
    description: 'Uncontrolled well flow rate surged from 1,200 bbl/day to 6,800 bbl/day during extended well test, overwhelming flare pit capacity and causing burning crude oil to escape the pit boundary, igniting dry grass at perimeter.',
    immediate_causes: 'Well choke size increased incorrectly — technician applied 64/64" choke instead of 32/64" as per well test program.',
    contributing_factors: 'Choke replacement set was poorly labelled. Test supervisor had gone to camp for meal during the choke change.',
    corrective_actions: 'Well shut in immediately. Grass fire extinguished by site emergency team. Choke labelling standard revised.',
    p_sif: 0.936,
    classification: 'PSIF Potential',
    confidence: 93.6,
    life_saving_rules: [
      { rule: 'Hot Work', confidence: 83.0, reason: 'Uncontrolled hydrocarbon flare causing fire extending beyond controlled boundary.' },
      { rule: 'Work Authorisation', confidence: 88.0, reason: 'Critical well test parameter change made without supervisor authorization.' }
    ],
    precursors: {
      activity: 'Extended Well Flow Test',
      location: 'Well Test Flare Pit KM-09',
      energy_sources: ['Uncontrolled Crude Oil Flow (6,800 bbl/d)', 'Burning Crude Fire'],
      barrier_failures: ['Wrong Choke Size Installed', 'Supervisor Absent During Critical Step', 'Flare Pit Capacity Exceeded'],
      human_factors: ['Labelling Confusion', 'Unsupervised Critical Parameter Change'],
      organizational_factors: ['Choke Equipment Labelling Standard', 'Supervision During Critical Operations']
    },
    highlighted_phrases: [
      { text: 'burning crude oil to escape the pit boundary', category: 'Consequence', note: 'Loss of containment on flare — fire spread realized' },
      { text: 'applied 64/64" choke instead of 32/64"', category: 'Barrier Failure', note: 'Double the intended well flow rate due to wrong choke size' },
      { text: 'test supervisor had gone to camp during the choke change', category: 'Control Failure', note: 'Critical task unsupervised' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Confirmed PSIF',
    hse_feedback: {
      confirmed_by: 'A. J. Phukan (Field Operations Manager)',
      confirmed_at: '2026-07-05 06:45',
      comment: 'Loss of containment with fire spread — confirmed SIF. Choke management and well test supervision protocols redesigned.',
      decision: 'Confirmed PSIF'
    }
  },

  // ─── 25 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-02712',
    report_type: 'Unsafe Condition (UC)',
    site: 'Duliajan',
    date: '2026-07-01',
    activity: 'Energy Isolation',
    location: 'DCS Control Room - Relay Panel R-44',
    contractor_type: 'OIL Staff',
    description: 'During panel modification, a relay was discovered to be cross-wired to a different emergency shutdown (ESD) loop than indicated on the as-built drawing. This was an existing error dating back to 2019 modification.',
    immediate_causes: 'Original modification contractor used incorrect wiring diagram revision. As-built drawing was not updated post-commissioning.',
    contributing_factors: 'DCS as-built drawing review cycle had lapsed. Discovery made incidentally during unrelated instrument work.',
    corrective_actions: 'Cross-wired relay corrected. Full relay panel wiring audit commissioned. Drawing management procedure tightened.',
    p_sif: 0.558,
    classification: 'PSIF Potential',
    confidence: 55.8,
    life_saving_rules: [
      { rule: 'Bypassing Safety Controls', confidence: 68.0, reason: 'Cross-wired ESD relay could cause wrong system shutdown or failure to trip.' },
      { rule: 'Work Authorisation', confidence: 59.0, reason: 'Existing drawing error indicates incomplete as-built verification on original work.' }
    ],
    precursors: {
      activity: 'DCS Panel Relay Inspection',
      location: 'Control Room Relay Panel R-44',
      energy_sources: ['ESD System Mis-operation Potential', 'Process Plant Loss of Control'],
      barrier_failures: ['Cross-wired ESD Relay', 'Outdated As-built Drawing (Since 2019)', 'Drawing Review Lapse'],
      human_factors: ['Original Error Undetected for 7 Years', 'Assumed Drawing Accuracy'],
      organizational_factors: ['As-built Drawing Management', 'Post-commissioning Verification Protocol']
    },
    highlighted_phrases: [
      { text: 'relay cross-wired to different ESD loop', category: 'Barrier Failure', note: 'Safety critical control mismatch — potential wrong shutdown action' },
      { text: 'dating back to 2019', category: 'Control Failure', note: 'Error existed undetected for 7 years' }
    ],
    risk_level: 'MEDIUM',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 26 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-NM-2026-02844',
    report_type: 'Near Miss',
    site: 'Digboi',
    date: '2026-06-28',
    activity: 'Mechanical Lifting',
    location: 'Refinery Tank Farm - Floating Roof Tank 6',
    contractor_type: 'Contractor',
    description: 'Tagline holder stepped inside the crane swing radius to reposition the load while the crane was slewing with a 2.1-ton heat exchanger bundle suspended. Crane operator did not see the worker due to blind spot.',
    immediate_causes: 'Worker self-positioned inside swing radius as he felt the tagline was too short to control the load from a safe distance.',
    contributing_factors: 'Lift plan did not specify tagline minimum lengths or exclusion zone radius for this configuration.',
    corrective_actions: 'Lift suspended. Tagline length increased to 8m. Exclusion zone radius re-staked. Lift plan revised with full exclusion zone diagram.',
    p_sif: 0.918,
    classification: 'PSIF Potential',
    confidence: 91.8,
    life_saving_rules: [
      { rule: 'Safe Mechanical Lifting', confidence: 95.0, reason: 'Worker entered crane swing radius under suspended load with operator blind spot.' },
      { rule: 'Line of Fire', confidence: 90.5, reason: 'Direct exposure to rotating crane jib and suspended 2.1T load.' }
    ],
    precursors: {
      activity: 'Heat Exchanger Bundle Lift (2.1T)',
      location: 'Tank Farm Crane Lift Zone',
      energy_sources: ['Rotating Crane Jib', 'Suspended 2.1-ton Load'],
      barrier_failures: ['Exclusion Zone Breach', 'Short Tagline', 'Crane Operator Blind Spot'],
      human_factors: ['Self-directed Repositioning', 'Perceived Operational Necessity'],
      organizational_factors: ['Lift Plan Tagline Specification', 'Exclusion Zone Communication']
    },
    highlighted_phrases: [
      { text: 'stepped inside the crane swing radius', category: 'Line of Fire', note: 'Deliberate entry into rotating crane energy zone' },
      { text: 'crane operator did not see the worker', category: 'Barrier Failure', note: 'Communication and visibility barrier failure' },
      { text: '2.1-ton heat exchanger bundle suspended', category: 'High Energy', note: 'High gravitational energy load overhead' }
    ],
    risk_level: 'CRITICAL',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 27 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-02966',
    report_type: 'Unsafe Act (UA)',
    site: 'Naharkatia',
    date: '2026-06-25',
    activity: 'Working at Height',
    location: 'Gas Dehydration Unit - Glycol Regenerator Tower (9m)',
    contractor_type: 'Contractor',
    description: 'Two workers using ladders to carry 15kg chemical containers to the glycol regenerator top platform at 9m height. No tool bag or mechanical means used; workers held containers in one hand while climbing.',
    immediate_causes: 'Workers stated that the material hoist was busy at another level and they chose to hand-carry to avoid waiting.',
    contributing_factors: 'Only one material hoist allocated to a 4-level tower maintenance job, creating bottleneck.',
    corrective_actions: 'Task stopped. Second hoist rigged at glycol unit. Toolbox talk conducted on three-point contact and load carrying rules.',
    p_sif: 0.612,
    classification: 'PSIF Potential',
    confidence: 61.2,
    life_saving_rules: [
      { rule: 'Working at Height', confidence: 80.0, reason: 'Workers climbing 9m ladder without three-point contact due to manual load carrying.' }
    ],
    precursors: {
      activity: 'Chemical Delivery to Glycol Unit (9m)',
      location: 'Glycol Regenerator Top Platform',
      energy_sources: ['Gravitational Energy (9m Drop)', 'Manual Load Instability'],
      barrier_failures: ['No Three-Point Contact Maintained', 'No Tool Bag or Mechanical Hoist', 'Single Hoist Resource Bottleneck'],
      human_factors: ['Impatience', 'Workaround Behaviour'],
      organizational_factors: ['Material Hoist Resource Planning', 'Load Handling at Height Procedure']
    },
    highlighted_phrases: [
      { text: 'held containers in one hand while climbing', category: 'Barrier Failure', note: 'Three-point contact barrier violated at 9m height' },
      { text: 'material hoist was busy — chose to hand-carry', category: 'Human Factor', note: 'Workaround driven by resource bottleneck' }
    ],
    risk_level: 'MEDIUM',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 28 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-INC-2026-00854',
    report_type: 'Incident',
    site: 'Moran',
    date: '2026-06-22',
    activity: 'Pipeline Maintenance',
    location: 'Crude Transfer Pipeline MR-18 (km 34 Section)',
    contractor_type: 'Contractor',
    description: 'Pipeline repair contractor struck an unmarked 4" electrical cable buried 0.3m below surface while excavating for a pipe repair spool. Cable was carrying 11kV power supply to a remote wellhead pump. Cable cut caused 6-hour power outage and site-wide SCADA failure.',
    immediate_causes: 'Excavation started without cable detection survey because contractor assumed the cable route was outside the dig area based on an outdated alignment drawing.',
    contributing_factors: 'Cable route not reflected on any drawing issued after 2021 re-routing. No cable marker posts above ground.',
    corrective_actions: 'Power restored via emergency tie-in. All buried cable routes surveyed with ground penetrating radar. Cable drawing registry updated and marker posts installed.',
    p_sif: 0.809,
    classification: 'PSIF Potential',
    confidence: 80.9,
    life_saving_rules: [
      { rule: 'Work Authorisation', confidence: 88.0, reason: 'Excavation without cable detection survey or drawing verification on energized cable route.' },
      { rule: 'Energy Isolation', confidence: 78.0, reason: 'Live 11kV cable struck during mechanical excavation work.' }
    ],
    precursors: {
      activity: 'Pipeline Spool Excavation',
      location: 'Pipeline MR-18 km34',
      energy_sources: ['11kV Buried Electrical Cable', 'Excavator Kinetic Energy'],
      barrier_failures: ['No Cable Detection Survey', 'Outdated Drawing Used', 'No Ground Marker Posts'],
      human_factors: ['Assumption of Cable Route from Old Drawing', 'No Pre-dig Verification'],
      organizational_factors: ['Drawing Currency Management', 'Buried Services Survey Requirement']
    },
    highlighted_phrases: [
      { text: 'struck an unmarked 4" electrical cable carrying 11kV', category: 'High Energy', note: 'Live HV cable strike during excavation' },
      { text: 'without cable detection survey', category: 'Barrier Failure', note: 'Pre-dig survey barrier absent' },
      { text: 'site-wide SCADA failure', category: 'Consequence', note: 'Critical infrastructure impact from undetected hazard' }
    ],
    risk_level: 'HIGH',
    review_status: 'Under Investigation'
  },

  // ─── 29 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-NM-2026-03098',
    report_type: 'Near Miss',
    site: 'Jorhat',
    date: '2026-06-19',
    activity: 'Drilling Operations',
    location: 'Rig JT-4 - Mud Pit Area',
    contractor_type: 'OIL Staff',
    description: 'Drill crew member fell into an open mud pit (3.2m deep, 80% capacity with OBM) while walking between the rig floor and mud mixing unit during night shift. Worker rescued by colleague who was nearby.',
    immediate_causes: 'Mud pit hatch cover had been removed to perform agitator maintenance and not reinstalled. Area was not barricaded.',
    contributing_factors: 'Night shift work in mud pit area was unlit on that section. Worker was unfamiliar with the pit location as he was a new-crew rotation member.',
    corrective_actions: 'Worker checked by medic — no injury. Pit hatch reinstalled, area barricaded and lit. Mud pit area walkway illumination upgraded.',
    p_sif: 0.864,
    classification: 'PSIF Potential',
    confidence: 86.4,
    life_saving_rules: [
      { rule: 'Line of Fire', confidence: 90.0, reason: 'Worker fell into open mud pit — direct immersion hazard in oil-based drilling mud.' },
      { rule: 'Work Authorisation', confidence: 68.0, reason: 'Hatch removal done without barricading or permit for open excavation-equivalent hazard.' }
    ],
    precursors: {
      activity: 'Night Shift Crew Movement Between Mud Pit and Rig Floor',
      location: 'Rig JT-4 Mud Pit Walkway',
      energy_sources: ['Fall into Liquid (3.2m Depth OBM)', 'Immersion/Drowning Hazard'],
      barrier_failures: ['Open Pit Hatch Cover', 'No Barricade', 'Inadequate Lighting'],
      human_factors: ['New Crew Unfamiliarity', 'Reduced Visibility (Night Shift)'],
      organizational_factors: ['Site Lighting Standards', 'Open Pit Barricading Protocol During Maintenance']
    },
    highlighted_phrases: [
      { text: 'fell into an open mud pit', category: 'Consequence', note: 'Immersion in confined oil-based mud — potential drowning' },
      { text: 'hatch cover had been removed — not reinstalled', category: 'Barrier Failure', note: 'Physical hazard barrier left open without controls' },
      { text: 'area was not barricaded', category: 'Control Failure', note: 'No secondary warning barrier for open pit' }
    ],
    risk_level: 'HIGH',
    review_status: 'Awaiting HSE Review'
  },

  // ─── 30 ──────────────────────────────────────────────────────────────────────
  {
    report_id: 'OIL-OBS-2026-03201',
    report_type: 'Unsafe Condition (UC)',
    site: 'Lakhimpur',
    date: '2026-06-16',
    activity: 'Plant Startup / Shutdown',
    location: 'Gas Processing Unit GPU-1 - Amine Absorber Column',
    contractor_type: 'OIL Staff',
    description: 'Amine absorber inlet gas line found with a cracked spectacle blind plate at flange joint GP-7. The spectacle blind was in the closed position (blinding process gas from maintenance side) but the crack extended 70% around the inner bore.',
    immediate_causes: 'Spectacle blind plate material found to be carbon steel instead of stainless steel as per material specification — likely supplied in error.',
    contributing_factors: 'Material traceability documentation for the spectacle blind was missing from the spare parts package received in 2024.',
    corrective_actions: 'Blind plate replaced with certified SS316 plate. Full material traceability audit on critical isolation spades and blinds.',
    p_sif: 0.731,
    classification: 'PSIF Potential',
    confidence: 73.1,
    life_saving_rules: [
      { rule: 'Energy Isolation', confidence: 84.0, reason: 'Cracked isolation spectacle blind — primary barrier integrity compromised during maintenance isolation.' }
    ],
    precursors: {
      activity: 'Gas Train Isolation for Maintenance',
      location: 'GPU-1 Amine Absorber Inlet',
      energy_sources: ['High Pressure Process Gas', 'H2S-Containing Sour Gas'],
      barrier_failures: ['Cracked Spectacle Blind (70% Circumference)', 'Wrong Material Installed', 'No Material Traceability Cert'],
      human_factors: ['Material Specification Not Verified on Receipt'],
      organizational_factors: ['Spare Parts Traceability Management', 'Critical Isolation Hardware Certification']
    },
    highlighted_phrases: [
      { text: 'cracked spectacle blind plate extending 70% around inner bore', category: 'Barrier Failure', note: 'Critical isolation barrier near failure — sour gas breakthrough risk' },
      { text: 'carbon steel instead of stainless steel as per specification', category: 'Control Failure', note: 'Wrong material installed due to traceability gap' }
    ],
    risk_level: 'HIGH',
    review_status: 'Awaiting HSE Review'
  }
];

// Keep backward-compat export (no longer generates repetitive synthetics)
export function generateSyntheticReports(_count?: number): SafetyReport[] {
  return MOCK_SAFETY_REPORTS;
}
