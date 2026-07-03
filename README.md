# AI Financial Fraud Detection Platform

An enterprise-grade, full-stack AI Financial Fraud Detection Platform designed for real-time anomaly detection, machine learning observability, and Explainable AI (XAI).

## Features
- **Real-Time Fraud Detection**: Identify fraudulent transactions instantly.
- **Explainable AI (SHAP)**: Understand exactly *why* a transaction was flagged.
- **Batch Processing**: Upload CSVs for bulk predictions using background workers.
- **Interactive Dashboards**: Monitor model performance, feature importance, and fraud trends in real-time.
- **Robust MLOps**: Model versioning, hyperparameter tuning, and seamless retraining capabilities.
- **Microservices Architecture**: Containerized setup with React, FastAPI, PostgreSQL, Redis, and Celery.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic
- **Machine Learning**: Scikit-learn, XGBoost, Random Forest, Isolation Forest, SHAP
- **Infrastructure**: PostgreSQL, Redis, Celery, Docker, Docker Compose
- **CI/CD**: GitHub Actions

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Financial-Fraud-detection
   ```

2. **Run with Docker Compose**
   ```bash
   docker compose up --build
   ```

3. **Access the Services**
   - Frontend Dashboard: `http://localhost:5173`
   - Backend API Docs: `http://localhost:8000/docs`

## Architecture
See `docs/architecture.md` for full system design diagrams and details.

## License
MIT License
