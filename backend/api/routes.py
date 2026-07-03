from fastapi import APIRouter
from api import auth, predict, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(predict.router, prefix="/predict", tags=["prediction"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
