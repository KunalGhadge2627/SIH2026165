import { PrecursorPattern } from '../types/safety';

export const MOCK_PRECURSOR_PATTERNS: PrecursorPattern[] = [
  {
    id: 'PAT-01',
    title: 'Energy isolation not verified before breaking containment',
    occurrences: 47,
    psif_count: 31,
    affected_sites_count: 4,
    top_sites: ['Duliajan', 'Digboi', 'Naharkatia', 'Moran'],
    primary_rule: 'Energy Isolation',
    barrier_failure: 'Isolation Not Verified / Missing Zero-Energy Check',
    severity: 'CRITICAL',
    description: 'Technicians opening flange joints or bleeding valves without performing physical pressure gauge verification or LOTO double-block check.'
  },
  {
    id: 'PAT-02',
    title: 'Confined-space entry without gas test / attendant',
    occurrences: 32,
    psif_count: 28,
    affected_sites_count: 3,
    top_sites: ['Duliajan', 'Jorhat', 'Digboi'],
    primary_rule: 'Confined Space',
    barrier_failure: 'Missing Atmospheric Gas Testing & Unmanned Entry Manway',
    severity: 'CRITICAL',
    description: 'Maintenance crews entering process vessels or storage tanks prior to HSE gas clearance certificate or without standby rescue attendant.'
  },
  {
    id: 'PAT-03',
    title: 'Hot work near flammables without valid gas permit',
    occurrences: 26,
    psif_count: 21,
    affected_sites_count: 5,
    top_sites: ['Naharkatia', 'Shalmari', 'Moran', 'Duliajan', 'Digboi'],
    primary_rule: 'Hot Work',
    barrier_failure: 'Expired Permit / Unmonitored Hydrocarbon LEL Atmosphere',
    severity: 'HIGH',
    description: 'Grinding and arc welding activities conducted in tank farms or manifold areas without continuous LEL gas detector coverage or fire blanket.'
  },
  {
    id: 'PAT-04',
    title: 'Overhead hoisting without taglines / uninspected tackle',
    occurrences: 39,
    psif_count: 24,
    affected_sites_count: 4,
    top_sites: ['Moran', 'Lakhimpur', 'Duliajan', 'Kumchai'],
    primary_rule: 'Safe Mechanical Lifting',
    barrier_failure: 'Damaged Wire Slings & Missing Taglines',
    severity: 'HIGH',
    description: 'Crane hoisting heavy equipment over rig floors without taglines or utilizing slings showing visible strand degradation.'
  },
  {
    id: 'PAT-05',
    title: 'Safety interlock bypass without formal Management of Change (MOC)',
    occurrences: 19,
    psif_count: 16,
    affected_sites_count: 2,
    top_sites: ['Jorhat', 'Duliajan'],
    primary_rule: 'Bypassing Safety Controls',
    barrier_failure: 'Instrument Jumpering & Alarm Wedging',
    severity: 'CRITICAL',
    description: 'Instrument technicians jumpering safety relays or wedging pressure switches to override false trips during plant startup operations.'
  }
];
