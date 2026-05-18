# GuardAI: Advanced Graph-Based Fraud Detection
**Mini Project Review Presentation Outline**

Use this structured content to build your PowerPoint/Google Slides. Each section represents one slide. 

---

## Slide 1: Title Slide
* **Title:** GuardAI - Next-Generation Financial Fraud Detection using Graph Neural Networks and Ensemble Learning
* **Subtitle:** Mini Project Review
* **Presented by:** [Your Name / Team Name]
* **Key Visual:** A professional network graph graphic showing connected nodes, with a few red nodes indicating fraud.

---

## Slide 2: The Problem Statement
* **Heading:** Why Traditional Fraud Detection is Failing
* **Bullet Points:**
  * **Sophisticated Fraud Rings:** Modern financial fraud is rarely committed by isolated individuals. Criminals use complex networks, shared devices, and synthetic identities.
  * **The Imbalance Problem:** Fraud makes up less than 0.5% of all transactions. Traditional machine learning models struggle to detect it without generating massive false positives.
  * **The "Black Box" Issue:** Even when AI catches fraud, banks require *explainability* for regulatory compliance. Traditional deep learning cannot explain *why* it made a decision.
* **Key Takeaway:** We need a system that analyzes relationships (graphs), handles imbalanced data, and provides human-readable explanations.

---

## Slide 3: Proposed Solution - GuardAI
* **Heading:** Introducing GuardAI
* **Bullet Points:**
  * **Graph-First Approach:** Instead of analyzing transactions in isolation, GuardAI maps the entire financial ecosystem (Senders, Receivers, IP Addresses, and Devices).
  * **Hybrid AI Engine:** Combines the predictive power of **XGBoost** with the relational awareness of **Graph Neural Networks (GNNs)**.
  * **Full-Stack Application:** Not just an algorithm—a complete, production-ready system with a React dashboard and FastAPI backend.
  * **Academic Validation:** Benchmarked against the IEEE-CIS fraud detection standards.

---

## Slide 4: System Architecture
* **Heading:** Full-Stack Architecture
* **Bullet Points:**
  * **Frontend:** React + Vite, featuring live interactive dashboards (Recharts) and dynamic node graphs.
  * **Backend:** FastAPI (Python), serving asynchronous endpoints for model training and real-time prediction.
  * **Data Layer:** SQLite database for persistent transaction logging.
  * **Machine Learning Pipeline:** 
    * Scikit-Learn (Preprocessing)
    * PyTorch Geometric (Graph Networks)
    * XGBoost (Classification)
    * SHAP (Interpretability)
* **Visual:** Include a simple architecture diagram showing Frontend <-> FastAPI <-> ML Models.

---

## Slide 5: Data Preprocessing & Class Imbalance
* **Heading:** Handling the Data
* **Bullet Points:**
  * **The Dataset:** Trained on a massive financial dataset (capped at 150k rows for memory safety) with a heavy imbalance (0.34% fraud ratio).
  * **Scaling & Encoding:** Used `StandardScaler` for numeric values (Amounts, Velocity) and Label Encoders for categorical data (Merchant, Device Type).
  * **Solving Imbalance with SMOTE:** Applied Synthetic Minority Over-sampling Technique (SMOTE) at a 10:1 ratio to teach the model what fraud looks like without skewing the baseline.

---

## Slide 6: Feature Engineering
* **Heading:** Building Smarter Features
* **Bullet Points:**
  * Raw transaction data isn't enough. We engineered synthetic features to capture behavioral intent.
  * **Behavioral Metrics:**
    * `devices_per_account`: How many different devices a single user accesses.
    * `amount_deviation`: How far a transaction deviates from the user's historical average.
    * `velocity_score`: The speed and frequency of transactions.
  * **Time Metrics:** Flagging unusual transaction hours (e.g., 3 AM wire transfers).

---

## Slide 7: The Core Innovation - Graph Neural Networks
* **Heading:** Relational Context via PyTorch Geometric
* **Bullet Points:**
  * We convert the tabular data into a mathematical Graph where Nodes = Transactions/Users and Edges = Shared IPs or Devices.
  * **Topological Features Extracted:**
    * `degree_centrality`: Is this account a hub for many transactions?
    * `cluster_size`: Does this transaction belong to a known tight-knit group (potential fraud ring)?
  * **GNN Architectures Tested:** We benchmarked Graph Convolutional Networks (GCN), GraphSAGE, and Graph Attention Networks (GAT). GAT achieved the highest AUC-ROC (0.998).

---

## Slide 8: The Model Pipeline
* **Heading:** Multi-Model Ensemble Learning
* **Bullet Points:**
  * We didn't rely on just one model. We trained and compared:
    1. **Logistic Regression** (Baseline)
    2. **Random Forest** (Tree-based ensemble)
    3. **XGBoost** (Gradient boosting)
  * **Ablation Study:** We proved the value of our architecture by showing that adding SMOTE and Graph Features increased the Average Precision (Avg-PR) significantly compared to raw tabular data.

---

## Slide 9: Algorithm Roles & Responsibilities
* **Heading:** What Each Algorithm Does in GuardAI
* **Bullet Points:**
  * **PyTorch Geometric (GNNs):** Act as the "Detectives." They look at the shape of the network to find hidden fraud rings.
    * *Graph Attention Network (GAT):* Our best performer. It learns which connections matter most (e.g., sharing a device is more suspicious than sharing a broad location).
    * *GraphSAGE:* Used to generate embeddings for massive graphs efficiently by sampling neighbors.
    * *GCN (Graph Convolutional Network):* A baseline topological model that smooths features across connected nodes.
  * **XGBoost (eXtreme Gradient Boosting):** Acts as the "Judge." It takes the raw data *plus* the graph clues found by the GNNs, and makes the final rapid decision (Fraud vs Safe) in under 5 milliseconds.
  * **Random Forest & Logistic Regression:** Act as our "Baselines" to mathematically prove that our XGBoost+GNN approach is vastly superior.
  * **SHAP & GNNExplainer:** Act as the "Auditors." They don't predict; they simply explain *why* XGBoost and the GNNs made their decisions.

---

## Slide 10: Explainable AI (XAI)
* **Heading:** Opening the Black Box
* **Bullet Points:**
  * **SHAP (SHapley Additive exPlanations):** Used to break down every single XGBoost prediction. The dashboard shows exactly which feature (e.g., *Velocity Score*) pushed the transaction toward fraud or safety.
  * **GNNExplainer:** Deployed on the Graph Neural Network to highlight the exact edges (connections) that caused a node to be flagged as part of a fraud ring.
* **Key Takeaway:** GuardAI doesn't just block a transaction; it tells the fraud analyst *why*.

---

## Slide 11: Real-Time Dashboard (Demo Highlights)
* **Heading:** Production-Ready Interface
* **Bullet Points:**
  * **Metrics Dashboard:** Live tracking of Safe Ratios, Total Volume, and System Latency.
  * **Prediction Engine:** A real-time inference page where analysts can manually input suspicious transaction data (or use test presets) and get an instant Risk Level (LOW, MEDIUM, HIGH) with SHAP breakdowns.
  * **Network Visualizer:** Interactive 3D/2D node mapping of transaction clusters.
* *(Speaker Note: This is where you can show screenshots of the React frontend or do a live demo).*

---

## Slide 12: Academic Results & Validation
* **Heading:** Industry Benchmarks
* **Bullet Points:**
  * **High Performance:** XGBoost combined with Graph Features achieved peak AUC-ROC while maintaining lightning-fast inference latency (~3.6ms).
  * **Cross-Validation:** The pipeline was successfully validated against the rigid IEEE-CIS Fraud Detection benchmark.
  * **Robustness:** The system handles massive class imbalances perfectly, relying on Average Precision (Avg-PR) rather than raw accuracy.

---

## Slide 13: Future Scope & Conclusion
* **Heading:** Conclusion & Next Steps
* **Bullet Points:**
  * **Conclusion:** GuardAI successfully demonstrates that injecting relational graph data into gradient-boosted trees drastically improves the detection of coordinated financial fraud rings while maintaining sub-10ms latency.
  * **Future Scope:** 
    * Transitioning to a streaming data architecture (e.g., Apache Kafka) for true real-time ingestion.
    * Expanding the GNN to a Heterogeneous Graph to model Banks, Merchants, and Cryptos as distinct node types.
* **Final Note:** Thank you. Any Questions?
