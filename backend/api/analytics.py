from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.db.session import get_db
from backend.db.models import User, Prediction
from backend.core.security import get_current_user

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only their own stats if analyst, but let's just show global for simplicity in this demo,
    # or per-user. The requirements say "Analytics Dashboard", so let's do global if admin, else personal.
    query = db.query(Prediction)
    if not current_user.is_admin:
        query = query.filter(Prediction.owner_id == current_user.id)
        
    total_transactions = query.count()
    fraud_transactions = query.filter(Prediction.is_fraud == True).count()
    
    fraud_percentage = (fraud_transactions / total_transactions * 100) if total_transactions > 0 else 0
    
    return {
        "total_transactions": total_transactions,
        "fraud_transactions": fraud_transactions,
        "fraud_percentage": round(fraud_percentage, 2)
    }

@router.get("/model-info")
def get_model_info():
    import json
    import os
    
    possible_paths = ["models", "../models", "/app/models"]
    for p in possible_paths:
        metadata_path = os.path.join(p, "metadata.json")
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as f:
                return json.load(f)
                
    return {"message": "Model metadata not found"}
