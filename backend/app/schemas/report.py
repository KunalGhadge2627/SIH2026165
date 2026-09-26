from datetime import datetime
from typing import Any, Literal, List, Optional
from pydantic import BaseModel, Field

class ReportInput(BaseModel):
    report_id: Optional[str] = None
    report_type: str = "near_miss"
    site: Optional[str] = "Duliajan"
    date: Optional[str] = None
    activity: Optional[str] = "General Operations"
    narrative: Optional[str] = None
    text: Optional[str] = None
    location: Optional[str] = "Process Site"
    person_type: Optional[str] = "Contractor"
    immediate_cause: Optional[str] = None
    contributing_factors: Optional[str] = None
    corrective_action: Optional[str] = None
    reported_at: Optional[datetime] = None
    metadata: dict[str, Any] = Field(default_factory=dict)

class LsrConfidence(BaseModel):
    rule: str
    confidence: float

class StructuredAiAnalysis(BaseModel):
    sif_potential: bool
    confidence: float
    priority: Literal["Low", "Medium", "High", "Critical"]
    life_saving_rules: List[LsrConfidence]
    activity: str
    hazards: List[str]
    precursors: List[str]
    barrier_failures: List[str]
    exposure: List[str]
    evidence: List[str]
    explanation: str

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
