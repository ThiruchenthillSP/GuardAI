import pandas as pd
import os

def load_data(file_path, sample_size=None):
    """
    Loads the dataset and provides a summary.
    """
    print(f"--- Loading Data from {file_path} ---")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Reading sample or full dataset
    if sample_size:
        print(f"Reading first {sample_size} rows...")
        df = pd.read_csv(file_path, nrows=sample_size)
    else:
        print("Reading full dataset...")
        df = pd.read_csv(file_path)
    
    # Display Basic Info
    print("\n--- Dataset Summary ---")
    print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")
    
    print("\n--- Missing Values ---")
    missing = df.isnull().sum()
    print(missing[missing > 0] if not missing[missing > 0].empty else "No missing values.")
    
    print("\n--- Class Distribution (Target: is_fraud) ---")
    if 'is_fraud' in df.columns:
        counts = df['is_fraud'].value_counts()
        print(counts)
        print(f"Fraud Ratio: {df['is_fraud'].mean():.2%}")
    else:
        print("Warning: 'is_fraud' column not found in dataset.")
        
    return df

if __name__ == "__main__":
    # Test loading
    DATA_PATH = "financial_fraud_detection_dataset.csv"
    df = load_data(DATA_PATH, sample_size=10000)
    print("\nFirst 5 rows:")
    print(df.head())
