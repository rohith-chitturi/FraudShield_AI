import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_synthetic_fraud_data(num_samples=10000, fraud_ratio=0.05, output_path="datasets/fraud_data.csv"):
    """
    Generates a synthetic financial fraud dataset.
    Features:
    - Time: Seconds elapsed between this transaction and the first transaction in the dataset
    - V1..V28: PCA-like anonymized features
    - Amount: Transaction amount
    - Lat, Lon: Simulated geographical coordinates
    - Class: 1 for fraudulent transactions, 0 otherwise
    """
    np.random.seed(42)
    
    num_fraud = int(num_samples * fraud_ratio)
    num_legit = num_samples - num_fraud
    
    # Generate Time (sequential over 2 days)
    total_seconds = 48 * 3600
    time = np.sort(np.random.randint(0, total_seconds, num_samples))
    
    # Generate PCA features (V1-V28)
    # Legitimate transactions: Normal distribution
    v_legit = np.random.randn(num_legit, 28)
    # Fraudulent transactions: Shifted distribution
    v_fraud = np.random.randn(num_fraud, 28) + np.random.uniform(1, 3, size=(num_fraud, 28)) * np.random.choice([-1, 1], size=(num_fraud, 28))
    
    V = np.vstack((v_legit, v_fraud))
    
    # Amount
    amount_legit = np.random.lognormal(mean=3, sigma=1, size=num_legit)
    amount_fraud = np.random.lognormal(mean=5, sigma=1.5, size=num_fraud)
    amount = np.concatenate((amount_legit, amount_fraud))
    
    # Lat/Lon (Simulate US bounding box: Lat 24-49, Lon -125 to -66)
    lat = np.random.uniform(24, 49, num_samples)
    lon = np.random.uniform(-125, -66, num_samples)
    
    # Class
    labels = np.concatenate((np.zeros(num_legit), np.ones(num_fraud)))
    
    # Combine and shuffle
    data = np.column_stack((time, V, amount, lat, lon, labels))
    np.random.shuffle(data)
    
    columns = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount", "Lat", "Lon", "Class"]
    df = pd.DataFrame(data, columns=columns)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated synthetic dataset with {num_samples} samples ({num_fraud} fraud) at {output_path}")

if __name__ == "__main__":
    generate_synthetic_fraud_data(num_samples=25000, fraud_ratio=0.03)
