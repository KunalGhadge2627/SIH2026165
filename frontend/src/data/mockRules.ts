import { LifeSavingRuleName } from '../types/safety';

export interface LifeSavingRuleInfo {
  name: LifeSavingRuleName;
  code: string;
  iconName: string;
  shortDescription: string;
  fullGuidance: string;
  color: string;
  topFailureMode: string;
  examplePrecursors: string[];
}

export const IOGP_LIFE_SAVING_RULES: LifeSavingRuleInfo[] = [
  {
    name: 'Bypassing Safety Controls',
    code: 'LSR-01',
    iconName: 'ShieldAlert',
    shortDescription: 'Obtain authorization before overriding or disabling safety controls',
    fullGuidance: 'Never bypass or disable safety critical equipment, interlocks, or relief valves without explicit formal management change (MOC) and permit.',
    color: '#DC2626',
    topFailureMode: 'Interlock bypassed during startup without MOC approval',
    examplePrecursors: ['Gas detector alarm muted', 'PSV isolated', 'Trip bypassed']
  },
  {
    name: 'Confined Space',
    code: 'LSR-02',
    iconName: 'Box',
    shortDescription: 'Obtain authorization before entering a confined space',
    fullGuidance: 'Verify isolation, complete continuous gas testing, ensure standby attendant is stationed, and confirm emergency response readiness prior to entry.',
    color: '#EA580C',
    topFailureMode: 'Entry before gas testing completion / absent attendant',
    examplePrecursors: ['Atmospheric testing incomplete', 'Standby attendant left post', 'Ventilation turned off']
  },
  {
    name: 'Driving',
    code: 'LSR-03',
    iconName: 'Car',
    shortDescription: 'Follow safe driving rules: seatbelts, speed limits, no mobile phones',
    fullGuidance: 'Always wear seatbelts, adhere to site speed limits, refrain from using mobile devices while driving, and conduct pre-trip vehicle inspections.',
    color: '#D97706',
    topFailureMode: 'Speeding on wellhead access roads & unbuckled seatbelts',
    examplePrecursors: ['Heavy vehicle brake wear ignored', 'Cell phone use while driving', 'Fatigue driving']
  },
  {
    name: 'Energy Isolation',
    code: 'LSR-04',
    iconName: 'Lock',
    shortDescription: 'Verify isolation before work begins and test for zero energy',
    fullGuidance: 'Isolate all energy sources (electrical, mechanical, hydraulic, pneumatic), apply Lockout/Tagout (LOTO), and test zero-energy state prior to breaking containment.',
    color: '#0A4B7C',
    topFailureMode: 'Isolation not verified / missing zero-energy check',
    examplePrecursors: ['LOTO lock missing', 'Valve bled without verification', 'Wrong breaker tagged']
  },
  {
    name: 'Hot Work',
    code: 'LSR-05',
    iconName: 'Flame',
    shortDescription: 'Control flammable gas sources and protect against ignition',
    fullGuidance: 'Ensure continuous gas monitoring, clear combustible materials within 35ft, station a dedicated fire watch, and secure authorized hot work permits.',
    color: '#E6A100',
    topFailureMode: 'Hot work near hydrocarbon lines without continuous gas monitoring',
    examplePrecursors: ['Sparks near drain vessel', 'Gas test expired', 'Fire blanket degraded']
  },
  {
    name: 'Line of Fire',
    code: 'LSR-06',
    iconName: 'Target',
    shortDescription: 'Position yourself clear of moving objects, pressure releases, and dropped objects',
    fullGuidance: 'Establish exclusion zones around suspended loads, high-pressure piping, and rotating machinery. Never stand under hoisted equipment.',
    color: '#7C3AED',
    topFailureMode: 'Standing under suspended pipe assembly during crane hoist',
    examplePrecursors: ['No barricade tape around rig floor', 'Worker in swing radius', 'High pressure line unanchored']
  },
  {
    name: 'Safe Mechanical Lifting',
    code: 'LSR-07',
    iconName: 'Anchor',
    shortDescription: 'Plan lifting operations and control the area',
    fullGuidance: 'Verify crane capacity, inspect slings and rigging tackle, secure lift plan approval, and confirm rigger certification before lifting loads.',
    color: '#0284C7',
    topFailureMode: 'Rigging tackle damaged / uncertified crane lift',
    examplePrecursors: ['Frayed wire rope sling', 'Over-capacity crane boom', 'No taglines used']
  },
  {
    name: 'Work Authorisation',
    code: 'LSR-08',
    iconName: 'FileCheck',
    shortDescription: 'Work with a valid permit when required and execute Tool Box Talk',
    fullGuidance: 'Verify permit conditions at job site, conduct pre-job risk assessment (JSA), confirm safety precautions, and revalidate permit when conditions change.',
    color: '#16A34A',
    topFailureMode: 'Working outside authorized scope or expired permit',
    examplePrecursors: ['Permit expired', 'Tool Box Talk skipped', 'Work area shifted without revalidation']
  },
  {
    name: 'Working at Height',
    code: 'LSR-09',
    iconName: 'ArrowUpCircle',
    shortDescription: 'Protect yourself against falling when working at height',
    fullGuidance: 'Use 100% fall protection (harness with dual lanyards attached to certified anchor points) when working above 1.8m or over open grating.',
    color: '#059669',
    topFailureMode: 'Unattached full-body harness lanyard on scaffold frame',
    examplePrecursors: ['Scaffold missing toe-boards', 'Anchor point uncertified', 'Ladder un-tied']
  }
];
