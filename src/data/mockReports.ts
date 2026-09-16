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

// Highlighted prompt benchmark case + 500 generated reports
const BENCHMARK_REPORTS: SafetyReport[] = [
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
  }
];

// Helper to generate realistic random data
export function generateSyntheticReports(count: number = 500): SafetyReport[] {
  const reports: SafetyReport[] = [...BENCHMARK_REPORTS];

  const reportTypes: ReportType[] = ['Near Miss', 'Unsafe Act (UA)', 'Unsafe Condition (UC)', 'Incident'];
  const rulesList: LifeSavingRuleName[] = [
    'Bypassing Safety Controls',
    'Confined Space',
    'Driving',
    'Energy Isolation',
    'Hot Work',
    'Line of Fire',
    'Safe Mechanical Lifting',
    'Work Authorisation',
    'Working at Height'
  ];

  const templateScenarios = [
    {
      rule: 'Energy Isolation' as LifeSavingRuleName,
      activity: 'Energy Isolation',
      desc: 'Lockout tag missing on main breaker switchboard during motor maintenance in Substation 4.',
      cause: 'Electrician used standard tape instead of approved LOTO padlock.',
      barrier: 'Missing LOTO Padlock',
      psifBase: 0.82
    },
    {
      rule: 'Working at Height' as LifeSavingRuleName,
      activity: 'Scaffolding & Rigging',
      desc: 'Scaffold structure erected at 6.5m elevation missing middle guardrails and toe boards near flare stack.',
      cause: 'Scaffold contractor ran out of standard clamp fittings.',
      barrier: 'Incomplete Scaffold Guardrail',
      psifBase: 0.76
    },
    {
      rule: 'Line of Fire' as LifeSavingRuleName,
      activity: 'Pipeline Maintenance',
      desc: 'Worker standing directly in front of high-pressure pig receiver door while unbolting lock clamps.',
      cause: 'Inadequate safety awareness during pigging operation.',
      barrier: 'Improper Body Positioning',
      psifBase: 0.89
    },
    {
      rule: 'Hot Work' as LifeSavingRuleName,
      activity: 'Hot Work',
      desc: 'Diesel generator exhaust positioned 3 meters from hydrocarbon sample point without fire blanket shield.',
      cause: 'Temporary power setup placed without hot work clearance zone check.',
      barrier: 'Ignition Source Clearance Failure',
      psifBase: 0.68
    },
    {
      rule: 'Driving' as LifeSavingRuleName,
      activity: 'Drilling Operations',
      desc: 'Heavy winch truck driven at 55 km/h on narrow unpaved well access road exceeding 20 km/h site limit.',
      cause: 'Driver rushing to deliver drilling fluid chemicals.',
      barrier: 'Speed Limit Non-Compliance',
      psifBase: 0.62
    },
    {
      rule: 'Work Authorisation' as LifeSavingRuleName,
      activity: 'Electrical Work',
      desc: 'Cable trench excavation started with backhoe tractor without underground cable location permit.',
      cause: 'Civil contractor assumed area was clear based on old site map.',
      barrier: 'Missing Excavation Permit',
      psifBase: 0.74
    },
    {
      rule: 'Confined Space' as LifeSavingRuleName,
      activity: 'Confined Space Entry',
      desc: 'Gas detector calibration expired by 45 days used for initial tank cleaning entry approval.',
      cause: 'Calibration kit was out of stock at site store.',
      barrier: 'Uncalibrated Gas Detector',
      psifBase: 0.85
    },
    {
      rule: 'Safe Mechanical Lifting' as LifeSavingRuleName,
      activity: 'Mechanical Lifting',
      desc: 'Mobile crane outriggers extended on soft uncompacted soil without spreader timber pads.',
      cause: 'Crane operator omitted pad placement to speed up setup.',
      barrier: 'Improper Outrigger Support',
      psifBase: 0.81
    },
    {
      rule: 'Bypassing Safety Controls' as LifeSavingRuleName,
      activity: 'Plant Startup / Shutdown',
      desc: 'High level alarm on crude wash tank disabled by wedge placed behind relay contactor.',
      cause: 'Operators frustrated by nuisance alarm during heavy rain.',
      barrier: 'Mechanical Alarm Wedging',
      psifBase: 0.91
    }
  ];

  for (let i = reports.length + 1; i <= count; i++) {
    const template = templateScenarios[i % templateScenarios.length];
    const site = OIL_SITES[i % OIL_SITES.length];
    const reportType = reportTypes[i % reportTypes.length];
    const contractor = i % 3 === 0 ? 'Contractor' : 'OIL Staff';

    // Generate random variance
    const randOffset = ((i * 17) % 30 - 15) / 100;
    const p_sif = Math.min(0.99, Math.max(0.12, template.psifBase + randOffset));
    const isPsif = p_sif >= 0.55;
    const confidence = Math.round((p_sif > 0.5 ? p_sif * 100 : (1 - p_sif) * 100) * 10) / 10;

    let risk_level: RiskLevel = 'LOW';
    if (p_sif >= 0.85) risk_level = 'CRITICAL';
    else if (p_sif >= 0.70) risk_level = 'HIGH';
    else if (p_sif >= 0.50) risk_level = 'MEDIUM';

    let review_status: ReviewStatus = 'Awaiting HSE Review';
    if (i % 5 === 0) review_status = 'Confirmed PSIF';
    else if (i % 11 === 0) review_status = 'Rejected PSIF';

    const day = (i % 28) + 1;
    const month = (i % 8) + 1;
    const dateStr = `2026-0${month < 10 ? month : '8'}-${day < 10 ? '0' + day : day}`;

    const reportId = `OIL-${reportType === 'Incident' ? 'INC' : reportType === 'Near Miss' ? 'NM' : 'OBS'}-2026-${String(1000 + i).padStart(5, '0')}`;

    reports.push({
      report_id: reportId,
      report_type: reportType,
      site,
      date: dateStr,
      activity: template.activity,
      location: `Zone ${ (i % 12) + 1 } - Unit ${(i % 5) + 101}`,
      contractor_type: contractor,
      description: template.desc,
      immediate_causes: template.cause,
      contributing_factors: 'Routine task complacency and insufficient supervisory site walkthroughs.',
      corrective_actions: 'Safety toolbox talk conducted, barrier restored, incident logged into HSSE portal.',
      p_sif: Math.round(p_sif * 1000) / 1000,
      classification: isPsif ? 'PSIF Potential' : 'Non-SIF Potential',
      confidence,
      life_saving_rules: [
        {
          rule: template.rule,
          confidence: Math.round((0.8 + (i % 15) / 100) * 100),
          reason: `AI detected precursor indicator matching ${template.rule} rule.`
        }
      ],
      precursors: {
        activity: template.activity,
        location: `Zone ${ (i % 12) + 1 }`,
        energy_sources: ['Mechanical', 'Hydrocarbon Vapor', 'Electrical Pressurization'],
        barrier_failures: [template.barrier],
        human_factors: ['Complacency', 'Procedural Non-Compliance'],
        organizational_factors: ['Supervisor Monitoring Gap']
      },
      highlighted_phrases: [
        { text: template.barrier, category: 'Barrier Failure', note: 'AI identified control barrier deficit' }
      ],
      risk_level,
      review_status
    });
  }

  return reports;
}

export const MOCK_SAFETY_REPORTS: SafetyReport[] = generateSyntheticReports(520);
