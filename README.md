# 🛡️ SpamShield AI — Email Spam Detection System

> A production-grade spam detection pipeline using NLP + Machine Learning  
> Naive Bayes × Logistic Regression | TF-IDF | SMS Spam Collection Dataset

---

## 📌 Project Overview

SpamShield AI is a complete, end-to-end email/SMS spam classification system that demonstrates real-world NLP and Machine Learning pipeline implementation — similar to spam filters used in Gmail and Outlook.

### 🎯 Key Features

| Feature | Details |
|---|---|
| **Dataset** | UCI SMS Spam Collection (5,574 messages) |
| **Models** | Naive Bayes (MultinomialNB) + Logistic Regression |
| **Features** | TF-IDF & Bag-of-Words (unigrams + bigrams) |
| **Preprocessing** | Lowercasing, URL/email removal, stemming, stopword removal |
| **Evaluation** | Accuracy, Precision, Recall, F1-Score, Confusion Matrix |
| **Persistence** | Model saved/loaded via joblib |
| **CLI** | Interactive real-time prediction mode |
| **Visualization** | Confusion matrices, model comparison charts |

---

## 📂 Project Structure

```
spam_detector/
├── spam_detector.py      ← Main script (full pipeline)
├── requirements.txt      ← Python dependencies
├── README.md             ← This file
├── data/
│   └── sms_spam.tsv      ← Dataset (auto-downloaded)
├── models/
│   ├── naive_bayes_model.joblib
│   ├── naive_bayes_vectorizer.joblib
│   ├── logistic_regression_model.joblib
│   └── logistic_regression_vectorizer.joblib
└── plots/
    ├── label_distribution.png
    ├── confusion_naive_bayes.png
    ├── confusion_logistic_regression.png
    └── model_comparison.png
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.8 or higher
- pip

### 1. Clone or Download

```bash
git clone https://github.com/yourname/spamshield-ai.git
cd spamshield-ai
```

### 2. Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🚀 How to Run

### Option 1 — Full Training Pipeline (Default)

Runs the complete ML pipeline: download data → preprocess → train → evaluate → visualize → save models.

```bash
python spam_detector.py
```

### Option 2 — Interactive CLI Mode

Load saved model and interactively classify your own text:

```bash
python spam_detector.py --predict
```

### Option 3 — Single Text Prediction

Predict a single email/SMS directly from the command line:

```bash
python spam_detector.py --text "Congratulations! You've won a $1000 prize. Call now!"
```

### Option 4 — Use Bag-of-Words Instead of TF-IDF

```bash
python spam_detector.py --method bow
```

### Option 5 — Skip Visualizations

```bash
python spam_detector.py --no-plots
```

### Option 6 — Use Naive Bayes for Predictions

```bash
python spam_detector.py --predict --model naive_bayes
```

---

## 📊 Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 6 | Model Evaluation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ────────────────────────────────────────────────────────────
  📊  Evaluation Report — Logistic Regression
  ────────────────────────────────────────────────────────────
  Metric               Score
  ──────────────────────────────
  Accuracy             0.9834  (98.34%)
  Precision            0.9756
  Recall               0.9318
  F1-Score             0.9532
```

### Interactive CLI Example

```
📧  Enter email/SMS text: Free entry win a prize! Call now to claim.

  ┌─ Logistic Regression Prediction ──────────────────────────────┐
  │  Input      : Free entry win a prize! Call now to claim.      │
  │  Verdict    : 🚨 SPAM                                         │
  │  Confidence : 98.7%                                           │
  │  Spam Prob  : 98.7%                                           │
  │  Ham Prob   : 1.3%                                            │
  └───────────────────────────────────────────────────────────────┘
```

---

## 🧠 ML Pipeline Explained

```
Raw Text
   │
   ▼
Text Cleaning (lowercase, remove URLs, emails, phone#, punctuation)
   │
   ▼
Tokenization (NLTK word_tokenize)
   │
   ▼
Stopword Removal (NLTK English stopwords)
   │
   ▼
Porter Stemming (reduce words to root form)
   │
   ▼
Feature Extraction (TF-IDF with unigrams + bigrams, 5000 features)
   │
   ├──► Multinomial Naive Bayes ──► Evaluation Metrics
   │
   └──► Logistic Regression ────► Evaluation Metrics
                                          │
                                          ▼
                                   Best Model Selected
                                   Model Saved (joblib)
```

---

## 📈 Results (Typical on SMS Spam Collection)

| Model | Accuracy | Precision | Recall | F1-Score |
|---|---|---|---|---|
| **Naive Bayes** | ~97.8% | ~100% | ~89% | ~94% |
| **Logistic Regression** | ~98.3% | ~97.5% | ~93.2% | **~95.3%** |

> **Winner: Logistic Regression** — Higher F1-score, better balance between precision and recall.

---

## 🔧 Configuration

All key hyperparameters are documented inline in `spam_detector.py`:

| Parameter | Value | Description |
|---|---|---|
| `test_size` | 0.20 | 80/20 train-test split |
| `max_features` | 5000 | Max vocabulary size |
| `ngram_range` | (1, 2) | Unigrams + bigrams |
| `nb alpha` | 0.1 | Laplace smoothing |
| `lr C` | 5.0 | Regularization strength |
| `lr max_iter` | 1000 | Convergence iterations |

---

## 🗂️ Dataset

**SMS Spam Collection v.1** — UCI Machine Learning Repository  
- 5,574 SMS messages (4,827 ham + 747 spam)  
- Auto-downloaded from GitHub mirror on first run  
- Source: https://archive.ics.uci.edu/ml/datasets/SMS+Spam+Collection

---

## 📦 Dependencies

| Library | Version | Purpose |
|---|---|---|
| scikit-learn | ≥1.3.0 | ML models, vectorizers, metrics |
| pandas | ≥2.0.0 | Data manipulation |
| numpy | ≥1.24.0 | Numerical operations |
| matplotlib | ≥3.7.0 | Visualization |
| seaborn | ≥0.12.0 | Enhanced plots |
| nltk | ≥3.8.0 | NLP preprocessing |
| joblib | ≥1.3.0 | Model persistence |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License — Free for personal and commercial use.

---

*Built to demonstrate practical NLP and ML pipeline implementation.*
