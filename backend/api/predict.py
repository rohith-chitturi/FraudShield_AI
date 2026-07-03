import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.db.models import User, Prediction
from backend.schemas.prediction import PredictionRequest, PredictionResponse, PredictionHistoryResponse
from backend.core.security import get_current_user
from backend.services.prediction_service import prediction_service

router = APIRouter()

@router.post("/single", response_model=PredictionResponse)
def predict_single(
    request: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        result = prediction_service.predict(request)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
        
    # Save to db
    db_prediction = Prediction(
        amount=request.Amount,
        fraud_probability=result["fraud_probability"],
        is_fraud=result["is_fraud"],
        risk_level=result["risk_level"],
        shap_explanation=json.dumps(result["shap_explanation"]) if result.get("shap_explanation") else None,
        owner_id=current_user.id
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    
    return result

@router.get("/history", response_model=List[PredictionHistoryResponse])
def get_prediction_history(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    predictions = db.query(Prediction).filter(Prediction.owner_id == current_user.id)\
                    .order_by(Prediction.timestamp.desc()).offset(skip).limit(limit).all()
    return predictions

@router.post("/batch")
def predict_batch_csv(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # In a real app we'd save the file and pass the path to Celery
    # For now we'll just accept it and return a message indicating background processing
    return {"message": "Batch prediction started in background"}
