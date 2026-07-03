import os
import joblib
import pandas as pd
from ml.data_loader import DataLoader
from ml.models import get_models
from ml.evaluate import evaluate_model
import json

def train_and_evaluate(data_path="datasets/fraud_data.csv", models_dir="models"):
    """
    Trains models, evaluates them, selects the best, and saves it.
    """
    if not os.path.exists(data_path):
        print(f"Data file {data_path} not found. Please run the data generator.")
        return

    loader = DataLoader(data_path)
    X_train, X_test, y_train, y_test = loader.get_train_test_split()
    
    models = get_models()
    results = {}
    
    best_model_name = None
    best_score = -1
    best_model = None

    os.makedirs(models_dir, exist_ok=True)
    
    for name, model in models.items():
        print(f"Training {name}...")
        
        if name == "Isolation Forest":
            # Isolation forest is unsupervised anomaly detection
            model.fit(X_train)
            # Predict returns 1 for inliers, -1 for outliers. We map -1 to 1 (fraud) and 1 to 0 (legit)
            y_pred_raw = model.predict(X_test)
            y_pred = [1 if x == -1 else 0 for x in y_pred_raw]
            # Fake probabilities for consistency in API
            y_prob = None 
        else:
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            if hasattr(model, "predict_proba"):
                y_prob = model.predict_proba(X_test)[:, 1]
            elif hasattr(model, "decision_function"):
                y_prob = model.decision_function(X_test)
            else:
                y_prob = None
                
        metrics = evaluate_model(name, y_test, y_pred, y_prob)
        results[name] = metrics
        print(f"{name} Metrics: {metrics}")
        
        # Selection logic: prioritize F1, then ROC AUC
        f1 = metrics["F1 Score"]
        if f1 > best_score:
            best_score = f1
            best_model_name = name
            best_model = model
            
    print(f"\nBest Model: {best_model_name} with F1: {best_score}")
    
    # Save best model and scaler
    model_path = os.path.join(models_dir, "best_model.joblib")
    scaler_path = os.path.join(models_dir, "scaler.joblib")
    
    joblib.dump(best_model, model_path)
    joblib.dump(loader.scaler, scaler_path)
    print(f"Saved {best_model_name} to {model_path}")
    
    # Save metadata
    metadata = {
        "best_model": best_model_name,
        "metrics": results[best_model_name],
        "all_results": results
    }
    with open(os.path.join(models_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=4)

if __name__ == "__main__":
    train_and_evaluate()
