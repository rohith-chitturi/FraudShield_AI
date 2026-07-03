FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# SHAP often requires specific numpy versions or C extensions
# For XGBoost and LightGBM we need some system libs sometimes, but slim should work mostly
# We copy the rest of the code as mounted volume in dev, but for prod we would COPY . .

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
