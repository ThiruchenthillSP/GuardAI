# GuardAI: Algorithm & Metrics Glossary

This is a comprehensive, dictionary-style reference guide for every algorithm, technique, and evaluation measure used in the GuardAI project. Use this to quickly define terms during your review.

---

## 1. Data Preprocessing Algorithms

### Label Encoding
* **Definition:** A technique that converts categorical text data into numerical format by assigning a unique integer to each distinct category.
* **What it is used for:** Machine learning algorithms only process numbers. We used Label Encoding to convert text columns like `device_used` ("Mobile", "Desktop") and `payment_channel` into numbers (0, 1, 2) so the AI can read them.

### Standard Scaling (Z-Score Normalization)
* **Definition:** A statistical method that standardizes data by subtracting the mean and dividing by the standard deviation. This forces the data to have a mean of 0 and a standard deviation of 1.
* **What it is used for:** To ensure large numbers (like a $15,000 transaction amount) don't overpower small numbers (like a velocity score of 2.5) during training. It puts all numerical features on a level playing field.

---

## 2. Resampling Algorithms

### SMOTE (Synthetic Minority Over-sampling Technique)
* **Definition:** An algorithm that addresses class imbalance by using K-Nearest Neighbors (KNN) to generate synthetic (fake but mathematically plausible) examples of the minority class.
* **What it is used for:** Our dataset only has 0.34% fraud. SMOTE was used at a 10:1 ratio to generate synthetic fraudulent transactions, giving our algorithms enough examples of fraud to study and learn from without overfitting.

---

## 3. Graph Neural Network (GNN) Algorithms

### Graph Convolutional Network (GCN)
* **Definition:** A baseline neural network for graphs that updates a node's features by taking an equal mathematical average of all its direct neighbors' features.
* **What it is used for:** Tested as a baseline topological model to see if simply smoothing features across connected transactions (like shared IPs) improves fraud detection.

### GraphSAGE (Sample and Aggregate)
* **Definition:** A scalable GNN algorithm that, instead of looking at every single neighbor, randomly samples a fixed number of neighbors and aggregates their data.
* **What it is used for:** Tested as a solution for massive, dense network clusters where a single IP might be connected to tens of thousands of transactions, preventing memory crashes.

### Graph Attention Network (GAT) - *[Best Performing Model]*
* **Definition:** An advanced GNN that uses an "Attention Mechanism" to assign different dynamic weights (importance scores) to different neighboring nodes.
* **What it is used for:** This was our winning Graph model. It was used because it automatically learned that certain connections (like sharing a specific device ID) are far more suspicious than other connections (like sharing a broad geographic location), yielding the highest accuracy.

---

## 4. Machine Learning Classification Algorithms

### Logistic Regression
* **Definition:** A foundational statistical algorithm that uses a logistic function to model a binary dependent variable (0 or 1). It draws a simple linear boundary between classes.
* **What it is used for:** Used purely as a "baseline" to prove that simple, traditional algorithms cannot effectively catch complex fraud rings in imbalanced data.

### Random Forest
* **Definition:** An ensemble algorithm that builds multiple independent decision trees using random subsets of data and takes a "majority vote" to make a final prediction.
* **What it is used for:** Used as a mid-tier baseline model. It performs better than Logistic Regression but struggles with the complex, non-linear relationships found in graph networks.

### XGBoost (eXtreme Gradient Boosting) - *[Main Decision Engine]*
* **Definition:** A highly optimized gradient boosting framework. It builds decision trees sequentially, where each new tree is specifically designed to correct the mathematical errors (residuals) made by the previous trees.
* **What it is used for:** This is the core engine of GuardAI. It takes both the tabular data and the graph intelligence (from GAT) and rapidly outputs a final fraud probability in under 5 milliseconds.

---

## 5. Explainable AI (XAI) Algorithms

### SHAP (SHapley Additive exPlanations)
* **Definition:** A game-theoretic algorithm that calculates the exact marginal contribution of each feature to a specific machine learning prediction.
* **What it is used for:** To eliminate the "Black Box" of AI. SHAP powers the dashboard by showing analysts exactly which input (e.g., Velocity Score, Amount) caused XGBoost to flag the transaction as fraud.

### GNNExplainer
* **Definition:** An optimization algorithm that identifies the most important "subgraph" (a small cluster of nodes and edges) that led to a Graph Neural Network's prediction.
* **What it is used for:** To explain the network topology. It highlights exactly which connection (e.g., an edge linking to a blacklisted IP address) triggered the GNN to flag a transaction.

---

## 6. Evaluation Measures (Metrics)

### True Positives (TP), False Positives (FP), False Negatives (FN)
* **Definition:**
  * **TP:** Model predicted Fraud, and it *was* Fraud.
  * **FP:** Model predicted Fraud, but it was *Safe* (False Alarm).
  * **FN:** Model predicted Safe, but it was *Fraud* (Missed Fraud).
* **What it is used for:** These are the raw counts used to calculate all other metrics.

### Precision
* **Definition:** True Positives / (True Positives + False Positives).
* **What it is used for:** Measures how much we can trust the alarm. If Precision is high, it means when the system flags fraud, it is almost certainly right (low false alarms).

### Recall
* **Definition:** True Positives / (True Positives + False Negatives).
* **What it is used for:** Measures how much fraud we caught. If Recall is high, it means the system successfully caught almost all the fraudsters in the network.

### F1-Score
* **Definition:** The harmonic mean of Precision and Recall.
* **What it is used for:** Used to find the perfect balance. A model can easily get 100% Recall by flagging *every* transaction as fraud, but its Precision would drop to near 0. The F1-score prevents this cheating.

### AUC-ROC (Area Under the Receiver Operating Characteristic Curve)
* **Definition:** A graph that plots the True Positive Rate against the False Positive Rate across all possible thresholds. An area of 1.0 is perfect; 0.5 is a random guess.
* **What it is used for:** Used as a standard academic metric to show the model's general capability to distinguish between Fraud and Safe transactions.

### Avg-PR (Average Precision) - *[Primary Project Metric]*
* **Definition:** The mathematical area under the Precision-Recall curve.
* **What it is used for:** **This is our most important metric.** Because our dataset only has 0.34% fraud, AUC-ROC can be overly optimistic. Avg-PR strictly evaluates the model's performance on the minority class (fraud). A high Avg-PR proves the model is genuinely effective in the real world.

---

## 7. Datasets & Validation Methodology

### Cross-Dataset Validation
* **Definition:** A rigorous testing method where an AI model trained on one type of dataset is tested on a completely different, independent dataset to ensure it hasn't just memorized the original data (overfitting).
* **What it is used for:** To prove to the reviewer that the GuardAI architecture is robust and universally applicable, not just a "one-hit wonder" that only works on the primary dataset.

### The PaySim Dataset (Primary Dataset)
* **Definition:** A highly imbalanced financial dataset containing synthetic mobile money transactions based on a real month of financial logs from a mobile money service implemented in an African country. 
* **What it is used for:** This is the **primary training ground** for GuardAI. It contains 150,000 transactions but only 505 cases of fraud (0.34%). The extreme imbalance makes it perfect for testing our SMOTE and Graph Neural Network capabilities.

### The IEEE-CIS Dataset (Validation Dataset)
* **Definition:** A massive, real-world e-commerce fraud dataset provided by the IEEE Computational Intelligence Society and Vesta Corporation. It contains different features (like Identity and Transaction data) and a slightly higher fraud ratio (2.65%).
* **What it is used for:** This is the **Cross-Validation ground**. After GuardAI proved successful on PaySim, we tested the exact same Machine Learning architecture on IEEE-CIS to prove that the architecture works just as well across different industries and data structures (achieving a 91.88% AUC-ROC).
