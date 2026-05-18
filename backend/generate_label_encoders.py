"""
Quick script to generate label_encoders.pkl from the dataset
without re-running the full training pipeline.
"""
import pandas as pd
import pickle
import os
from sklearn.preprocessing import LabelEncoder

data_path = os.path.join(os.path.dirname(__file__), "financial_fraud_detection_dataset.csv")
save_path = os.path.join(os.path.dirname(__file__), "models", "saved", "label_encoders.pkl")

print(f"[*] Loading dataset: {data_path}")
df = pd.read_csv(data_path, nrows=150000)
df = df.ffill().bfill().fillna(0)

categorical_cols = ['device_used', 'location', 'payment_channel', 'transaction_type', 'merchant_category']
label_encoders = {}

for col in categorical_cols:
    if col in df.columns:
        le = LabelEncoder()
        le.fit(df[col].astype(str))
        label_encoders[col] = le
        print(f"  [+] {col}: {len(le.classes_)} classes -> {list(le.classes_[:5])}{'...' if len(le.classes_) > 5 else ''}")

with open(save_path, 'wb') as f:
    pickle.dump(label_encoders, f)

print(f"\n[+] Saved label_encoders.pkl with {len(label_encoders)} encoders to {save_path}")
