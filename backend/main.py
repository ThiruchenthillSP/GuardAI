from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
import pickle
import pandas as pd
import datetime
import shap
import numpy as np

# Import DB and ML logic
from database import get_db, Transaction, User
from data.ingestion import load_data
from preprocessing.cleaner import preprocess_data
from feature_engineering.generator import generate_features
from graph.constructor import build_graph
from graph.extractor import extract_graph_features
from models.trainer import train_models, save_models

# New GNN logic
from models.gnn import SimpleGCN, train_gnn, save_gnn_model
from graph.gnn_utils import convert_to_gnn_data, get_graph_for_ui

app = FastAPI(title="Fraud Detection API", version="1.0.0")

# CORS middleware for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class TransactionInput(BaseModel):
    transaction_id: str
    sender_account: str
    receiver_account: str
    amount: float
    transaction_type: str
    location: str
    device_used: str
    ip_address: str
    device_hash: str

class PredictionResponse(BaseModel):
    transaction_id: str
    is_fraud: bool
    probability: float
    risk_level: str
    explanation: Optional[dict] = None

# --- Global Neural Engine State ---
model_state = {
    'xgb': None,
    'explainer': None,
    'scaler': None,
    'gnn': None
}

def load_system():
    """Load neural models and normalization scalers from disk."""
    try:
        save_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "models/saved"))
        xgb_path = os.path.join(save_dir, "xgboost.pkl")
        explainer_path = os.path.join(save_dir, "shap_explainer.pkl")
        scaler_path = os.path.join(save_dir, "scaler.pkl")
        
        if os.path.exists(xgb_path):
            with open(xgb_path, 'rb') as f:
                model_state['xgb'] = pickle.load(f)
        if os.path.exists(explainer_path):
            with open(explainer_path, 'rb') as f:
                model_state['explainer'] = pickle.load(f)
        if os.path.exists(scaler_path):
            with open(scaler_path, 'rb') as f:
                model_state['scaler'] = pickle.load(f)
        
        # Load GNN
        gnn_path = os.path.join(save_dir, "gnn_model.pth")
        if os.path.exists(gnn_path):
            import torch
            # We assume 8 features as defined in gnn_utils.py
            model_state['gnn'] = SimpleGCN(num_node_features=8)
            model_state['gnn'].load_state_dict(torch.load(gnn_path, map_location='cpu'))
            model_state['gnn'].eval()
            print("[+] GNN Model Loaded: Neural Network Active.")

        print("[+] Neural Engine Loaded: Models & Scalers Active.")
    except Exception as e:
        print(f"[-] Warning: Neural engine load failed: {e}")

# Initial boot load
load_system()

# --- Endpoints ---

@app.get("/")
def home():
    return {"message": "Fraud Detection API is running."}

@app.post("/predict", response_model=PredictionResponse)
def predict(data: TransactionInput, db: Session = Depends(get_db)):
    """
    Advanced prediction with SHAP XAI and Research-Grade feature extraction.
    """
    try:
        # 1. Check Model Availability
        if model_state['xgb'] is None:
            load_system() # Try one last reload
            if model_state['xgb'] is None:
                raise HTTPException(status_code=500, detail="Models not found. Please click 'Initialize / Train Model' first.")
            
        model = model_state['xgb']
        explainer = model_state['explainer']
        scaler = model_state['scaler']
            
        # 2. Extract Features
        input_dict = data.dict()
        df_input = pd.DataFrame([input_dict])
        
        # Apply normalization using the training-time scaler
        df_clean = preprocess_data(df_input, scaler=scaler)
        df_feat = generate_features(df_clean)
        
        # Define predictive features
        predictive_cols = [
            'amount', 'transaction_type', 'merchant_category', 'location', 'device_used', 
            'time_since_last_transaction', 'spending_deviation_score', 'velocity_score', 
            'geo_anomaly_score', 'payment_channel', 'hour', 'day_of_week', 'is_night', 
            'devices_per_account', 'ips_per_account', 'user_avg_amount', 'amount_deviation', 
            'ip_velocity', 'degree_centrality', 'betweenness_centrality', 
            'cluster_fraud_ratio', 'cluster_size', 'node_importance'
        ]
        
        # Ensure all columns exist, if not fill with 0
        for col in predictive_cols:
            if col not in df_feat.columns:
                df_feat[col] = 0
                
        # Reorder and filter
        X = df_feat[predictive_cols]
        
        # 3. Predict Probability
        prob = float(model.predict_proba(X)[0][1])
        is_fraud = prob > 0.5
        risk_level = "HIGH" if prob > 0.7 else ("MEDIUM" if prob > 0.3 else "LOW")
        
        # 4. Generate SHAP Explanation
        explanation = {}
        if explainer:
            shap_values = explainer.shap_values(X)
            # Handle both RF (list) and XGB (array) outputs
            if isinstance(shap_values, list): shap_values = shap_values[1]
            if len(shap_values.shape) > 1: shap_values = shap_values[0]
            
            # Map top 3 features for UI
            feat_imp = dict(zip(predictive_cols, shap_values.tolist()))
            explanation = dict(sorted(feat_imp.items(), key=lambda x: abs(x[1]), reverse=True)[:3])

        # 5. Save to database
        from sqlalchemy.exc import IntegrityError
        existing_tx = db.query(Transaction).filter(Transaction.transaction_id == data.transaction_id).first()
        if not existing_tx:
            db_tx = Transaction(
                transaction_id=data.transaction_id,
                sender_account=data.sender_account,
                receiver_account=data.receiver_account,
                amount=data.amount,
                is_fraud=is_fraud,
                fraud_probability=prob
            )
            db.add(db_tx)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
        
        return {
            "transaction_id": data.transaction_id,
            "is_fraud": is_fraud,
            "probability": round(prob, 2),
            "risk_level": risk_level,
            "explanation": explanation
        }
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
def train():
    """ Runs the full advanced research-grade training pipeline. """
    try:
        local_dir = os.path.dirname(__file__)
        data_file = "financial_fraud_detection_dataset.csv"
        data_path = os.path.normpath(os.path.join(local_dir, data_file))
        
        if not os.path.exists(data_path):
            data_path = os.path.normpath(os.path.join(local_dir, "..", data_file))
            
        if not os.path.exists(data_path):
            raise HTTPException(status_code=500, detail=f"Dataset file '{data_file}' not found.")

        print(f"Loading entire dataset from: {data_path}")
        df = load_data(data_path)
        
        # Preprocessing returns (df, scaler) on first run
        df_clean, scaler = preprocess_data(df)
        df_feat = generate_features(df_clean)
        
        # Advanced Graph Analytics
        G = build_graph(df_feat)
        df_graph = extract_graph_features(df_feat, G)
        
        # Advanced Models
        models, X_test, y_test, explainer, metrics = train_models(df_graph)
        save_path = os.path.normpath(os.path.join(os.path.dirname(__file__), "models/saved"))
        save_models(models, explainer, scaler=scaler, directory=save_path)
        
        metrics_path = os.path.join(save_path, "training_metrics.json")
        import json
        with open(metrics_path, "w") as f:
            json.dump(metrics, f)
        
        # --- NEW: GNN Training Pipeline ---
        gnn_data, _ = convert_to_gnn_data(df_graph, G)
        gnn_model = train_gnn(gnn_data, epochs=100)
        save_gnn_model(gnn_model, directory=save_path)
        
        # Reload engine with new models/scalers
        load_system()
        
        return {"message": "Success! Advanced Models, Scalers, GNN, and SHAP XAI initialized.", "best_model": "XGBoost + GCN"}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics")
def metrics(db: Session = Depends(get_db)):
    """ Returns summary metrics from the transaction database. """
    transactions = db.query(Transaction).all()
    total = len(transactions)
    fraud_count = len([t for t in transactions if t.is_fraud])
    
    return {
        "total_transactions": total,
        "fraud_detected": fraud_count,
        "fraud_ratio": (fraud_count / total) if total > 0 else 0
    }

@app.get("/graph-data")
def graph_data():
    """ 
    Serves graph data for the frontend visualization. 
    Constructs a sample graph from the latest dataset.
    """
    try:
        local_dir = os.path.dirname(__file__)
        data_file = "financial_fraud_detection_dataset.csv"
        data_path = os.path.normpath(os.path.join(local_dir, data_file))
        
        if not os.path.exists(data_path):
            data_path = os.path.normpath(os.path.join(local_dir, "..", data_file))
            
        df = load_data(data_path, sample_size=500)
        df_clean, _ = preprocess_data(df)
        df_feat = generate_features(df_clean)
        G = build_graph(df_feat)
        df_graph = extract_graph_features(df_feat, G)
        
        # Get graph for UI
        ui_data = get_graph_for_ui(df_graph, G)
        return ui_data
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-comparison")
def model_comparison():
    """ Returns training metrics for benchmark comparison """
    try:
        metrics_path = os.path.normpath(os.path.join(os.path.dirname(__file__), "models/saved/training_metrics.json"))
        if os.path.exists(metrics_path):
            import json
            with open(metrics_path, "r") as f:
                metrics = json.load(f)
            return metrics
        else:
            return []
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
