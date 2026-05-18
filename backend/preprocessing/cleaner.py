import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

def preprocess_data(df, scaler=None, label_encoders=None):
    """
    Cleans and prepares the data for feature engineering.
    Returns (df, scaler, label_encoders) on first run (training).
    Returns df on subsequent runs (prediction with existing scaler/encoders).
    """
    print("\n--- Preprocessing Data ---")
    
    # Copy to avoid modifying original
    df = df.copy()
    
    # 1. Handling Missing Values
    df = df.ffill().bfill().fillna(0)
    
    # 2. Convert Timestamp
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # 3. Categorical Encoding (Label Encoding)
    categorical_cols = ['device_used', 'location', 'payment_channel', 'transaction_type', 'merchant_category']
    
    if label_encoders is None:
        # Training mode: fit new encoders and save them
        label_encoders = {}
        for col in categorical_cols:
            if col in df.columns:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
                label_encoders[col] = le
        print(f"  [Preprocess] Fitted {len(label_encoders)} label encoders: {list(label_encoders.keys())}")
    else:
        # Prediction mode: use existing encoders
        for col in categorical_cols:
            if col in df.columns and col in label_encoders:
                le = label_encoders[col]
                # Handle unseen labels gracefully — map unknowns to 0
                known = set(le.classes_)
                df[col] = df[col].astype(str).apply(
                    lambda x: le.transform([x])[0] if x in known else 0
                )
        print(f"  [Preprocess] Applied {len(label_encoders)} saved label encoders")
            
    # 4. Numerical Normalization/Scaling
    numerical_cols = [
        'amount', 'spending_deviation_score', 'velocity_score', 
        'geo_anomaly_score', 'time_since_last_transaction'
    ]
    
    if scaler is None:
        scaler = {}
        for col in numerical_cols:
            if col in df.columns:
                col_scaler = StandardScaler()
                df[col] = col_scaler.fit_transform(df[[col]])
                scaler[col] = col_scaler
        print(f"  [Preprocess] Fitted {len(scaler)} scalers: {list(scaler.keys())}")
        return df, scaler, label_encoders
    else:
        # Use existing scaler for prediction
        is_dict = isinstance(scaler, dict)
        for col in numerical_cols:
            if col in df.columns:
                if is_dict and col in scaler:
                    df[col] = scaler[col].transform(df[[col]])
                elif not is_dict:
                    try:
                        df[col] = scaler.transform(df[[col]])
                    except Exception:
                        pass
        print(f"  [Preprocess] Applied saved scalers")
        return df

if __name__ == "__main__":
    from data.ingestion import load_data
    DATA_PATH = "financial_fraud_detection_dataset.csv"
    df = load_data(DATA_PATH, sample_size=1000)
    df_clean, scaler, encoders = preprocess_data(df)
    print("\nPreprocessed Data Sample:")
    print(df_clean.head())
    print(f"\nLabel Encoders: {list(encoders.keys())}")
    print(f"Scalers: {list(scaler.keys())}")
