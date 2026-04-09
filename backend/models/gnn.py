import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv
import os
import pickle

class SimpleGCN(torch.nn.Module):
    """
    A 2-layer Graph Convolutional Network (GCN) for node classification.
    """
    def __init__(self, num_node_features, num_classes=2):
        super(SimpleGCN, self).__init__()
        self.conv1 = GCNConv(num_node_features, 16)
        self.conv2 = GCNConv(16, num_classes)

    def forward(self, data):
        x, edge_index = data.x, data.edge_index

        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = F.dropout(x, training=self.training)
        x = self.conv2(x, edge_index)

        return F.log_softmax(x, dim=1)

def train_gnn(data, epochs=100, lr=0.01):
    """
    Trains the GCN model on the provided graph data.
    """
    print(f"\n--- Training GNN Model ({epochs} epochs) ---")
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = SimpleGCN(data.num_node_features).to(device)
    data = data.to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=5e-4)

    model.train()
    for epoch in range(epochs):
        optimizer.zero_grad()
        out = model(data)
        # Assuming y is available and data describes a classification task
        loss = F.nll_loss(out, data.y)
        loss.backward()
        optimizer.step()
        
        if epoch % 20 == 0:
            print(f"Epoch {epoch:3d}, Loss: {loss.item():.4f}")

    return model

def save_gnn_model(model, directory='models/saved'):
    """
    Saves the GNN model state to disk.
    """
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    path = f"{directory}/gnn_model.pth"
    torch.save(model.state_dict(), path)
    print(f"Saved GNN Model to {path}")

def load_gnn_model(num_features, directory='models/saved'):
    """
    Loads the GNN model state from disk.
    """
    path = f"{directory}/gnn_model.pth"
    if not os.path.exists(path):
        return None
    
    model = SimpleGCN(num_features)
    model.load_state_dict(torch.load(path))
    model.eval()
    print(f"Loaded GNN Model from {path}")
    return model

if __name__ == "__main__":
    # Test stub
    from graph.gnn_utils import convert_to_gnn_data
    import pandas as pd
    import networkx as nx
    
    # Create dummy data
    df = pd.DataFrame({'transaction_id': [1, 2, 3], 'is_fraud': [0, 1, 0], 'amount': [100, 200, 150]})
    G = nx.Graph()
    G.add_edges_from([(1, 2), (2, 3)])
    
    # Test conversion
    data, mapping = convert_to_gnn_data(df, G)
    
    # Test training
    model = train_gnn(data, epochs=5)
    save_gnn_model(model, directory='tmp')
