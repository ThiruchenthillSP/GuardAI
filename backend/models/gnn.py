import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, GATConv, SAGEConv
import os, json, time
import numpy as np

class SimpleGCN(torch.nn.Module):
    def __init__(self, num_node_features, num_classes=2, hidden=64):
        super().__init__()
        self.conv1 = GCNConv(num_node_features, hidden)
        self.conv2 = GCNConv(hidden, num_classes)
    def forward(self, x_or_data, edge_index=None, **kwargs):
        if edge_index is None:
            x, ei = x_or_data.x, x_or_data.edge_index
        else:
            x, ei = x_or_data, edge_index
        x = F.relu(self.conv1(x, ei))
        x = F.dropout(x, p=0.5, training=self.training)
        x = self.conv2(x, ei)
        return F.log_softmax(x, dim=1)

class SimpleGAT(torch.nn.Module):
    def __init__(self, num_node_features, num_classes=2, hidden=32, heads=4):
        super().__init__()
        self.conv1 = GATConv(num_node_features, hidden, heads=heads, dropout=0.4)
        self.conv2 = GATConv(hidden*heads, num_classes, heads=1, concat=False, dropout=0.4)
    def forward(self, x_or_data, edge_index=None, **kwargs):
        if edge_index is None:
            x, ei = x_or_data.x, x_or_data.edge_index
        else:
            x, ei = x_or_data, edge_index
        x = F.elu(self.conv1(x, ei))
        x = F.dropout(x, p=0.4, training=self.training)
        x = self.conv2(x, ei)
        return F.log_softmax(x, dim=1)

class SimpleGraphSAGE(torch.nn.Module):
    def __init__(self, num_node_features, num_classes=2, hidden=64):
        super().__init__()
        self.conv1 = SAGEConv(num_node_features, hidden)
        self.conv2 = SAGEConv(hidden, num_classes)
    def forward(self, x_or_data, edge_index=None, **kwargs):
        if edge_index is None:
            x, ei = x_or_data.x, x_or_data.edge_index
        else:
            x, ei = x_or_data, edge_index
        x = F.relu(self.conv1(x, ei))
        x = F.dropout(x, p=0.5, training=self.training)
        x = self.conv2(x, ei)
        return F.log_softmax(x, dim=1)

ARCH_MAP = {"GCN": SimpleGCN, "GAT": SimpleGAT, "GraphSAGE": SimpleGraphSAGE}

def _train_model(model, data, epochs, lr, name):
    print(f"\n--- Training {name} ({epochs} epochs) ---")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device); data = data.to(device)
    opt = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=5e-4)
    model.train()
    for epoch in range(epochs):
        opt.zero_grad()
        out = model(data)
        loss = F.nll_loss(out, data.y)
        loss.backward(); opt.step()
        if epoch % 20 == 0: print(f"  Epoch {epoch:3d}, Loss: {loss.item():.4f}")
    return model

def _eval_gnn(model, data):
    from sklearn.metrics import roc_auc_score, average_precision_score
    device = next(model.parameters()).device
    model.eval()
    with torch.no_grad():
        out = model(data.to(device))
        probs = torch.exp(out)[:, 1].cpu().numpy()
    labels = data.y.cpu().numpy()
    if len(set(labels)) < 2: return 0.0, 0.0
    return float(round(roc_auc_score(labels, probs), 4)), float(round(average_precision_score(labels, probs), 4))

def train_gnn(data, epochs=100, lr=0.01):
    return _train_model(SimpleGCN(data.num_node_features), data, epochs, lr, "GCN")

def train_all_gnns(data, epochs=100, lr=0.01):
    results = []
    for name, Cls in ARCH_MAP.items():
        model = _train_model(Cls(data.num_node_features), data, epochs, lr, name)
        auc, ap = _eval_gnn(model, data)
        print(f"  [{name}] AUC-ROC: {auc:.4f} | Avg-PR: {ap:.4f}")
        results.append((name, model, auc, ap))
    return results

def save_gnn_model(model, directory='models/saved', name='gnn_model', arch_name=None):
    os.makedirs(directory, exist_ok=True)
    path = os.path.join(directory, f"{name}.pth")
    torch.save(model.state_dict(), path)
    # Phase 3a: save architecture type
    if arch_name and name == 'gnn_model':
        arch_path = os.path.join(directory, "gnn_architecture.txt")
        with open(arch_path, 'w') as f: f.write(arch_name)
    print(f"Saved {name} to {path}")

def load_gnn_model(num_features, directory='models/saved'):
    path = os.path.join(directory, 'gnn_model.pth')
    arch_path = os.path.join(directory, 'gnn_architecture.txt')
    if not os.path.exists(path): return None
    # Phase 3a: read architecture type
    arch_name = "GCN"
    if os.path.exists(arch_path):
        with open(arch_path, 'r') as f: arch_name = f.read().strip()
    Cls = ARCH_MAP.get(arch_name, SimpleGCN)
    model = Cls(num_node_features=num_features)
    model.load_state_dict(torch.load(path, map_location='cpu', weights_only=True))
    model.eval()
    print(f"[+] GNN Model Loaded: {arch_name} Active.")
    return model

def gnn_latency_benchmark(model, data, n=1000):
    """Phase 3d: GNN inference latency."""
    device = next(model.parameters()).device
    data = data.to(device)
    model.eval()
    times = []
    with torch.no_grad():
        for _ in range(n):
            t0 = time.perf_counter()
            model(data)
            times.append((time.perf_counter() - t0)*1000)
    times = np.array(times)
    return {"mean": float(round(np.mean(times), 3)), "p95": float(round(np.percentile(times, 95), 3))}

def run_gnn_explainer(model, data, directory='models/saved', top_k_nodes=5, top_k_edges=3):
    """Phase 3b: GNNExplainer on top fraud nodes."""
    try:
        from torch_geometric.explain import Explainer, GNNExplainer
        print("\n[*] Running GNNExplainer on top fraud nodes...")
        device = next(model.parameters()).device
        data = data.to(device)
        model.eval()

        # Get fraud probabilities
        with torch.no_grad():
            out = model(data)
            probs = torch.exp(out)[:, 1].cpu().numpy()

        # Find top-k highest fraud probability nodes
        fraud_mask = data.y.cpu().numpy() == 1
        if fraud_mask.sum() == 0:
            print("[-] No fraud nodes found for explanation.")
            return

        fraud_indices = np.where(fraud_mask)[0]
        fraud_probs = probs[fraud_indices]
        top_idx = fraud_indices[np.argsort(fraud_probs)[-top_k_nodes:]]

        explainer = Explainer(
            model=model,
            algorithm=GNNExplainer(epochs=100),
            explanation_type='model',
            node_mask_type='attributes',
            edge_mask_type='object',
            model_config=dict(mode='multiclass_classification', task_level='node', return_type='log_probs')
        )

        explanations = []
        for node_id in top_idx:
            try:
                exp = explainer(data.x, data.edge_index, index=int(node_id))
                edge_mask = exp.edge_mask.cpu().numpy() if exp.edge_mask is not None else np.array([])

                top_edges = []
                if len(edge_mask) > 0:
                    top_edge_idx = np.argsort(edge_mask)[-top_k_edges:]
                    ei = data.edge_index.cpu().numpy()
                    for eidx in top_edge_idx:
                        if eidx < ei.shape[1]:
                            top_edges.append({
                                "from": int(ei[0, eidx]),
                                "to": int(ei[1, eidx]),
                                "importance": float(round(edge_mask[eidx], 4)),
                                "shared_attribute": "graph_connection"
                            })

                explanations.append({
                    "node_id": int(node_id),
                    "fraud_probability": float(round(probs[node_id], 4)),
                    "top_edges": top_edges
                })
            except Exception as e:
                print(f"  [-] Node {node_id} explanation failed: {e}")
                continue

        # Save
        save_path = os.path.join(directory, "gnn_explanations.json")
        with open(save_path, 'w') as f:
            json.dump(explanations, f, indent=2)
        print(f"[+] GNN explanations saved: {save_path} ({len(explanations)} nodes)")
        return explanations

    except ImportError:
        print("[-] GNNExplainer not available (requires torch_geometric.explain)")
        return None
    except Exception as e:
        print(f"[-] GNNExplainer failed: {e}")
        return None
