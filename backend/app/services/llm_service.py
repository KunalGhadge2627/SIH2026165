import os
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict
from ..core.config import settings
from ..engines.sif_engine import analyze_report as heuristic_analyze
from ..schemas.report import ReportInput

logger = logging.getLogger("oil_safety.llm")

SYSTEM_INSTRUCTION = """You are the Safety Intelligence Analysis Engine for Oil India Limited (OIL).

Analyze Unsafe Act, Unsafe Condition, Near Miss, and Incident safety reports.

Determine whether the described situation contains credible Serious Injury &
Fatality (SIF) potential.

Evaluate potential consequence, not only actual injury outcome.

A Near Miss can have SIF potential.
An Incident can have low SIF potential.
Do not classify based only on report type or keywords.

Do not force a target percentage of reports to be SIF.

Do not invent information that is not supported by the report.

If information is insufficient, lower confidence rather than inventing facts.

Map reports to the relevant IOGP Life-Saving Rules.

Use multiple Life-Saving Rules when multiple rules are genuinely supported.

Relevant Life-Saving Rules:
- Bypassing Safety Controls
- Confined Space
- Driving
- Energy Isolation
- Hot Work
- Line of Fire
- Safe Mechanical Lifting
- Work Authorisation
- Working at Height

Identify:
- hazards
- precursors
- barrier failures
- exposure
- activity
- supporting evidence

Keep confidence separate from SIF potential.

Return ONLY valid JSON matching the required schema.

The output is AI decision support and must be reviewed by an HSE professional."""

JSON_SCHEMA_PROMPT = """
Return ONLY a valid JSON object matching this exact structure:
{
  "sif_potential": true,
  "confidence": 0.87,
  "priority": "High",
  "life_saving_rules": [
    {
      "rule": "Energy Isolation",
      "confidence": 0.94
    }
  ],
  "activity": "Equipment Maintenance",
  "hazards": [
    "Electrical energy",
    "Stored energy"
  ],
  "precursors": [
    "Work started before isolation"
  ],
  "barrier_failures": [
    "Energy isolation not implemented"
  ],
  "exposure": [
    "Technician"
  ],
  "evidence": [
    "The technician was exposed to hazardous energy before isolation."
  ],
  "explanation": "The report describes exposure to hazardous energy while required isolation was not implemented, creating credible potential for serious injury or fatality."
}
"""

def analyze_report_with_llm(report_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sends safety report to the configured backend LLM API (Gemini or OpenAI).
    Returns structured JSON matching the required OIL schema.
    """
    api_key = settings.llm_api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("OPENAI_API_KEY")
    provider = settings.llm_provider.lower() if settings.llm_provider else "auto"

    narrative = report_data.get("narrative") or report_data.get("text") or ""
    activity = report_data.get("activity") or "General Operations"
    site = report_data.get("site") or "Duliajan"
    location = report_data.get("location") or "Process Site"
    report_type = report_data.get("report_type") or "near_miss"
    person_type = report_data.get("person_type") or report_data.get("contractor_type") or "Contractor"
    immediate_cause = report_data.get("immediate_cause") or ""
    contributing_factors = report_data.get("contributing_factors") or ""
    corrective_action = report_data.get("corrective_action") or ""

    user_prompt = f"""
Safety Report to Analyze:
- Report Type: {report_type}
- Site: {site}
- Location: {location}
- Activity: {activity}
- Person Type: {person_type}
- Report Narrative: "{narrative}"
- Immediate Cause: "{immediate_cause}"
- Contributing Factors: "{contributing_factors}"
- Corrective Action: "{corrective_action}"

{JSON_SCHEMA_PROMPT}
"""

    if api_key:
        # Try Google GenAI / Gemini API if provider is gemini or auto
        if provider in ("gemini", "auto", "none"):
            primary_models = [settings.llm_model] if settings.llm_model else []
            fallback_models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest']
            candidate_models = []
            for m in primary_models + fallback_models:
                if m and m not in candidate_models:
                    candidate_models.append(m)

            for target_model in candidate_models:
                try:
                    from google import genai
                    from google.genai import types
                    client = genai.Client(api_key=api_key)
                    response = client.models.generate_content(
                        model=target_model,
                        contents=user_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            temperature=0.2,
                        ),
                    )
                    parsed = json.loads(response.text)
                    logger.info(f"Successfully generated structured SIF analysis using Gemini model: {target_model}")
                    return _format_and_validate_llm_json(parsed, report_data)
                except Exception as e:
                    logger.warning(f"Google GenAI SDK call failed for model {target_model}: {e}")

        # Try OpenAI API if explicitly configured
        if provider == "openai":
            try:
                import openai
                client = openai.OpenAI(api_key=api_key)
                response = client.chat.completions.create(
                    model=settings.llm_model or "gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": SYSTEM_INSTRUCTION},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.2,
                )
                parsed = json.loads(response.choices[0].message.content)
                return _format_and_validate_llm_json(parsed, report_data)
            except Exception as e:
                logger.warning(f"OpenAI API call failed: {e}. Utilizing fallback analyzer.")

    # Fallback to backend SIF engine adhering to exact JSON schema
    return _fallback_nlp_analysis(report_data)


def _format_and_validate_llm_json(parsed: Dict[str, Any], report_data: Dict[str, Any]) -> Dict[str, Any]:
    """Ensures returned LLM JSON conforms strictly to the required schema."""
    rules_raw = parsed.get("life_saving_rules") or []
    formatted_rules = []
    if isinstance(rules_raw, list):
        for r in rules_raw:
            if isinstance(r, dict) and "rule" in r:
                conf = float(r.get("confidence", 0.90))
                if conf > 1.0: conf = conf / 100.0
                formatted_rules.append({"rule": str(r["rule"]), "confidence": round(conf, 2)})
            elif isinstance(r, str):
                formatted_rules.append({"rule": r, "confidence": 0.85})
    if not formatted_rules:
        formatted_rules = [{"rule": "Work Authorisation", "confidence": 0.80}]

    conf = float(parsed.get("confidence", 0.75))
    if conf > 1.0: conf = conf / 100.0

    return {
        "sif_potential": bool(parsed.get("sif_potential", conf >= 0.55)),
        "confidence": round(conf, 2),
        "priority": str(parsed.get("priority", "Medium")),
        "life_saving_rules": formatted_rules,
        "activity": str(parsed.get("activity") or report_data.get("activity") or "General Operations"),
        "hazards": [str(x) for x in parsed.get("hazards", [])] or ["Process Hazard"],
        "precursors": [str(x) for x in parsed.get("precursors", [])] or ["Unsafe work condition"],
        "barrier_failures": [str(x) for x in parsed.get("barrier_failures", [])] or ["Safety control omission"],
        "exposure": [str(x) for x in parsed.get("exposure", [])] or [report_data.get("person_type") or "Personnel"],
        "evidence": [str(x) for x in parsed.get("evidence", [])] or [report_data.get("narrative", "")[:100]],
        "explanation": str(parsed.get("explanation") or "AI safety analysis completed based on submitted narrative."),
    }


def _fallback_nlp_analysis(report_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generates structured AI analysis using the built-in SIF engine."""
    narrative = report_data.get("narrative") or report_data.get("text") or ""
    rep_input = ReportInput(
        report_id=report_data.get("report_id"),
        report_type=report_data.get("report_type") or "near_miss",
        text=narrative,
        site=report_data.get("site"),
        location=report_data.get("location"),
        activity=report_data.get("activity"),
        metadata={
            "person_type": report_data.get("person_type") or report_data.get("contractor_type"),
            "immediate_cause": report_data.get("immediate_cause"),
            "contributing_factors": report_data.get("contributing_factors"),
            "corrective_action": report_data.get("corrective_action"),
        }
    )
    res = heuristic_analyze(rep_input)

    lsr_map = {
        "Energy Isolation": "Energy Isolation",
        "Line of Fire": "Line of Fire",
        "Hot Work": "Hot Work",
        "Confined Space": "Confined Space",
        "Work at Height": "Working at Height",
        "Lifting": "Safe Mechanical Lifting"
    }
    mapped_lsr = lsr_map.get(res.life_saving_rule, "Work Authorisation")

    return {
        "sif_potential": res.sif_potential,
        "confidence": res.confidence,
        "priority": res.priority,
        "life_saving_rules": [
            {
                "rule": mapped_lsr,
                "confidence": res.rule_confidence
            }
        ],
        "activity": res.activity,
        "hazards": res.hazards or ["Operating hazard"],
        "precursors": res.precursors or ["Precursor signal detected"],
        "barrier_failures": res.barrier_failures or ["Control verification gap"],
        "exposure": res.exposure or [report_data.get("person_type") or "Technician"],
        "evidence": [s.evidence for s in res.signals[:2]] or [narrative[:80]],
        "explanation": res.explanation
    }
