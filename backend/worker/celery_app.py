import os
from celery import Celery
import time

broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

celery = Celery(
    "fraud_worker",
    broker=broker_url,
    backend=result_backend
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery.task(name="process_batch_csv")
def process_batch_csv(file_path: str, user_id: int):
    """
    Simulates processing a batch CSV of transactions.
    In a real-world scenario, this would load the CSV with pandas,
    run it through the prediction_service, and save all results to the DB.
    """
    # Dummy processing time
    time.sleep(5)
    return {"status": "completed", "processed_records": 100, "fraud_detected": 3}
