from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, Field

class ReportInput(BaseModel):
    report_id: str | None = None
    report_type: Literal["unsafe_act", "unsafe_condition", "near_miss", "incident", "observation"] = "near_miss"
    text: str = Field(min_length=10)
    site: str | None = None
    location: str | None = None
    activity: str | None = None
    reported_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

class RiskSignal(BaseModel):
    category: str
    signal: str
    evidence: str
    weight: float

class AnalysisResult(BaseModel):
    report_id: str
    sif_potential: bool
    confidence: float = Field(ge=0, le=1)
    priority: Literal["Low", "Medium", "High", "Critical"]
    life_saving_rule: str
    rule_confidence: float = Field(ge=0, le=1)
    activity: str
    hazards: list[str]
    precursors: list[str]
    barrier_failures: list[str]
    exposure: list[str]
    signals: list[RiskSignal]
    explanation: str
    model_version: str
    analyzed_at: datetime

class Pattern(BaseModel):
    pattern_id: str
    activity: str
    barrier_failure: str
    life_saving_rule: str
    report_count: int
    sif_count: int
    sif_density: float
    sites: list[str]
