import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

def preprocess_data(df, scaler=None):
    """
    Cleans and prepares the data for feature engineering.
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
    le = LabelEncoder()
    for col in categorical_cols:
        if col in df.columns:
            df[col] = le.fit_transform(df[col].astype(str))
            
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
                # To avoid warning, we do not suppress it but StandardScaler handles DataFrame gracefully
                df[col] = col_scaler.fit_transform(df[[col]])
                scaler[col] = col_scaler
        return df, scaler
    else:
        # Use existing scaler for prediction
        # Check if scaler is a dict (the new way) or single scaler (the old bugged way)
        is_dict = isinstance(scaler, dict)
        for col in numerical_cols:
            if col in df.columns:
                if is_dict and col in scaler:
                    df[col] = scaler[col].transform(df[[col]])
                elif not is_dict:
                    # Fallback for old single scaler if it somehow matches
                    try:
                        df[col] = scaler.transform(df[[col]])
                    except Exception:
                        pass
        return df

if __name__ == "__main__":
    from data.ingestion import load_data
    DATA_PATH = "financial_fraud_detection_dataset.csv"
    df = load_data(DATA_PATH, sample_size=1000)
    df_clean = preprocess_data(df)
    print("\nPreprocessed Data Sample:")
    print(df_clean.head())
