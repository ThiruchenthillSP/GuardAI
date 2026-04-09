import networkx as nx
import pandas as pd
import numpy as np

import community as community_louvain

def extract_graph_features(df, G):
    """
    Extracts advanced features from the transaction graph:
    - Louvain Community Detection (Fraud ring identification)
    - Centrality (Betweenness/Degree)
    - Cluster Fraud Ratios
    """
    print("\n--- Extracting Advanced Graph-Based Features ---")
    
    # 1. Degree Centrality (Influence of a transaction in its local network)
    degree_centrality = nx.degree_centrality(G)
    df['degree_centrality'] = df['transaction_id'].map(degree_centrality).fillna(0)
    print("Extracted 'degree_centrality'.")
    
    # 2. Betweenness Centrality (Transaction acting as a hub between groups)
    # Slow for very large graphs, we use a sample or simplified version
    if G.number_of_nodes() < 5000:
        betweenness = nx.betweenness_centrality(G, weight='weight')
        df['betweenness_centrality'] = df['transaction_id'].map(betweenness).fillna(0)
        print("Extracted 'betweenness_centrality'.")
    else:
        df['betweenness_centrality'] = 0 # Placeholder for performance
    
    # 3. Louvain Community Detection (Research Grade Clustering)
    partition = community_louvain.best_partition(G, weight='weight')
    df['cluster_id'] = df['transaction_id'].map(partition).fillna(-1)
    print("Extracted 'cluster_id' (Louvain).")
    
    # 4. Cluster Risk Analysis (Identify fraud-heavy clusters)
    cluster_fraud = df.groupby('cluster_id')['is_fraud'].mean().to_dict()
    df['cluster_fraud_ratio'] = df['cluster_id'].map(cluster_fraud).fillna(0)
    
    df['cluster_size'] = df['cluster_id'].map(df['cluster_id'].value_counts())
    print("Extracted cluster risk metrics.")
    
    # 5. Node Importance (Reinforced Degree)
    df['node_importance'] = df['degree_centrality'] * df['cluster_size']
    
    return df

if __name__ == "__main__":
    from data.ingestion import load_data
    from graph.constructor import build_graph
    DATA_PATH = "financial_fraud_detection_dataset.csv"
    df = load_data(DATA_PATH, sample_size=1000)
    G = build_graph(df)
    df_with_graph = extract_graph_features(df, G)
    print("\nGraph Features Sample:")
    print(df_with_graph[['transaction_id', 'node_degree', 'clustering_coeff', 'neighbor_fraud_ratio', 'component_size']].head())
