import torch
from torch_geometric.data import Data
import pandas as pd
import numpy as np

def convert_to_gnn_data(df, G):
    """
    Converts a Pandas DataFrame and NetworkX Graph into a PyTorch Geometric Data object.
    """
    print("\n--- Converting to GNN Data (PyTorch Geometric) ---")
    
    # 1. Map transaction IDs to 0-indexed integers
    node_mapping = {tx_id: i for i, tx_id in enumerate(df['transaction_id'])}
    
    # 2. Prepare Edges (edge_index)
    edge_list = []
    for u, v in G.edges():
        if u in node_mapping and v in node_mapping:
            # Undirected graph: add both directions
            edge_list.append([node_mapping[u], node_mapping[v]])
            edge_list.append([node_mapping[v], node_mapping[u]])
            
    if not edge_list:
        # Fallback if no edges found in the sample
        edge_index = torch.empty((2, 0), dtype=torch.long)
    else:
        edge_index = torch.tensor(edge_list, dtype=torch.long).t().contiguous()
        
    # 3. Prepare Node Features (X)
    # Features used: amount, scores, centrality metrics, etc.
    feature_cols = [
        'amount', 'spending_deviation_score', 'velocity_score', 
        'geo_anomaly_score', 'time_since_last_transaction',
        'degree_centrality', 'betweenness_centrality', 'cluster_fraud_ratio'
    ]
    
    # Ensure all columns exist
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0
            
    x = torch.tensor(df[feature_cols].values, dtype=torch.float)
    
    # 4. Prepare Labels (y)
    if 'is_fraud' in df.columns:
        y = torch.tensor(df['is_fraud'].values, dtype=torch.long)
    else:
        y = None
        
    # 5. Create Data Object
    data = Data(x=x, edge_index=edge_index, y=y)
    
    print(f"GNN Data Created: {data.num_nodes} nodes, {data.num_edges} edges, {data.num_node_features} features.")
    
    return data, node_mapping

def get_graph_for_ui(df, G, fraud_probs=None):
    """
    Prepares a JSON-serializable list of nodes and edges for the frontend visualization.
    Only takes a subset (e.g., top 500 nodes) to ensure UI performance.
    """
    # Use a subset of nodes if the graph is too large
    if len(df) > 500:
        # Prioritize fraud transactions if available
        if 'is_fraud' in df.columns:
            fraud_df = df[df['is_fraud'] == True]
            safe_df = df[df['is_fraud'] == False].sample(min(len(df)-len(fraud_df), 500 - len(fraud_df)))
            display_df = pd.concat([fraud_df, safe_df])
        else:
            display_df = df.sample(500)
    else:
        display_df = df
        
    display_nodes = set(display_df['transaction_id'])
    
    nodes = []
    for _, row in display_df.iterrows():
        tx_id = row['transaction_id']
        prob = fraud_probs[tx_id] if fraud_probs and tx_id in fraud_probs else (1.0 if row.get('is_fraud') else 0.0)
        
        nodes.append({
            "id": str(tx_id),
            "label": f"TX {tx_id}",
            "val": row.get('amount', 50),
            "isFraud": bool(row.get('is_fraud', False)),
            "probability": float(prob),
            "risk": "HIGH" if prob > 0.7 else ("MEDIUM" if prob > 0.3 else "LOW")
        })
        
    edges = []
    for u, v, data in G.edges(data=True):
        if u in display_nodes and v in display_nodes:
            edges.append({
                "source": str(u),
                "target": str(v),
                "type": data.get('type', 'connection'),
                "weight": data.get('weight', 1.0)
            })
            
    return {"nodes": nodes, "links": edges}
