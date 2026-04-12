# GuardAI — Dataset Download Links

This project uses two datasets that are too large for GitHub (650MB+). Download them manually using the links below.

---

## 1. PaySim-Style Synthetic Financial Fraud Dataset

- **Kaggle:** https://www.kaggle.com/datasets/aryan208/financial-transactions-dataset-for-fraud-detection
- **Filename:** `financial_fraud_detection_dataset.csv`
- **Size:** ~759 MB
- **Rows:** 150,000 (capped during training for OOM safety)
- **Fraud Ratio:** 0.34% (505 fraudulent transactions)
- **Place in:** `backend/financial_fraud_detection_dataset.csv`

### Download via Kaggle CLI:
```bash
kaggle datasets download aryan208/financial-transactions-dataset-for-fraud-detection
```

---

## 2. IEEE-CIS Fraud Detection Dataset

- **Kaggle:** https://www.kaggle.com/c/ieee-fraud-detection/data
- **Files needed:**
  - `train_transaction.csv` (~652 MB)
  - `train_identity.csv` (~25 MB)
- **Rows:** 150,000 (capped during training)
- **Fraud Ratio:** 2.65% (3,970 fraudulent transactions)
- **Place in:** `backend/ieee_cis/`

### Download via Kaggle CLI:
```bash
kaggle competitions download -c ieee-fraud-detection
unzip ieee-fraud-detection.zip -d backend/ieee_cis/
```

---

## Directory Structure After Download

```
backend/
├── financial_fraud_detection_dataset.csv    ← Dataset 1
├── ieee_cis/
│   ├── train_transaction.csv                ← Dataset 2 (transactions)
│   └── train_identity.csv                   ← Dataset 2 (identity)
├── main.py
├── models/
│   ├── gnn.py
│   └── trainer.py
└── preprocessing/
    └── cleaner.py
```

---

## Kaggle CLI Setup (if needed)

1. Install: `pip install kaggle`
2. Get API token from https://www.kaggle.com/settings → "Create New Token"
3. Place `kaggle.json` in `~/.kaggle/` (Linux/Mac) or `C:\Users\<you>\.kaggle\` (Windows)
4. Run the download commands above

---

## Notes

- Both datasets are **required** for the full training pipeline (`/train` endpoint)
- The PaySim dataset is used for primary model training and GNN evaluation
- The IEEE-CIS dataset is used for cross-dataset validation only
- Training is capped at 150,000 rows per dataset for memory safety
