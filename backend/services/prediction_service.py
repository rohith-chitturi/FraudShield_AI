import os
import joblib
import pandas as pd
import numpy as np
from schemas.prediction import PredictionRequest
import json
import shap

# Note: this module needs to access the ml package or at least the SHAP explain logic.
# To keep backend independent from training environment, we implement a lightweight explainer here.

class PredictionService:
    def __init__(self):
        # Look for models directory
        possible_paths = ["models", "../models", "/app/models"]
        self.models_dir = None
        for p in possible_paths:
            if os.path.exists(p) and os.path.exists(os.path.join(p, "best_model.joblib")):
                self.models_dir = p
                break
                
        if not self.models_dir:
            print("Warning: Models not found. Model inference will not work.")
            self.model = None
            self.scaler = None
            self.explainer = None
            return

        print(f"Loading models from {self.models_dir}")
        self.model = joblib.load(os.path.join(self.models_dir, "best_model.joblib"))
        self.scaler = joblib.load(os.path.join(self.models_dir, "scaler.joblib"))
        
        # Load background data for SHAP (we'll just use a small zero array if none available, 
        # but TreeExplainer doesn't strictly need background data for marginal contribution)
        model_type = type(self.model).__name__
        if model_type in ["RandomForestClassifier", "DecisionTreeClassifier", "XGBClassifier", "LGBMClassifier"]:
            self.explainer = shap.TreeExplainer(self.model)
        else:
            # For non-tree, we fallback to exact explainer or skip if too slow
            self.explainer = None
            
        # Feature names in exact order
        self.feature_names = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount", "Lat", "Lon"]

    def _determine_risk_level(self, probability: float) -> str:
        if probability >= 0.8: return "Critical"
        if probability >= 0.5: return "High"
        if probability >= 0.2: return "Medium"
        return "Low"

    def predict(self, req: PredictionRequest):
        if not self.model:
            raise ValueError("Model is not loaded.")
            
        # Convert request to dataframe
        req_dict = req.dict()
        df = pd.DataFrame([req_dict])[self.feature_names]
        
        # Scale
        cols_to_scale = ['Time', 'Amount']
        df[cols_to_scale] = self.scaler.transform(df[cols_to_scale])
        
        # Predict
        if hasattr(self.model, "predict_proba"):
            prob = self.model.predict_proba(df)[0][1]
        elif hasattr(self.model, "decision_function"):
            prob = self.model.decision_function(df)[0]
            # normalize to 0-1 loosely if it's decision function
            prob = 1 / (1 + np.exp(-prob)) 
        else:
            # Isolation forest mapping
            pred = self.model.predict(df)[0]
            prob = 1.0 if pred == -1 else 0.0

        is_fraud = bool(prob >= 0.5)
        risk_level = self._determine_risk_level(prob)
        
        # Explain
        shap_explanation = None
        if self.explainer:
            try:
                shap_values = self.explainer.shap_values(df)
                if isinstance(shap_values, list):
                    shap_values = shap_values[1] # positive class
                    
                expected_value = self.explainer.expected_value
                if isinstance(expected_value, (list, np.ndarray)):
                    expected_value = expected_value[1]
                    
                contributions = []
                for i, feature in enumerate(self.feature_names):
                    val = float(shap_values[0][i])
                    # Original value (unscaled for display)
                    orig_val = req_dict[feature]
                    contributions.append({
                        "feature": feature,
                        "value": float(orig_val),
                        "contribution": val,
                        "type": "positive" if val > 0 else "negative"
                    })
                    
                contributions.sort(key=lambda x: abs(x["contribution"]), reverse=True)
                
                shap_explanation = {
                    "expected_value": float(expected_value),
                    "contributions": contributions,
                    "top_positive": [c for c in contributions if c["type"] == "positive"][:3],
                    "top_negative": [c for c in contributions if c["type"] == "negative"][:3],
                }
            except Exception as e:
                print(f"Failed to generate SHAP explanation: {e}")
                
        return {
            "is_fraud": is_fraud,
            "fraud_probability": float(prob),
            "risk_level": risk_level,
            "shap_explanation": shap_explanation
        }

# Singleton instance
prediction_service = PredictionService()
