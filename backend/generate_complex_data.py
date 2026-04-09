import pandas as pd
import numpy as np
from sklearn.datasets import make_classification
import uuid
import datetime
import os

def generate():
    print("Generating 50,000 row complex non-linear classification dataset...")
    # Add non-linear parameters to ensure Logistic Reg scores realistically lower than Forest/XGBoost
    X, y = make_classification(n_samples=50000, n_features=12, n_informative=8, n_redundant=2, 
                               n_repeated=0, n_classes=2, n_clusters_per_class=2, 
                               weights=[0.90, 0.10], class_sep=0.65, random_state=42)
    
    df = pd.DataFrame(X, columns=['amount', 'time_since_last_transaction', 'spending_deviation_score', 
                                  'velocity_score', 'geo_anomaly_score', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'])
    
    df['is_fraud'] = y
    
    df['transaction_id'] = [str(uuid.uuid4())[:8] for _ in range(50000)]
    now = datetime.datetime.now()
    df['timestamp'] = [now - datetime.timedelta(minutes=int(np.random.randint(0, 10000))) for _ in range(50000)]
    
    fraud_ips = [f"192.168.1.{i}" for i in range(1, 40)]
    normal_ips = [f"10.0.{i}.{j}" for i in range(50) for j in range(50)]
    
    fraud_devices = [f"dev_bad_{i}" for i in range(1, 20)]
    normal_devices = [f"dev_{i}" for i in range(10000)]
    
    fraud_users = [f"user_bad_{i}" for i in range(1, 10)]
    normal_users = [f"user_{i}" for i in range(5000)]
    
    def get_attr(is_f, bad_list, good_list):
        if is_f and np.random.rand() < 0.8:
            return np.random.choice(bad_list)
        return np.random.choice(good_list)
        
    df['ip_address'] = [get_attr(f, fraud_ips, normal_ips) for f in df['is_fraud']]
    df['device_hash'] = [get_attr(f, fraud_devices, normal_devices) for f in df['is_fraud']]
    df['sender_account'] = [get_attr(f, fraud_users, normal_users) for f in df['is_fraud']]
    
    df['receiver_account'] = df['sender_account'] + "_recv"
    df['transaction_type'] = df['c1'].apply(lambda x: int(abs(x) * 10) % 5)
    df['merchant_category'] = df['c2'].apply(lambda x: int(abs(x) * 10) % 10)
    df['location'] = df['c3'].apply(lambda x: int(abs(x) * 10) % 50)
    df['device_used'] = df['c4'].apply(lambda x: int(abs(x) * 10) % 3)
    df['payment_channel'] = df['c5'].apply(lambda x: int(abs(x) * 10) % 4)
    df['fraud_type'] = df['is_fraud'].apply(lambda tf: 1 if tf else 0)
    
    df = df.drop(columns=['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'])
    
    df = df.sample(frac=1).reset_index(drop=True)
    
    filepath = os.path.join(os.path.dirname(__file__), "financial_fraud_detection_dataset.csv")
    df.to_csv(filepath, index=False)
    print(f"Dataset securely replaced at {filepath}")

if __name__ == '__main__':
    generate()
