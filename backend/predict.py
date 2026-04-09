import pandas as pd
import pickle
import os

def predict_fraud(transaction_data, model_path='models/saved/random_forest.pkl'):
    """
    Predicts fraud probability for a single transaction.
    Expects input dictionary format.
    """
    print("\n--- Fraud Prediction Logic ---")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found: {model_path}. Please train models first.")
        
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
        
    # Convert input to DataFrame
    df_input = pd.DataFrame([transaction_data])
    
    # Preprocessing (simplified for demo)
    # Note: In a real system, we'd use the same LabelEncoders and Scalers saved during training.
    # For now, we assume the input is already similar or we'd map it.
    
    # Prediction
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(df_input)[0][1]
    else:
        prob = model.predict(df_input)[0]
        
    return prob

if __name__ == "__main__":
    # Example input (Requires features used in training)
    example_tx = {
        'amount': 500.0,
        'spending_deviation_score': 0.8,
        'velocity_score': 0.5,
        'geo_anomaly_score': 0.2,
        'hour': 3, # 3 AM
        'is_night': 1,
        'node_degree': 10,
        'clustering_coeff': 0.4,
        'neighbor_fraud_ratio': 0.1,
        'user_transaction_count': 5,
        'user_avg_amount': 200.0,
        'amount_diff_from_avg': 300.0,
        'ip_transaction_count': 2,
        'component_size': 15,
        'device_used': 1, # Encoded value
        'location': 5, # Encoded value
        'payment_channel': 2, # Encoded value
        'transaction_type': 0, # Encoded value
        'merchant_category': 3, # Encoded value
        'day_of_week': 0, # Monday
    }
    
    # probability = predict_fraud(example_tx)
    # print(f"Predicted Fraud Probability: {probability:.2%}")
