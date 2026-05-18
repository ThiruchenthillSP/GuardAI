# GuardAI: Complete Beginner-to-Expert Guide

This document explains EVERYTHING in the GuardAI project from absolute scratch. If you only know the very basics of programming and have never studied machine learning, this guide will take you from zero to fully understanding every concept, algorithm, and calculation used.

---

## PART 1: THE FOUNDATIONS (What You Need to Know First)

---

### What is Machine Learning?

Machine Learning (ML) is teaching a computer to make decisions by showing it thousands of examples instead of writing explicit rules. 

**Traditional Programming:** You write rules → Computer follows rules.
- Example: "IF amount > $10,000 AND time is 3AM → Block transaction"

**Machine Learning:** You show examples → Computer discovers rules on its own.
- Example: You show the computer 150,000 past transactions labeled "Fraud" or "Safe." The computer figures out its own rules by analyzing patterns in the data.

The advantage: ML discovers patterns that humans would never think to look for (like "fraud is 3.2x more likely when the device hash changes within 15 minutes of a large wire transfer from a new location").

---

### What is a Dataset?

A dataset is simply a massive spreadsheet (CSV file). Each row is one transaction. Each column is a piece of information about that transaction.

**Example of what one row looks like:**

| transaction_id | amount | sender | receiver | device | location | is_fraud |
|---|---|---|---|---|---|---|
| TXN-4521 | $2,500 | ACC-112 | ACC-887 | Mobile | Mumbai | Yes |

The last column (`is_fraud`) is the **label** — the answer the computer is trying to learn to predict. During training, the computer sees this label. During real-world use, it must predict it on its own.

---

### What is a Feature?

A **feature** is any column in your dataset that the algorithm uses to make its decision. Think of features as "clues" the detective (algorithm) uses to solve the case.

**Raw Features** (directly from the data): amount, location, device_used
**Engineered Features** (we create them): devices_per_account, velocity_score, amount_deviation

Feature Engineering is the art of creating smarter clues. Instead of just telling the algorithm "this transaction was $500," we also tell it "this user normally spends $50, so this $500 is 10x their average — that's suspicious."

---

### What is a Model?

A **model** is the mathematical formula that the algorithm learns after studying thousands of examples. Think of it as a "brain" that has been trained.

Before training: The model is empty (random guesses).
After training: The model contains learned weights and rules that let it predict fraud.

The trained model is saved as a `.pkl` file (like `xgboost.pkl`). This file IS the "AI Brain." When you click "Initialize AI Brain" in the dashboard, you are creating this file. When you run a prediction, the server loads this file and uses it.

---

### What is Classification?

Classification is the specific type of ML task where the computer must sort things into categories. In our case, there are only 2 categories:
- **Class 0:** Safe transaction
- **Class 1:** Fraudulent transaction

This is called **Binary Classification** (binary = two choices).

---

### What is Training vs Testing?

We split the dataset into two parts:
- **Training Set (80%):** 120,000 transactions. The algorithm studies these and learns patterns.
- **Testing Set (20%):** 30,000 transactions. The algorithm has NEVER seen these. We use them to check if the algorithm actually learned, or if it just memorized the training data.

If the algorithm performs well on data it has never seen before, it has truly learned.

---

## PART 2: THE PROBLEM (Why This Project Exists)

---

### The Class Imbalance Problem

Out of 150,000 transactions in our dataset:
- 149,495 are **Safe** (99.66%)
- 505 are **Fraud** (0.34%)

This is like finding a needle in a haystack. If a lazy algorithm just says "SAFE" for every single transaction, it gets **99.66% accuracy**. But it catches **zero** fraudsters. Accuracy is meaningless here.

This is why we use **Average Precision (Avg-PR)** instead of accuracy. More on this later.

---

### The Isolation Problem

Traditional algorithms look at each transaction independently, like reading one sentence from a book. But fraud rings involve coordinated groups:
- Account A sends money to Account B
- Account B sends money to Account C
- All three use the same device
- All three use the same IP address

No single transaction looks suspicious on its own. But when you see the CONNECTIONS between them, the fraud ring becomes obvious. This is why we use **Graph Neural Networks**.

---

## PART 3: DATA PREPROCESSING (Preparing the Data)

---

### Algorithm 1: Label Encoding

**What is it?** A technique to convert text into numbers.

**Why do we need it?** Computers only understand numbers. The column `device_used` contains text values like "Mobile", "Desktop", "Tablet". We need to convert them.

**How does it work?**
1. Scan the column and collect all unique values: ["Desktop", "Mobile", "Tablet"]
2. Sort alphabetically and assign numbers starting from 0:
   - Desktop → 0
   - Mobile → 1
   - Tablet → 2

**In our project:** We encode 5 columns: `device_used`, `location`, `payment_channel`, `transaction_type`, `merchant_category`. The mappings are saved to `label_encoders.pkl` so the same conversion is used during live predictions.

---

### Algorithm 2: Standard Scaling (Z-Score Normalization)

**What is it?** A technique to put all numbers on the same scale.

**Why do we need it?** Consider two features:
- `amount`: ranges from $1 to $50,000
- `velocity_score`: ranges from 0 to 20

If we feed these raw numbers into the algorithm, it will think `amount` is 2,500 times more important than `velocity_score`, simply because the numbers are bigger. That's wrong.

**How does it work?**
1. Calculate the **mean** (average) of the column. Call it μ (mu).
2. Calculate the **standard deviation** (how spread out the numbers are). Call it σ (sigma).
3. Transform every single value using this formula:

   **z = (x - μ) / σ**

**Step-by-step example:**
- Suppose the average transaction amount (μ) = $500
- Suppose the standard deviation (σ) = $200
- A $900 transaction: z = (900 - 500) / 200 = **2.0**
- A $300 transaction: z = (300 - 500) / 200 = **-1.0**
- A $500 transaction: z = (500 - 500) / 200 = **0.0** (exactly average)

After scaling, all features are centered around 0, with most values between -3 and +3. Now `amount` and `velocity_score` are on equal footing.

**In our project:** We scale 5 numeric columns: `amount`, `spending_deviation_score`, `velocity_score`, `geo_anomaly_score`, `time_since_last_transaction`. The scaler is saved to `scaler.pkl`.

---

### Algorithm 3: SMOTE (Synthetic Minority Over-sampling Technique)

**What is it?** An algorithm that creates fake-but-realistic fraud examples to balance the dataset.

**Why do we need it?** We only have 505 fraud examples out of 150,000. The algorithm barely gets to see fraud, so it never learns what fraud looks like. We need more fraud examples.

**Why not just copy-paste the 505 fraud rows?** Because the algorithm would memorize those exact 505 patterns (called **overfitting**) instead of learning general fraud characteristics. SMOTE creates NEW, slightly different fraud examples.

**How does it work? (Step by step)**
1. Pick a real fraud transaction. Call it Point A.
   - Point A has features: amount=2.1, velocity=1.8, deviation=0.5 (all scaled values)
2. Find the 5 closest fraud transactions using **distance** (called K-Nearest Neighbors). Pick one neighbor, Point B.
   - Point B has features: amount=2.4, velocity=1.5, deviation=0.8
3. Generate a random number λ (lambda) between 0 and 1. Let's say λ = 0.6.
4. Create a synthetic fraud transaction by blending A and B:
   - New amount = 2.1 + 0.6 × (2.4 - 2.1) = 2.1 + 0.18 = **2.28**
   - New velocity = 1.8 + 0.6 × (1.5 - 1.8) = 1.8 - 0.18 = **1.62**
   - New deviation = 0.5 + 0.6 × (0.8 - 0.5) = 0.5 + 0.18 = **0.68**
5. The new synthetic fraud transaction (2.28, 1.62, 0.68) is a point that lies ON THE LINE between A and B. It's realistic because it's between two real fraud examples.
6. Repeat thousands of times.

**The formula:** x_new = x_A + λ × (x_B - x_A)

**In our project:** We used a 10:1 ratio. Result: 119,596 normal + 11,959 fraud samples for training. The fraud went from 0.34% to about 9% of the training data.

---

## PART 4: THE CLASSIFICATION ALGORITHMS (Making Decisions)

---

### What is a Decision Tree?

Before understanding XGBoost or Random Forest, you need to understand a Decision Tree. It's the simplest classification algorithm.

A Decision Tree is literally a flowchart of yes/no questions:
```
Is amount > $5,000?
├── YES → Is velocity_score > 15?
│         ├── YES → FRAUD (95% confident)
│         └── NO  → Is location = "Unknown"?
│                   ├── YES → FRAUD (70% confident)
│                   └── NO  → SAFE (85% confident)
└── NO  → Is device_count > 5?
          ├── YES → FRAUD (60% confident)
          └── NO  → SAFE (99% confident)
```

The algorithm automatically learns which questions to ask and in what order by analyzing the training data. It picks the question that best separates fraud from safe at each step.

---

### Algorithm 4: Logistic Regression (Baseline)

**What is it?** The simplest classification algorithm. It draws a single straight line (or flat surface in higher dimensions) to separate fraud from safe.

**How does it work?**
1. Take all features and multiply each by a learned weight:
   z = (w1 × amount) + (w2 × velocity) + (w3 × deviation) + ... + bias
2. Pass this sum through the **Sigmoid Function**:
   probability = 1 / (1 + e^(-z))
3. The sigmoid squashes ANY number into a value between 0 and 1.
   - If z = +10 → probability ≈ 0.9999 (almost certainly fraud)
   - If z = 0 → probability = 0.5 (coin flip)
   - If z = -10 → probability ≈ 0.0001 (almost certainly safe)
4. If probability > 0.5 → predict "Fraud". Otherwise → "Safe".

**Why it fails for fraud:** It can only draw straight boundaries. Real fraud patterns are complex and non-linear (e.g., "$500 is safe from Mumbai but suspicious from an unknown VPN location at 3 AM"). Logistic Regression cannot capture these interactions.

**In our project:** It achieved Avg-PR: 0.0216 — used purely as a baseline to prove our advanced models are better.

---

### Algorithm 5: Random Forest

**What is it?** An ensemble of many independent decision trees that vote together.

**How does it work?**
1. Randomly sample a subset of the training data (with replacement — some rows may be picked twice, others not at all). This is called **Bootstrap Sampling**.
2. Build a Decision Tree on that subset. But at each split, only consider a random subset of features (e.g., only look at 4 out of 22 features). This is the "Random" part.
3. Repeat 100 times (`n_estimators=100`), creating 100 completely different trees.
4. For a new transaction: run it through all 100 trees.
   - If 73 trees say "Fraud" and 27 say "Safe" → majority vote = **Fraud** (73% confidence)

**Why 100 trees are better than 1:** One tree might make mistakes. But if 100 different trees (each trained on different data subsets, looking at different features) agree, the prediction is much more reliable. Individual errors cancel out.

**Why it's still not good enough:** Random Forest treats every transaction independently. It has zero knowledge about the network connections. Also, each tree is built independently — they don't learn from each other's mistakes.

**In our project:** Achieved Avg-PR: 0.0192.

---

### Algorithm 6: XGBoost (eXtreme Gradient Boosting) — THE MAIN ENGINE

**What is it?** A sequential ensemble where each new tree is specifically designed to fix the mistakes of all previous trees.

**The key difference from Random Forest:**
- Random Forest: 100 trees built independently (in parallel). They don't know about each other.
- XGBoost: 200 trees built one after another (in sequence). Each tree studies the mistakes of all previous trees and tries to fix them.

**How does it work? (Step by step)**
1. **Tree 1:** Build a simple decision tree. It predicts probabilities. Calculate the errors (called **residuals**): 
   residual = actual_label - predicted_probability
   - If a fraud transaction was predicted as 10% fraud → residual = 1.0 - 0.1 = 0.9 (big error)
   - If a safe transaction was predicted as 5% fraud → residual = 0.0 - 0.05 = -0.05 (small error)

2. **Tree 2:** This tree does NOT try to predict Fraud/Safe. Instead, it predicts the RESIDUALS (mistakes) of Tree 1. By adding Tree 2's predictions to Tree 1's predictions, the combined result is more accurate.

3. **Tree 3:** Predicts the residuals of (Tree 1 + Tree 2).

4. Continue for 200 trees. Each tree makes the overall prediction slightly more accurate.

**Why "Gradient"?** The algorithm uses calculus (specifically, the gradient/derivative of the loss function) to figure out the optimal direction to improve. It's like walking downhill in a valley — the gradient tells you which direction is "down."

**The Loss Function (Log Loss):** This is the mathematical formula that measures "how wrong" the model is:
   L = -[y × log(p) + (1-y) × log(1-p)]
   - If actual label y=1 (fraud) and prediction p=0.9 → L = -[1×log(0.9)] = 0.105 (small loss, good!)
   - If actual label y=1 (fraud) and prediction p=0.1 → L = -[1×log(0.1)] = 2.302 (huge loss, bad!)

**Key settings in our project:**
- `n_estimators=200`: Build 200 sequential trees
- `max_depth=6`: Each tree can have at most 6 levels of questions (prevents overfitting)
- `learning_rate=0.05`: Each tree only contributes 5% of its correction. This is called "shrinkage" — slow learning leads to better generalization.
- `scale_pos_weight`: Automatically gives more importance to the rare fraud class

**Speed:** 3.69 milliseconds per prediction — fast enough for real-time banking.

---

## PART 5: GRAPH NEURAL NETWORKS (The Core Innovation)

---

### What is a Graph?

In mathematics, a Graph is NOT a bar chart or pie chart. It's a network of connected dots.

- **Nodes** (dots): Each transaction, user, device, or IP address is a node.
- **Edges** (lines connecting dots): Two nodes are connected if they share something in common.

**Example:** If Transaction A and Transaction B both used the same IP address (192.168.1.1), they are connected by an edge. If a fraudster's IP connects to 50 different transactions, that IP node has 50 edges — highly suspicious.

**In our project, edges are created based on:**
| Shared Property | Edge Weight | Why |
|---|---|---|
| Same IP Address | 0.8 | Shared IPs can indicate botnets |
| Same Sender Account | 1.0 | Strongest signal — same person |
| Same Device Hash | 1.0 | Same physical device = suspicious |
| Same Location | 0.4 | Weakest — many legit users share locations |

**Our graph:** 150,000 nodes connected by 13,604 edges.

---

### Algorithm 7: Degree Centrality

**What is it?** A simple count of how many connections each node has.

**Formula:** Degree Centrality = (number of edges connected to node) / (total nodes - 1)

**Why it matters:** A normal user account might have 1-2 connections. A fraudulent account controlling a botnet might have 50+ connections. This single number becomes a powerful feature for XGBoost.

---

### Algorithm 8: Louvain Community Detection

**What is it?** An algorithm that automatically discovers clusters (tight groups) of connected nodes.

**How does it work?**
1. Start: Every node is its own community (150,000 communities).
2. For each node, calculate: "Would the overall graph structure improve if I moved this node to its neighbor's community?" This is measured by **Modularity** — a score measuring how dense connections are WITHIN communities vs BETWEEN communities.
3. Move the node to whichever neighbor's community gives the highest modularity improvement.
4. Repeat until no more improvements can be made.
5. Collapse each community into a single "super-node" and repeat on the compressed graph.

**In our project:** After Louvain runs, each transaction gets a `cluster_id`. The code then calculates `cluster_fraud_ratio` — the percentage of fraud in that cluster. If a new transaction lands in a cluster where 15% of past transactions were fraud, that's a massive red flag.

---

### Algorithm 9: GCN (Graph Convolutional Network)

**What is it?** A neural network that operates on graph-structured data by averaging neighbor features.

**The intuition:** If your friends are all criminals, you're probably suspicious too. GCN formalizes this intuition mathematically.

**How does it work?**
1. Each node starts with its own features (amount, velocity, etc.).
2. In Layer 1: Each node's features are REPLACED by the average of its neighbors' features (plus its own). This is like asking: "What do the transactions around me look like?"
3. In Layer 2: The averaging happens again on the already-averaged features. Now each node contains information from neighbors-of-neighbors (2 hops away).
4. After 2-3 layers, each node's features encode information about its entire local neighborhood in the graph.

**Limitation:** GCN treats ALL neighbors equally. Sharing a Starbucks Wi-Fi connection is treated the same as sharing a unique, suspicious device hash.

**In our project:** AUC-ROC: 0.9955, Avg-PR: 0.4588.

---

### Algorithm 10: GraphSAGE (Sample and Aggregate)

**What is it?** A scalable GNN that randomly samples a fixed number of neighbors instead of using all of them.

**Why do we need it?** Imagine one IP address is used by 100,000 transactions. GCN would try to average ALL 100,000 neighbors — that would crash the computer. GraphSAGE says: "Just randomly pick 10 neighbors and aggregate them."

**How does it work?**
1. For each node, randomly **sample** K neighbors (e.g., K=10).
2. **Aggregate** (combine) the sampled neighbors' features using mean or max.
3. **Concatenate** the aggregated result with the node's own features.
4. Pass through a neural network layer.

**In our project:** AUC-ROC: 0.9974, Avg-PR: 0.5286 (best Avg-PR of all GNNs!).

---

### Algorithm 11: GAT (Graph Attention Network) — THE BEST GNN

**What is it?** A GNN that uses "Attention" to assign different importance weights to different neighbors.

**The intuition:** Not all connections are equally suspicious. GAT learns WHICH connections matter most.

**How does it work?**
1. For node i and its neighbor j, the algorithm calculates an "attention score" (how important is this connection?):
   - Concatenate node i's features with node j's features
   - Pass through a small neural network
   - Apply LeakyReLU activation (allows small negative values through)
   - Result: a raw attention score e_ij

2. Normalize all attention scores using **Softmax** (makes them sum to 1):
   - α_ij = exp(e_ij) / sum of exp(e_ik) for all neighbors k
   - Now α_ij is between 0 and 1

3. Update node i's features as a WEIGHTED average of neighbors:
   - h'_i = σ(Σ α_ij × W × h_j)
   - Neighbors with high α get more influence; neighbors with low α are mostly ignored

**Real example from our project:**
- Two transactions share a Starbucks Wi-Fi IP → GAT learns α ≈ 0.05 (not suspicious, ignore it)
- Two transactions share a unique device hash "DEV-X92K" → GAT learns α ≈ 0.85 (very suspicious, pay attention!)

**In our project:** AUC-ROC: 0.9983 (highest of ALL models), Avg-PR: 0.5013.

---

## PART 6: EVALUATION METRICS (Proving It Works)

---

### Why NOT Use Accuracy?

With 0.34% fraud, a model that says "SAFE" for everything gets 99.66% accuracy. That model is useless. We need metrics that specifically measure fraud detection quality.

---

### True Positives, False Positives, False Negatives

| | Model says FRAUD | Model says SAFE |
|---|---|---|
| **Actually FRAUD** | True Positive (TP) ✅ Caught it! | False Negative (FN) ❌ Missed it! |
| **Actually SAFE** | False Positive (FP) ⚠️ False alarm | True Negative (TN) ✅ Correct |

---

### Precision
**Formula:** Precision = TP / (TP + FP)
**Meaning:** "When the alarm goes off, how often is it actually fraud?"
- High precision = few false alarms
- Example: TP=41, FP=1793 → Precision = 41/1834 = **2.23%** (lots of false alarms)

### Recall (Sensitivity)
**Formula:** Recall = TP / (TP + FN)
**Meaning:** "Out of all actual fraud, how much did we catch?"
- High recall = catching most fraudsters
- Example: TP=41, FN=60 → Recall = 41/101 = **40.59%** (caught 41 out of 101)

### F1-Score
**Formula:** F1 = 2 × (Precision × Recall) / (Precision + Recall)
**Meaning:** The harmonic mean (balanced average) of Precision and Recall. It forces a balance — a model cannot cheat by just flagging everything or flagging nothing.

### AUC-ROC
**What it is:** Plot Recall (True Positive Rate) on the Y-axis and False Positive Rate on the X-axis across every possible threshold. The area under this curve is AUC-ROC.
- 0.5 = random coin flip (useless)
- 1.0 = perfect classifier
- Our GAT: **0.9983** (near perfect)

### Avg-PR (Average Precision) — PRIMARY METRIC
**What it is:** The area under the Precision-Recall curve.
**Why it's our primary metric:** On imbalanced datasets (0.34% fraud), AUC-ROC can look deceptively good. Avg-PR is stricter — it only cares about how well you detect the minority class.
- Random baseline: Avg-PR ≈ 0.0034 (equal to fraud ratio)
- Our XGBoost: 0.0210 → **6x better than random**
- Our GAT: 0.5013 → **147x better than random**

---

## PART 7: EXPLAINABLE AI (Opening the Black Box)

---

### Algorithm 12: SHAP (SHapley Additive exPlanations)

**What is it?** A method to explain WHY a specific prediction was made, based on game theory.

**The intuition:** Imagine 4 players (features: Amount, Velocity, Location, Device) playing a cooperative game. The "payout" is the fraud probability (e.g., 85%). SHAP calculates exactly how much each player contributed.

**How does it work?**
1. Start with the baseline prediction (average fraud rate, e.g., 0.34%).
2. Add features one at a time, in EVERY possible order, and measure how the prediction changes.
3. The Shapley value for each feature = average contribution across all orderings.

**Example:** For a transaction predicted as 85% fraud:
- Baseline: 0.34%
- Velocity Score pushed it up by: **+42%**
- Amount pushed it up by: **+25%**
- Geo Anomaly pushed it up by: **+15%**
- Device Type pushed it up by: **+3%**
- Total: 0.34 + 42 + 25 + 15 + 3 = **85.34%** ≈ 85%

This breakdown appears on the dashboard so an analyst can see exactly which feature caused the flag.

---

### Algorithm 13: GNNExplainer

**What is it?** An algorithm that explains the Graph Neural Network's decisions by finding the most important connections.

**How does it work?**
1. For a flagged node, create a learnable "mask" (weight between 0 and 1) for every edge.
2. Optimize these masks to find the smallest subgraph that still produces the same prediction.
3. Edges with mask ≈ 1.0 are important. Edges with mask ≈ 0.0 are irrelevant.

**Result:** "This transaction was flagged because it connects to Device DEV-X92K, which is linked to 3 known fraud accounts."

---

### Algorithm 14: CalibratedClassifierCV

**What is it?** A post-processing technique that adjusts model outputs to be true probabilities.

**The problem:** When XGBoost says "70% fraud," does it truly mean 70 out of 100 such transactions are fraud? Often no. Raw model scores are poorly calibrated.

**How does it work?** It fits a second model (either Logistic Regression or Isotonic Regression) on top of the raw scores to map them to true probabilities, using 3-fold cross-validation.

---

## PART 8: THE FULL-STACK APPLICATION

---

### Frontend (React + Vite)
- **React:** A JavaScript library for building interactive user interfaces
- **Vite:** A fast development server that hot-reloads your browser when code changes
- **Recharts:** A charting library used for the dashboard graphs
- The user sees: Dashboard with metrics, Prediction page with risk levels, Network graph visualizer

### Backend (FastAPI)
- **FastAPI:** A Python web framework that creates REST API endpoints
- **Endpoints:**
  - `POST /train` → Triggers the full training pipeline
  - `POST /predict` → Takes a transaction, returns fraud probability
  - `GET /metrics` → Returns dashboard statistics
  - `GET /model-comparison` → Returns model performance tables
- **Speed:** Asynchronous (handles multiple requests simultaneously)

### Database (SQLite + SQLAlchemy)
- **SQLite:** A lightweight database stored as a single file (`fraud_detection.db`)
- **SQLAlchemy:** A Python ORM (Object-Relational Mapping) that lets you interact with the database using Python code instead of raw SQL
- **Stores:** Every predicted transaction with its fraud probability and verdict (audit trail)

---

## PART 9: CROSS-DATASET VALIDATION

---

### What is it?
Training the exact same pipeline architecture on a COMPLETELY DIFFERENT dataset to prove it works universally — not just on the original data.

### The Two Datasets

| Property | PaySim (Primary) | IEEE-CIS (Validation) |
|---|---|---|
| Source | Mobile money logs | E-commerce transactions |
| Fraud Ratio | 0.34% | 2.65% |
| Features | velocity_score, geo_anomaly | TransactionAmt, C1-C14, V1-V50 |

### Key Point
The columns are COMPLETELY DIFFERENT. We do NOT transfer the trained model from PaySim to IEEE-CIS. Instead, we build a brand new model using the same pipeline design (Scaling → Encoding → SMOTE → XGBoost) but trained from scratch on IEEE-CIS data. Both achieve strong AUC-ROC (>91%), proving the ARCHITECTURE is universally applicable.
