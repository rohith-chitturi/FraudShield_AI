import shap
import pandas as pd
import numpy as np

class Explainer:
    def __init__(self, model, X_background):
        """
        Initializes the SHAP explainer.
        Uses TreeExplainer for tree-based models, and KernelExplainer/LinearExplainer for others.
        """
        self.model = model
        model_type = type(model).__name__
        
        if model_type in ["RandomForestClassifier", "DecisionTreeClassifier", "XGBClassifier", "LGBMClassifier", "IsolationForest"]:
            self.explainer = shap.TreeExplainer(model)
        else:
            # Fallback to KernelExplainer for non-tree models
            # We use a summary of the background dataset to speed it up
            background = shap.kmeans(X_background, 10)
            self.explainer = shap.KernelExplainer(model.predict_proba, background)

    def explain_instance(self, instance, feature_names):
        """
        Generates SHAP values for a single instance.
        """
        # Ensure instance is a DataFrame/2D array
        if isinstance(instance, pd.Series):
            instance = pd.DataFrame([instance])
        elif isinstance(instance, np.ndarray) and instance.ndim == 1:
            instance = instance.reshape(1, -1)
            
        shap_values = self.explainer.shap_values(instance)
        
        # TreeExplainer for classification often returns a list of shap values (one for each class)
        # We want the values for the positive class (class 1 - Fraud)
        if isinstance(shap_values, list):
            shap_values = shap_values[1]
            
        # Get expected value (base value)
        expected_value = self.explainer.expected_value
        if isinstance(expected_value, (list, np.ndarray)):
            expected_value = expected_value[1]
            
        # Format the output
        contributions = []
        for i, feature in enumerate(feature_names):
            val = float(shap_values[0][i])
            contributions.append({
                "feature": feature,
                "value": float(instance[0][i]) if isinstance(instance, np.ndarray) else float(instance.iloc[0, i]),
                "contribution": val,
                "type": "positive" if val > 0 else "negative"
            })
            
        # Sort by absolute contribution descending
        contributions.sort(key=lambda x: abs(x["contribution"]), reverse=True)
        
        return {
            "expected_value": float(expected_value),
            "contributions": contributions,
            "top_positive": [c for c in contributions if c["type"] == "positive"][:3],
            "top_negative": [c for c in contributions if c["type"] == "negative"][:3],
        }
