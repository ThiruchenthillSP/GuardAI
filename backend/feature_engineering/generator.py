import pandas as pd
import numpy as np

def generate_features(df):
    """
    Creates advanced features for fraud detection.
    """
    print("\n--- Generating Features ---")
    
    # 1. Time Features (Important for finding unusual transaction patterns)
    if 'timestamp' in df.columns:
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['is_night'] = df['hour'].apply(lambda x: 1 if x > 22 or x < 6 else 0)
        print("Generated time features: hour, day_of_week, is_night.")
        
    # 2. Behavioral & Risk Features
    if 'sender_account' in df.columns:
        # Number of distinct devices used per account (High count = suspicious)
        df['devices_per_account'] = df.groupby('sender_account')['device_hash'].transform('nunique')
        # Number of distinct IPs used per account
        df['ips_per_account'] = df.groupby('sender_account')['ip_address'].transform('nunique')
        
        df['user_avg_amount'] = df.groupby('sender_account')['amount'].transform('mean')
        df['amount_deviation'] = (df['amount'] - df['user_avg_amount']).abs()
        print("Generated risk features: devices_per_account, ips_per_account, amount_deviation.")
        
    # 3. Velocity & Anomaly Features
    if 'ip_address' in df.columns:
        df['ip_velocity'] = df.groupby('ip_address')['transaction_id'].transform('count')
        print("Generated velocity features: ip_velocity.")
        
    return df

if __name__ == "__main__":
    from data.ingestion import load_data
    from preprocessing.cleaner import preprocess_data
    DATA_PATH = "financial_fraud_detection_dataset.csv"
    df = load_data(DATA_PATH, sample_size=1000)
    df = preprocess_data(df)
    df_feat = generate_features(df)
    print("\nFeatured Data Sample:")
    print(df_feat[['hour', 'is_night', 'user_transaction_count', 'amount_diff_from_avg']].head())
