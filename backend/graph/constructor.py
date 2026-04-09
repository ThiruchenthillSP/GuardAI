import networkx as nx
import pandas as pd
import time

def build_graph(df):
    """
    Constructs a NetworkX graph where nodes are transaction_ids and edges 
    are relationships based on shared attributes (IP, User, Device).
    """
    print("\n--- Constructing Transaction Graph ---")
    start_time = time.time()
    
    G = nx.Graph()
    
    # 1. Add nodes
    G.add_nodes_from(df['transaction_id'])
    
    # helper for efficient edge creation
    def add_edges_from_group(column_name, relationship_type):
        print(f"Creating edges based on: {column_name} ({relationship_type})")
        # Identify groups with more than one transaction
        groups = df.groupby(column_name)['transaction_id'].apply(list)
        for tx_list in groups:
            if len(tx_list) > 1:
                # Add edges between all pairs in the group (fully connected for that group)
                # Note: For very large groups, this could still be slow, but for IP/Device/User, 
                # groups are usually small.
                for i in range(len(tx_list)):
                    for j in range(i + 1, len(tx_list)):
                        G.add_edge(tx_list[i], tx_list[j], type=relationship_type)

    # 2. Add edges based on shared attributes with different weights
    # Weighted relationships: 
    # Same IP (0.8), Same User (1.0), Same Device (1.0), Same Location (0.4)
    attributes = [
        ('ip_address', 'IP', 0.8),
        ('sender_account', 'User', 1.0),
        ('device_hash', 'Device', 1.0),
        ('location', 'Location', 0.4)
    ]
    
    def add_weighted_edges(column_name, relationship_type, weight):
        print(f"Creating weighted edges: {column_name} ({relationship_type}) weight={weight}")
        groups = df.groupby(column_name)['transaction_id'].apply(list)
        for tx_list in groups:
            if 1 < len(tx_list) < 100: # Limit group size for performance
                for i in range(len(tx_list)):
                    for j in range(i + 1, len(tx_list)):
                        if G.has_edge(tx_list[i], tx_list[j]):
                            # Increment weight if edge already exists (Multi-layer reinforcement)
                            G[tx_list[i]][tx_list[j]]['weight'] += weight
                        else:
                            G.add_edge(tx_list[i], tx_list[j], type=relationship_type, weight=weight)

    for col, rel, w in attributes:
        if col in df.columns:
            add_weighted_edges(col, rel, w)
            
    print(f"Graph construction completed in {time.time() - start_time:.2f} seconds.")
    print(f"Nodes: {G.number_of_nodes()}, Edges: {G.number_of_edges()}")
    
    return G

if __name__ == "__main__":
    from data.ingestion import load_data
    DATA_PATH = "financial_fraud_detection_dataset.csv"
    df = load_data(DATA_PATH, sample_size=1000)
    G = build_graph(df)
