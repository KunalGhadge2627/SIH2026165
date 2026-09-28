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
  'Well Testing & Servicing',
  'Equipment Maintenance',
  'Housekeeping',
  'Driving',
  'Material Handling',
  'Facility Maintenance',
  'Gas Detection',
  'Administrative Work',
  'Material Storage',
  'Work at Height'
];

// 30 completely unique, realistic OIL India HSE safety reports derived from sample_reports.csv
export const MOCK_SAFETY_REPORTS: SafetyReport[] = [
  {
    "report_id": "OIL-001",
    "report_type": "Near Miss",
    "site": "Jorhat",
    "date": "2026-01-14",
    "activity": "Equipment Maintenance",
    "location": "Pump House",
    "contractor_type": "Contractor",
    "description": "During pump maintenance, the technician started work without isolating the electrical supply.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Uncontrolled hazardous energy, Maintenance on live equipment",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.66,
    "classification": "PSIF Potential",
    "confidence": 66.0,
    "life_saving_rules": [
      {
        "rule": "Energy Isolation",
        "confidence": 74.0,
        "reason": "The report for Equipment Maintenance at Pump House is associated with Energy Isolation. The analysis found Uncontrolled hazardous energy, Maintenance on live equipment and Energy isolation verification failure."
      }
    ],
    "precursors": {
      "activity": "Equipment Maintenance",
      "location": "Pump House",
      "energy_sources": [
        "Electrical energy",
        "Stored mechanical energy",
        "High pressure release"
      ],
      "barrier_failures": [
        "Energy isolation verification failure",
        "Control/procedure gap: without"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "electrical",
        "category": "High Energy",
        "note": "AI Extracted Signal: electrical"
      },
      {
        "text": "technician",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: technician"
      }
    ],
    "risk_level": "MEDIUM",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-002",
    "report_type": "Unsafe Condition (UC)",
    "site": "Moran",
    "date": "2026-01-22",
    "activity": "Hot Work",
    "location": "Workshop Bay 2",
    "contractor_type": "OIL Staff",
    "description": "Welding was being carried out close to combustible material without adequate separation.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Ignition source near flammables, Unmonitored hot work area",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.78,
    "classification": "PSIF Potential",
    "confidence": 78.0,
    "life_saving_rules": [
      {
        "rule": "Hot Work",
        "confidence": 96.0,
        "reason": "The report for Hot Work at Workshop Bay 2 is associated with Hot Work. The analysis found Ignition source near flammables, Unmonitored hot work area and Hot work permit failure. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Hot Work",
      "location": "Workshop Bay 2",
      "energy_sources": [
        "Fire hazard",
        "Flammable gas ignition",
        "Explosive atmosphere"
      ],
      "barrier_failures": [
        "Hot work permit failure",
        "Control/procedure gap: without"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "Selected Activity: Hot Work",
        "category": "High Energy",
        "note": "AI Extracted Signal: Selected Activity: Hot Work"
      },
      {
        "text": "hot work",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: hot work"
      }
    ],
    "risk_level": "HIGH",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-003",
    "report_type": "Near Miss",
    "site": "Lakhimpur",
    "date": "2026-01-29",
    "activity": "Confined Space Entry",
    "location": "Process Vessel V-304",
    "contractor_type": "Contractor",
    "description": "A worker entered a confined vessel before oxygen and gas testing had been completed.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.94,
    "classification": "PSIF Potential",
    "confidence": 94.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 96.0,
        "reason": "The report for Confined Space Entry at Process Vessel V-304 is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure and Gas clearance testing failure. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Confined Space Entry",
      "location": "Process Vessel V-304",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Gas clearance testing failure"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "Selected Activity: Confined Space Entry",
        "category": "High Energy",
        "note": "AI Extracted Signal: Selected Activity: Confined Space Entry"
      },
      {
        "text": "confined space",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: confined space"
      }
    ],
    "risk_level": "CRITICAL",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-004",
    "report_type": "Unsafe Act (UA)",
    "site": "Duliajan",
    "date": "2026-02-08",
    "activity": "Mechanical Lifting",
    "location": "Crane Yard",
    "contractor_type": "OIL Staff",
    "description": "A person was standing inside the crane swing radius while lifting operations were in progress.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Person under suspended load, Overloaded lifting tackle",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.82,
    "classification": "PSIF Potential",
    "confidence": 82.0,
    "life_saving_rules": [
      {
        "rule": "Safe Mechanical Lifting",
        "confidence": 96.0,
        "reason": "The report for Mechanical Lifting at Crane Yard is associated with Lifting. The analysis found Person under suspended load, Overloaded lifting tackle and Lifting plan protocol failure. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Mechanical Lifting",
      "location": "Crane Yard",
      "energy_sources": [
        "Suspended load drop",
        "Struck by moving heavy load"
      ],
      "barrier_failures": [
        "Lifting plan protocol failure"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "Selected Activity: Mechanical Lifting",
        "category": "High Energy",
        "note": "AI Extracted Signal: Selected Activity: Mechanical Lifting"
      },
      {
        "text": "lifting",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: lifting"
      }
    ],
    "risk_level": "HIGH",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-005",
    "report_type": "Unsafe Condition (UC)",
    "site": "Digboi",
    "date": "2026-02-17",
    "activity": "Work at Height",
    "location": "Maintenance Area",
    "contractor_type": "Contractor",
    "description": "Scaffold work was observed at height with incomplete edge protection.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Unprotected elevated work edge, Unclipped safety harness",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.82,
    "classification": "PSIF Potential",
    "confidence": 82.0,
    "life_saving_rules": [
      {
        "rule": "Working at Height",
        "confidence": 96.0,
        "reason": "The report for Work at Height at Maintenance Area is associated with Work at Height. The analysis found Unprotected elevated work edge, Unclipped safety harness and Fall protection tie-off failure. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Work at Height",
      "location": "Maintenance Area",
      "energy_sources": [
        "Fall from height",
        "Dropped objects from elevated structure"
      ],
      "barrier_failures": [
        "Fall protection tie-off failure"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "Selected Activity: Work at Height",
        "category": "High Energy",
        "note": "AI Extracted Signal: Selected Activity: Work at Height"
      },
      {
        "text": "work at height",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: work at height"
      }
    ],
    "risk_level": "HIGH",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-006",
    "report_type": "Near Miss",
    "site": "Jorhat",
    "date": "2026-02-25",
    "activity": "Housekeeping",
    "location": "Workshop",
    "contractor_type": "OIL Staff",
    "description": "A loose hand tool was noticed near the edge of a workbench and secured before it fell.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.14,
    "classification": "Non-SIF Potential",
    "confidence": 14.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Housekeeping at Workshop is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Housekeeping",
      "location": "Workshop",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A loose hand tool was noticed near the edge of a workbench a",
        "category": "High Energy",
        "note": "AI Extracted Signal: A loose hand tool was noticed near the edge of a workbench a"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-007",
    "report_type": "Unsafe Condition (UC)",
    "site": "Moran",
    "date": "2026-03-05",
    "activity": "Housekeeping",
    "location": "Administration Block",
    "contractor_type": "Contractor",
    "description": "A pedestrian walkway had a small amount of water near the entrance after routine cleaning.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.16,
    "classification": "Non-SIF Potential",
    "confidence": 16.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Housekeeping at Administration Block is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Housekeeping",
      "location": "Administration Block",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A pedestrian walkway had a small amount of water near the en",
        "category": "High Energy",
        "note": "AI Extracted Signal: A pedestrian walkway had a small amount of water near the en"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-008",
    "report_type": "Unsafe Act (UA)",
    "site": "Duliajan",
    "date": "2026-03-12",
    "activity": "Routine Movement",
    "location": "Office Building",
    "contractor_type": "OIL Staff",
    "description": "An employee stopped to use the handrail before descending an office stairway.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.14,
    "classification": "Non-SIF Potential",
    "confidence": 14.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Routine Movement at Office Building is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Routine Movement",
      "location": "Office Building",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "An employee stopped to use the handrail before descending an",
        "category": "High Energy",
        "note": "AI Extracted Signal: An employee stopped to use the handrail before descending an"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-009",
    "report_type": "Near Miss",
    "site": "Lakhimpur",
    "date": "2026-03-19",
    "activity": "Driving",
    "location": "Parking Area",
    "contractor_type": "Contractor",
    "description": "A vehicle stopped when a pedestrian approached a marked parking area.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.12,
    "classification": "Non-SIF Potential",
    "confidence": 12.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Driving at Parking Area is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Driving",
      "location": "Parking Area",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A vehicle stopped when a pedestrian approached a marked park",
        "category": "High Energy",
        "note": "AI Extracted Signal: A vehicle stopped when a pedestrian approached a marked park"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-010",
    "report_type": "Unsafe Condition (UC)",
    "site": "Digboi",
    "date": "2026-03-27",
    "activity": "Fire Safety",
    "location": "Office Store",
    "contractor_type": "OIL Staff",
    "description": "A fire extinguisher cabinet was partially obstructed by stored cartons.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.15,
    "classification": "Non-SIF Potential",
    "confidence": 15.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Fire Safety at Office Store is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Fire Safety",
      "location": "Office Store",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A fire extinguisher cabinet was partially obstructed by stor",
        "category": "High Energy",
        "note": "AI Extracted Signal: A fire extinguisher cabinet was partially obstructed by stor"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-011",
    "report_type": "Near Miss",
    "site": "Jorhat",
    "date": "2026-04-04",
    "activity": "Inspection",
    "location": "Pump House",
    "contractor_type": "Contractor",
    "description": "A small oil drip was noticed below a pump during routine inspection and maintenance was scheduled.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.12,
    "classification": "Non-SIF Potential",
    "confidence": 12.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Inspection at Pump House is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Inspection",
      "location": "Pump House",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A small oil drip was noticed below a pump during routine ins",
        "category": "High Energy",
        "note": "AI Extracted Signal: A small oil drip was noticed below a pump during routine ins"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-012",
    "report_type": "Unsafe Condition (UC)",
    "site": "Moran",
    "date": "2026-04-11",
    "activity": "Housekeeping",
    "location": "Fabrication Shop",
    "contractor_type": "OIL Staff",
    "description": "Several small metal offcuts were left near a fabrication workbench.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.12,
    "classification": "Non-SIF Potential",
    "confidence": 12.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Housekeeping at Fabrication Shop is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Housekeeping",
      "location": "Fabrication Shop",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "Several small metal offcuts were left near a fabrication wor",
        "category": "High Energy",
        "note": "AI Extracted Signal: Several small metal offcuts were left near a fabrication wor"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-013",
    "report_type": "Near Miss",
    "site": "Duliajan",
    "date": "2026-04-18",
    "activity": "Electrical Maintenance",
    "location": "Maintenance Workshop",
    "contractor_type": "Contractor",
    "description": "A portable electrical cable with a damaged outer sheath was identified and removed from service.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Uncontrolled hazardous energy, Maintenance on live equipment",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.57,
    "classification": "PSIF Potential",
    "confidence": 57.0,
    "life_saving_rules": [
      {
        "rule": "Energy Isolation",
        "confidence": 74.0,
        "reason": "The report for Electrical Maintenance at Maintenance Workshop is associated with Energy Isolation. The analysis found Uncontrolled hazardous energy, Maintenance on live equipment and Energy isolation verification failure."
      }
    ],
    "precursors": {
      "activity": "Electrical Maintenance",
      "location": "Maintenance Workshop",
      "energy_sources": [
        "Electrical energy",
        "Stored mechanical energy",
        "High pressure release"
      ],
      "barrier_failures": [
        "Energy isolation verification failure"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "electrical",
        "category": "High Energy",
        "note": "AI Extracted Signal: electrical"
      }
    ],
    "risk_level": "MEDIUM",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-014",
    "report_type": "Unsafe Act (UA)",
    "site": "Lakhimpur",
    "date": "2026-04-26",
    "activity": "Driving",
    "location": "Field Road",
    "contractor_type": "OIL Staff",
    "description": "A driver began moving a light vehicle before all passengers confirmed that seat belts were fastened.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.16,
    "classification": "Non-SIF Potential",
    "confidence": 16.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Driving at Field Road is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Driving",
      "location": "Field Road",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A driver began moving a light vehicle before all passengers ",
        "category": "High Energy",
        "note": "AI Extracted Signal: A driver began moving a light vehicle before all passengers "
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-015",
    "report_type": "Incident",
    "site": "Digboi",
    "date": "2026-05-03",
    "activity": "Material Handling",
    "location": "Stores Area",
    "contractor_type": "Contractor",
    "description": "A minor hand scratch occurred while unpacking a carton; first aid was provided.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.12,
    "classification": "Non-SIF Potential",
    "confidence": 12.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Material Handling at Stores Area is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Material Handling",
      "location": "Stores Area",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A minor hand scratch occurred while unpacking a carton; firs",
        "category": "High Energy",
        "note": "AI Extracted Signal: A minor hand scratch occurred while unpacking a carton; firs"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-016",
    "report_type": "Unsafe Condition (UC)",
    "site": "Jorhat",
    "date": "2026-05-11",
    "activity": "Facility Maintenance",
    "location": "Canteen",
    "contractor_type": "OIL Staff",
    "description": "A drinking-water dispenser was leaking slightly and a maintenance request was raised.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.15,
    "classification": "Non-SIF Potential",
    "confidence": 15.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Facility Maintenance at Canteen is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Facility Maintenance",
      "location": "Canteen",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A drinking-water dispenser was leaking slightly and a mainte",
        "category": "High Energy",
        "note": "AI Extracted Signal: A drinking-water dispenser was leaking slightly and a mainte"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-017",
    "report_type": "Near Miss",
    "site": "Moran",
    "date": "2026-05-19",
    "activity": "Equipment Maintenance",
    "location": "Workshop",
    "contractor_type": "Contractor",
    "description": "A spanner slipped from a technician's hand during bench work but landed on the floor without contacting anyone.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.17,
    "classification": "Non-SIF Potential",
    "confidence": 17.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Equipment Maintenance at Workshop is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure and Control/procedure gap: without."
      }
    ],
    "precursors": {
      "activity": "Equipment Maintenance",
      "location": "Workshop",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control/procedure gap: without"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "technician",
        "category": "High Energy",
        "note": "AI Extracted Signal: technician"
      },
      {
        "text": "without",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: without"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-018",
    "report_type": "Unsafe Condition (UC)",
    "site": "Duliajan",
    "date": "2026-05-27",
    "activity": "Housekeeping",
    "location": "Canteen",
    "contractor_type": "OIL Staff",
    "description": "A temporary sign was missing from a wet floor during cleaning, and the area was immediately barricaded.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.22,
    "classification": "Non-SIF Potential",
    "confidence": 22.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Housekeeping at Canteen is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure and Control/procedure gap: missing. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Housekeeping",
      "location": "Canteen",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control/procedure gap: missing"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "missing",
        "category": "High Energy",
        "note": "AI Extracted Signal: missing"
      },
      {
        "text": "missing",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: missing"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-019",
    "report_type": "Near Miss",
    "site": "Lakhimpur",
    "date": "2026-06-04",
    "activity": "Mechanical Lifting",
    "location": "Pipe Yard",
    "contractor_type": "Contractor",
    "description": "A worker approached a suspended load and moved back when the lifting supervisor instructed personnel to remain outside the exclusion zone.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Person under suspended load, Overloaded lifting tackle",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.8,
    "classification": "PSIF Potential",
    "confidence": 80.0,
    "life_saving_rules": [
      {
        "rule": "Safe Mechanical Lifting",
        "confidence": 96.0,
        "reason": "The report for Mechanical Lifting at Pipe Yard is associated with Lifting. The analysis found Person under suspended load, Overloaded lifting tackle and Lifting plan protocol failure. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Mechanical Lifting",
      "location": "Pipe Yard",
      "energy_sources": [
        "Suspended load drop",
        "Struck by moving heavy load"
      ],
      "barrier_failures": [
        "Lifting plan protocol failure"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "Selected Activity: Mechanical Lifting",
        "category": "High Energy",
        "note": "AI Extracted Signal: Selected Activity: Mechanical Lifting"
      },
      {
        "text": "lifting",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: lifting"
      }
    ],
    "risk_level": "HIGH",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-020",
    "report_type": "Unsafe Condition (UC)",
    "site": "Digboi",
    "date": "2026-06-12",
    "activity": "Gas Detection",
    "location": "Process Area",
    "contractor_type": "OIL Staff",
    "description": "A gas detector was found with an expired calibration date during a pre-use equipment check.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.26,
    "classification": "Non-SIF Potential",
    "confidence": 26.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Gas Detection at Process Area is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure and Control/procedure gap: expired. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Gas Detection",
      "location": "Process Area",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control/procedure gap: expired"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "gas",
        "category": "High Energy",
        "note": "AI Extracted Signal: gas"
      },
      {
        "text": "expired",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: expired"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-021",
    "report_type": "Incident",
    "site": "Jorhat",
    "date": "2026-06-20",
    "activity": "Administrative Work",
    "location": "Office",
    "contractor_type": "Contractor",
    "description": "A worker received a small superficial cut from a paper edge while preparing routine documentation.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.14,
    "classification": "Non-SIF Potential",
    "confidence": 14.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Administrative Work at Office is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Administrative Work",
      "location": "Office",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "worker",
        "category": "High Energy",
        "note": "AI Extracted Signal: worker"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-022",
    "report_type": "Near Miss",
    "site": "Moran",
    "date": "2026-06-28",
    "activity": "Material Handling",
    "location": "Warehouse",
    "contractor_type": "OIL Staff",
    "description": "A forklift operator stopped at an intersection after noticing a pedestrian approaching from the opposite aisle.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.12,
    "classification": "Non-SIF Potential",
    "confidence": 12.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Material Handling at Warehouse is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Material Handling",
      "location": "Warehouse",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "operator",
        "category": "High Energy",
        "note": "AI Extracted Signal: operator"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-023",
    "report_type": "Unsafe Condition (UC)",
    "site": "Duliajan",
    "date": "2026-07-04",
    "activity": "Material Storage",
    "location": "Warehouse",
    "contractor_type": "Contractor",
    "description": "A storage rack contained cartons slightly above the recommended stacking height; the cartons were rearranged.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Unprotected elevated work edge, Unclipped safety harness",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.63,
    "classification": "PSIF Potential",
    "confidence": 63.0,
    "life_saving_rules": [
      {
        "rule": "Working at Height",
        "confidence": 69.0,
        "reason": "The report for Material Storage at Warehouse is associated with Work at Height. The analysis found Unprotected elevated work edge, Unclipped safety harness and Fall protection tie-off failure. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Material Storage",
      "location": "Warehouse",
      "energy_sources": [
        "Fall from height",
        "Dropped objects from elevated structure"
      ],
      "barrier_failures": [
        "Fall protection tie-off failure"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "height",
        "category": "High Energy",
        "note": "AI Extracted Signal: height"
      },
      {
        "text": "height",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: height"
      }
    ],
    "risk_level": "MEDIUM",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-024",
    "report_type": "Near Miss",
    "site": "Lakhimpur",
    "date": "2026-07-12",
    "activity": "Equipment Maintenance",
    "location": "Process Area",
    "contractor_type": "OIL Staff",
    "description": "A maintenance worker found a valve label that was difficult to read and paused the task until identification was verified.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.15,
    "classification": "Non-SIF Potential",
    "confidence": 15.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Equipment Maintenance at Process Area is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Equipment Maintenance",
      "location": "Process Area",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "worker",
        "category": "High Energy",
        "note": "AI Extracted Signal: worker"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-025",
    "report_type": "Unsafe Condition (UC)",
    "site": "Digboi",
    "date": "2026-07-20",
    "activity": "Hot Work",
    "location": "Workshop",
    "contractor_type": "Contractor",
    "description": "A welding machine was switched off and the surrounding area was cleared after routine hot-work activities were completed.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Ignition source near flammables, Unmonitored hot work area",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.76,
    "classification": "PSIF Potential",
    "confidence": 76.0,
    "life_saving_rules": [
      {
        "rule": "Hot Work",
        "confidence": 96.0,
        "reason": "The report for Hot Work at Workshop is associated with Hot Work. The analysis found Ignition source near flammables, Unmonitored hot work area and Hot work permit failure. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Hot Work",
      "location": "Workshop",
      "energy_sources": [
        "Fire hazard",
        "Flammable gas ignition",
        "Explosive atmosphere"
      ],
      "barrier_failures": [
        "Hot work permit failure"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "Selected Activity: Hot Work",
        "category": "High Energy",
        "note": "AI Extracted Signal: Selected Activity: Hot Work"
      },
      {
        "text": "hot work",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: hot work"
      }
    ],
    "risk_level": "HIGH",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-026",
    "report_type": "Near Miss",
    "site": "Jorhat",
    "date": "2026-07-28",
    "activity": "Energy Isolation",
    "location": "Process Unit",
    "contractor_type": "OIL Staff",
    "description": "A technician identified residual pressure in a line during preparation for maintenance and stopped work until the line was depressurized.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Uncontrolled hazardous energy, Maintenance on live equipment",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.76,
    "classification": "PSIF Potential",
    "confidence": 76.0,
    "life_saving_rules": [
      {
        "rule": "Energy Isolation",
        "confidence": 96.0,
        "reason": "The report for Energy Isolation at Process Unit is associated with Energy Isolation. The analysis found Uncontrolled hazardous energy, Maintenance on live equipment and Energy isolation verification failure."
      }
    ],
    "precursors": {
      "activity": "Energy Isolation",
      "location": "Process Unit",
      "energy_sources": [
        "Electrical energy",
        "Stored mechanical energy",
        "High pressure release"
      ],
      "barrier_failures": [
        "Energy isolation verification failure"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "Selected Activity: Energy Isolation",
        "category": "High Energy",
        "note": "AI Extracted Signal: Selected Activity: Energy Isolation"
      },
      {
        "text": "isolation",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: isolation"
      }
    ],
    "risk_level": "HIGH",
    "review_status": "Awaiting HSE Review"
  },
  {
    "report_id": "OIL-027",
    "report_type": "Unsafe Condition (UC)",
    "site": "Moran",
    "date": "2026-08-04",
    "activity": "Facility Maintenance",
    "location": "Utility Building",
    "contractor_type": "Contractor",
    "description": "A stairway handrail had a loose mounting point and was reported for repair.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.14,
    "classification": "Non-SIF Potential",
    "confidence": 14.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Facility Maintenance at Utility Building is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Facility Maintenance",
      "location": "Utility Building",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A stairway handrail had a loose mounting point and was repor",
        "category": "High Energy",
        "note": "AI Extracted Signal: A stairway handrail had a loose mounting point and was repor"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-028",
    "report_type": "Incident",
    "site": "Duliajan",
    "date": "2026-08-11",
    "activity": "Housekeeping",
    "location": "Workshop",
    "contractor_type": "OIL Staff",
    "description": "A worker experienced minor discomfort from dust during a short housekeeping activity; the task was paused and ventilation improved.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.12,
    "classification": "Non-SIF Potential",
    "confidence": 12.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Housekeeping at Workshop is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Housekeeping",
      "location": "Workshop",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "worker",
        "category": "High Energy",
        "note": "AI Extracted Signal: worker"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-029",
    "report_type": "Near Miss",
    "site": "Lakhimpur",
    "date": "2026-08-19",
    "activity": "Driving",
    "location": "Internal Road",
    "contractor_type": "Contractor",
    "description": "A vehicle approached a site junction above the posted internal speed limit, and the driver reduced speed after being alerted by the spotter.",
    "immediate_causes": "Routine operational variance",
    "contributing_factors": "Personnel entering restricted space, Atmospheric hazard exposure",
    "corrective_actions": "Area inspected and rectified",
    "p_sif": 0.12,
    "classification": "Non-SIF Potential",
    "confidence": 12.0,
    "life_saving_rules": [
      {
        "rule": "Confined Space",
        "confidence": 35.0,
        "reason": "The report for Driving at Internal Road is associated with Confined Space. The analysis found Personnel entering restricted space, Atmospheric hazard exposure."
      }
    ],
    "precursors": {
      "activity": "Driving",
      "location": "Internal Road",
      "energy_sources": [
        "Toxic atmosphere",
        "Oxygen deficiency",
        "Hazardous gas accumulation"
      ],
      "barrier_failures": [
        "Control gap identified"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "A vehicle approached a site junction above the posted intern",
        "category": "High Energy",
        "note": "AI Extracted Signal: A vehicle approached a site junction above the posted intern"
      }
    ],
    "risk_level": "LOW",
    "review_status": "Reviewed"
  },
  {
    "report_id": "OIL-030",
    "report_type": "Unsafe Condition (UC)",
    "site": "Digboi",
    "date": "2026-08-27",
    "activity": "Work at Height",
    "location": "Maintenance Platform",
    "contractor_type": "OIL Staff",
    "description": "A maintenance platform had a missing toe board on one section and access was restricted until repair.",
    "immediate_causes": "Omission of safety verification",
    "contributing_factors": "Unprotected elevated work edge, Unclipped safety harness",
    "corrective_actions": "Work halted, barrier restored",
    "p_sif": 0.89,
    "classification": "PSIF Potential",
    "confidence": 89.0,
    "life_saving_rules": [
      {
        "rule": "Working at Height",
        "confidence": 96.0,
        "reason": "The report for Work at Height at Maintenance Platform is associated with Work at Height. The analysis found Unprotected elevated work edge, Unclipped safety harness and Fall protection tie-off failure. SIF-related language increases the potential severity signal."
      }
    ],
    "precursors": {
      "activity": "Work at Height",
      "location": "Maintenance Platform",
      "energy_sources": [
        "Fall from height",
        "Dropped objects from elevated structure"
      ],
      "barrier_failures": [
        "Fall protection tie-off failure",
        "Control/procedure gap: missing"
      ],
      "human_factors": [
        "Compliance / Omission Signal"
      ],
      "organizational_factors": [
        "Verification Backlog"
      ]
    },
    "highlighted_phrases": [
      {
        "text": "Selected Activity: Work at Height",
        "category": "High Energy",
        "note": "AI Extracted Signal: Selected Activity: Work at Height"
      },
      {
        "text": "work at height",
        "category": "Barrier Failure",
        "note": "AI Extracted Signal: work at height"
      }
    ],
    "risk_level": "CRITICAL",
    "review_status": "Awaiting HSE Review"
  }
];
