from sklearn.metrics import f1_score, precision_score, recall_score, roc_curve, auc, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import pandas as pd
import os

def evaluate_models(models, X_test, y_test):
    """
    Evaluates models using various performance metrics.
    """
    print("\n--- Model Evaluation Results ---")
    results = {}
    
    for name, model in models.items():
        print(f"\nModel: {name}")
        
        # 1. Predictions
        y_pred = model.predict(X_test)
        
        # 2. Probability predictions for ROC
        if hasattr(model, "predict_proba"):
            y_prob = model.predict_proba(X_test)[:, 1]
        elif hasattr(model, "decision_function"):
            y_prob = model.decision_function(X_test)
        else:
            y_prob = y_pred # Fallback for models without proba
            
        # 3. Compute Metrics
        f1 = f1_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        
        # 4. Compute ROC/AUC
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        roc_auc = auc(fpr, tpr)
        
        print(f"F1-score: {f1:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"ROC-AUC: {roc_auc:.4f}")
        
        results[name] = {
            'f1': f1,
            'precision': precision,
            'recall': recall,
            'auc': roc_auc,
            'fpr': fpr,
            'tpr': tpr
        }
    
    # Compare and select best
    best_model_name = max(results, key=lambda k: results[k]['f1'])
    print(f"\nBest Model by F1-score: {best_model_name}")
    
    return results, best_model_name

if __name__ == "__main__":
    from data.ingestion import load_data
    from preprocessing.cleaner import preprocess_data
    from feature_engineering.generator import generate_features
    from graph.constructor import build_graph
    from graph.extractor import extract_graph_features
    from models.trainer import train_models
    
    DATA_PATH = "financial_fraud_detection_dataset.csv"
    df = load_data(DATA_PATH, sample_size=1000)
    df = preprocess_data(df)
    df = generate_features(df)
    G = build_graph(df)
    df = extract_graph_features(df, G)
    
    models, X_test, y_test = train_models(df)
    results, best = evaluate_models(models, X_test, y_test)
