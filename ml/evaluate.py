import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, precision_recall_curve, roc_curve
)

def evaluate_model(model_name, y_true, y_pred, y_prob=None):
    """
    Evaluates a model and returns a dictionary of metrics.
    """
    metrics = {
        "Accuracy": accuracy_score(y_true, y_pred),
        "Precision": precision_score(y_true, y_pred, zero_division=0),
        "Recall": recall_score(y_true, y_pred, zero_division=0),
        "F1 Score": f1_score(y_true, y_pred, zero_division=0),
    }
    
    if y_prob is not None:
        metrics["ROC AUC"] = roc_auc_score(y_true, y_prob)
    else:
        metrics["ROC AUC"] = None
        
    cm = confusion_matrix(y_true, y_pred)
    metrics["Confusion Matrix"] = cm.tolist()
    
    return metrics
