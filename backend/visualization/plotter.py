import matplotlib.pyplot as plt
import seaborn as sns
import os

def plot_roc_curves(evaluation_results, output_dir='visualization/plots'):
    """
    Plots ROC curves for all evaluated models.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    plt.figure(figsize=(10, 8))
    for name, metrics in evaluation_results.items():
        plt.plot(metrics['fpr'], metrics['tpr'], label=f"{name} (AUC = {metrics['auc']:.2f})")
        
    plt.plot([0, 1], [0, 1], 'k--', label='Chance Level')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (ROC) Curve')
    plt.legend()
    plt.grid(True)
    
    save_path = f"{output_dir}/roc_curves.png"
    plt.savefig(save_path)
    print(f"ROC curves plot saved: {save_path}")
    plt.close()

def plot_fraud_distribution(df, output_dir='visualization/plots'):
    """
    Plots the distribution of fraud vs. non-fraud transactions.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    plt.figure(figsize=(8, 6))
    sns.countplot(x='is_fraud', data=df)
    plt.title('Fraud vs. Non-Fraud Distribution')
    plt.xlabel('Is Fraud (0: No, 1: Yes)')
    plt.ylabel('Count')
    
    save_path = f"{output_dir}/fraud_distribution.png"
    plt.savefig(save_path)
    print(f"Fraud distribution plot saved: {save_path}")
    plt.close()

def plot_graph_visualization(G, df, output_dir='visualization/plots'):
    """
    Plots a sample of the graph structure.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # Visualize only a small sample to avoid crashing
    sample_nodes = list(G.nodes)[:50]
    subgraph = G.subgraph(sample_nodes)
    
    plt.figure(figsize=(10, 10))
    pos = nx.spring_layout(subgraph)
    
    # Color nodes by fraud status
    fraud_dict = dict(zip(df['transaction_id'], df['is_fraud']))
    node_colors = ['red' if fraud_dict.get(n, 0) == 1 else 'blue' for n in subgraph.nodes]
    
    nx.draw(subgraph, pos, node_color=node_colors, with_labels=False, node_size=100, alpha=0.7)
    plt.title('Transaction Graph Visualization (Sample Nodes)')
    
    save_path = f"{output_dir}/graph_sample.png"
    plt.savefig(save_path)
    print(f"Graph sample visualization saved: {save_path}")
    plt.close()

if __name__ == "__main__":
    # Test with dummy data or import and run from evaluation results
    pass
