from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class FeatureContribution(BaseModel):
    feature: str
    value: float
    contribution: float
    type: str

class SHAPExplanation(BaseModel):
    expected_value: float
    contributions: List[FeatureContribution]
    top_positive: List[FeatureContribution]
    top_negative: List[FeatureContribution]

class PredictionRequest(BaseModel):
    Time: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float
    Lat: float
    Lon: float

class PredictionResponse(BaseModel):
    is_fraud: bool
    fraud_probability: float
    risk_level: str
    shap_explanation: Optional[SHAPExplanation] = None

class PredictionHistoryResponse(BaseModel):
    id: int
    timestamp: datetime
    amount: float
    is_fraud: bool
    fraud_probability: float
    risk_level: str
    shap_explanation: Optional[str] = None
    
    class Config:
        from_attributes = True
