# Enterprise AI Financial Fraud Detection Platform

A production-ready full-stack AI platform for detecting fraudulent financial transactions in real-time. Built with a modern microservices architecture, this project demonstrates advanced MLOps practices, explainable AI, and enterprise-grade software engineering.

## Features

- **Real-Time Fraud Detection API**: FastAPI backend providing low-latency predictions using Scikit-Learn (Decision Tree / XGBoost).
- **Explainable AI (XAI)**: Integrated SHAP values to explain the reasoning behind every fraud prediction, fostering transparency and trust.
- **Premium User Interface**: React + Vite frontend styled with Tailwind CSS and Framer Motion, utilizing a modern glassmorphism dark theme.
- **Interactive Dashboards**: Live visualizations with Recharts for transaction volumes, fraud rates, and model performance.
- **Background Processing**: Celery & Redis integration for processing batch predictions asynchronously.
- **Secure Authentication**: JWT-based secure login system with robust password hashing (bcrypt).
- **Relational Database**: PostgreSQL integration with SQLAlchemy ORM and Alembic migrations.

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, Celery, Pytest
- **Machine Learning**: Scikit-Learn, SHAP, Joblib, Pandas, Numpy
- **Infrastructure**: Docker, Docker Compose, PostgreSQL, Redis

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose

### Quick Start (Docker)

The entire platform is containerized for a seamless setup.

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohith-chitturi/AI-Fraud-Detection.git
   cd AI-Fraud-Detection
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**
   - **Frontend UI**: `http://localhost:5175`
   - **Backend API Docs**: `http://localhost:8000/docs`
   - **PostgreSQL**: `localhost:5432`
   - **Redis**: `localhost:6379`

### Default Credentials
- **Email**: admin@fraudguard.com
- **Password**: admin

## Local Development (Without Docker)

### Backend
1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r backend/requirements.txt
   ```
2. Start Redis and PostgreSQL locally, then configure `.env`.
3. Start the FastAPI server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```

## Machine Learning Pipeline

The `/ml` directory contains the data generation and training scripts. To train a new model:

```bash
python ml/train.py
```
This will automatically evaluate multiple models (Logistic Regression, Decision Tree, Random Forest, Isolation Forest, XGBoost), select the best performer based on the F1-score, and serialize it to the `/models` directory for the backend to use.

## License
MIT License.
