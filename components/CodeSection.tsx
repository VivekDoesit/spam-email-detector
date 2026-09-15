import { useState } from "react";
import { CodeIcon, TerminalIcon } from "./Icons";

const codeSnippets = [
  {
    id: "preprocess",
    label: "Preprocessing",
    icon: "🧹",
    language: "python",
    code: `import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

stemmer    = PorterStemmer()
STOP_WORDS = set(stopwords.words("english"))

def clean_text(text: str) -> str:
    """
    Full NLP preprocessing pipeline:
    1. Lowercase  2. Remove URLs/emails/phones
    3. Remove punctuation  4. Tokenize
    5. Remove stopwords  6. Porter Stemming
    """
    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove noise patterns
    text = re.sub(r"http\\S+|www\\S+", " url ", text)
    text = re.sub(r"\\S+@\\S+", " email ", text)
    text = re.sub(r"\\b\\d{10,}\\b", " phone ", text)
    
    # 3. Remove punctuation
    text = re.sub(r"[^a-z\\s]", " ", text)
    text = re.sub(r"\\s+", " ", text).strip()
    
    # 4. Tokenize
    tokens = word_tokenize(text)
    
    # 5. Stopword removal + 6. Stemming
    tokens = [
        stemmer.stem(t) 
        for t in tokens 
        if t not in STOP_WORDS and len(t) > 2
    ]
    
    return " ".join(tokens)

# Example:
original = "WINNER!! Call NOW to claim your FREE prize!"
cleaned  = clean_text(original)
# → "winner call claim free prize"
`,
  },
  {
    id: "features",
    label: "Feature Extraction",
    icon: "🔢",
    language: "python",
    code: `from sklearn.feature_extraction.text import (
    CountVectorizer, TfidfVectorizer
)
from sklearn.model_selection import train_test_split

# 80/20 Stratified Split
X_train, X_test, y_train, y_test = train_test_split(
    df["clean_text"], 
    df["label_num"],
    test_size=0.2,
    random_state=42,
    stratify=df["label_num"]  # Preserve class ratio
)

# ── TF-IDF (Recommended) ──────────────────────────────
tfidf = TfidfVectorizer(
    max_features=5000,      # Top 5K vocabulary
    ngram_range=(1, 2),     # Unigrams + Bigrams
    min_df=2,               # Ignore rare terms
    sublinear_tf=True,      # log(1 + tf) scaling
)

X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf  = tfidf.transform(X_test)
# Shape: (4459, 5000) sparse matrix

# ── Bag of Words (Alternative) ────────────────────────
bow = CountVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
)
X_train_bow = bow.fit_transform(X_train)
`,
  },
  {
    id: "training",
    label: "Model Training",
    icon: "🤖",
    language: "python",
    code: `from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression

# ── Model 1: Multinomial Naive Bayes ─────────────────
nb_model = MultinomialNB(
    alpha=0.1       # Laplace smoothing (0 = no smoothing)
)
nb_model.fit(X_train_tfidf, y_train)

# ── Model 2: Logistic Regression ──────────────────────
lr_model = LogisticRegression(
    C=5.0,          # Inverse of regularization strength
    solver="lbfgs", # Limited-memory BFGS optimizer
    max_iter=1000,  # Ensure convergence
    random_state=42,
)
lr_model.fit(X_train_tfidf, y_train)

# ── Training complete ──────────────────────────────────
print(f"NB  vocab size : {len(nb_model.feature_count_[0]):,}")
print(f"LR  coef shape : {lr_model.coef_.shape}")

# Top 10 spam-indicating features (Naive Bayes)
import numpy as np
feature_names = np.array(tfidf.get_feature_names_out())
spam_idx      = np.argsort(nb_model.feature_log_prob_[1])[-10:]
print("Top spam words:", feature_names[spam_idx])
`,
  },
  {
    id: "evaluation",
    label: "Evaluation",
    icon: "📊",
    language: "python",
    code: `from sklearn.metrics import (
    accuracy_score, precision_score,
    recall_score, f1_score,
    confusion_matrix, classification_report
)

def evaluate_model(model, X_test, y_test, name):
    y_pred = model.predict(X_test)
    
    metrics = {
        "accuracy"  : accuracy_score(y_test, y_pred),
        "precision" : precision_score(y_test, y_pred),
        "recall"    : recall_score(y_test, y_pred),
        "f1"        : f1_score(y_test, y_pred),
        "confusion" : confusion_matrix(y_test, y_pred),
    }
    
    print(f"\\n{'─'*50}")
    print(f"  {name}")
    print(f"{'─'*50}")
    print(f"  Accuracy  : {metrics['accuracy']:.4f}")
    print(f"  Precision : {metrics['precision']:.4f}")
    print(f"  Recall    : {metrics['recall']:.4f}")
    print(f"  F1-Score  : {metrics['f1']:.4f}")
    print(classification_report(
        y_test, y_pred,
        target_names=["Ham","Spam"]
    ))
    return metrics

nb_metrics = evaluate_model(nb_model, X_test_tfidf, y_test, "Naive Bayes")
lr_metrics = evaluate_model(lr_model, X_test_tfidf, y_test, "Logistic Regression")
`,
  },
  {
    id: "prediction",
    label: "Live Prediction",
    icon: "🔍",
    language: "python",
    code: `import joblib

# ── Save trained model ────────────────────────────────
joblib.dump(lr_model, "models/lr_model.joblib")
joblib.dump(tfidf,    "models/lr_vectorizer.joblib")
print("✓ Model saved.")

# ── Load and predict (no retraining needed) ───────────
model      = joblib.load("models/lr_model.joblib")
vectorizer = joblib.load("models/lr_vectorizer.joblib")

def predict_email(text: str) -> dict:
    cleaned = clean_text(text)
    vec     = vectorizer.transform([cleaned])
    label   = model.predict(vec)[0]
    proba   = model.predict_proba(vec)[0]
    
    return {
        "verdict"    : "SPAM" if label == 1 else "HAM",
        "spam_prob"  : f"{proba[1]*100:.1f}%",
        "ham_prob"   : f"{proba[0]*100:.1f}%",
        "confidence" : f"{max(proba)*100:.1f}%",
    }

# Test it!
spam_email = "WINNER!! Call NOW to claim your FREE prize!"
ham_email  = "Hey, are you coming to dinner tonight?"

print(predict_email(spam_email))
# → {'verdict': 'SPAM', 'spam_prob': '98.7%', ...}
print(predict_email(ham_email))
# → {'verdict': 'HAM', 'ham_prob': '99.2%', ...}
`,
  },
  {
    id: "cli",
    label: "CLI Interface",
    icon: "💻",
    language: "bash",
    code: `# ── Installation ─────────────────────────────────────
git clone https://github.com/you/spamshield-ai
cd spamshield-ai
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# ── Full Training Pipeline ────────────────────────────
python spam_detector.py

# ── Interactive Mode ──────────────────────────────────
python spam_detector.py --predict

# ── Single Email Prediction ───────────────────────────
python spam_detector.py \\
  --text "Win a FREE prize! Call now!"

# ── Use Bag-of-Words features ─────────────────────────
python spam_detector.py --method bow

# ── Use Naive Bayes for prediction ───────────────────
python spam_detector.py --predict --model naive_bayes

# ── Skip plots (headless server) ─────────────────────
python spam_detector.py --no-plots

# ── Expected Output ───────────────────────────────────
# ┌─ Logistic Regression ─────────────────────────────┐
# │  Input      : Win a FREE prize! Call now!          │
# │  Verdict    : 🚨 SPAM                               │
# │  Confidence : 98.7%                                │
# └────────────────────────────────────────────────────┘
`,
  },
];

export default function CodeSection() {
  const [activeSnippet, setActiveSnippet] = useState("preprocess");
  const [copied, setCopied] = useState(false);

  const active = codeSnippets.find((s) => s.id === activeSnippet)!;

  const copyCode = async () => {
    await navigator.clipboard.writeText(active.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting
  const highlight = (code: string) => {
    return code
      .replace(/(#[^\n]*)/g, '<span class="text-gray-500 italic">$1</span>')
      .replace(/\b(def|class|import|from|return|if|else|elif|for|in|not|and|or|True|False|None|print|with|as)\b/g, '<span class="text-violet-400 font-semibold">$1</span>')
      .replace(/\b(str|int|float|dict|list|set|bool)\b/g, '<span class="text-blue-300">$1</span>')
      .replace(/"([^"]*?)"/g, '<span class="text-emerald-300">"$1"</span>')
      .replace(/'([^']*?)'/g, "<span class=\"text-emerald-300\">'$1'</span>")
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-300">$1</span>');
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0d1428] to-[#0a0f1e]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-4">
            <CodeIcon className="w-4 h-4" />
            Source Code
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Explore the Code
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Clean, well-documented Python code following ML best practices.
            Each component is modular and independently testable.
          </p>
        </div>

        {/* Code Editor */}
        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
          {/* Editor Tab Bar */}
          <div className="bg-[#1a1f35] border-b border-white/10 flex items-center gap-1 px-4 py-2 overflow-x-auto">
            <div className="flex gap-1.5 mr-4 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            {codeSnippets.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => setActiveSnippet(snippet.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeSnippet === snippet.id
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <span>{snippet.icon}</span>
                {snippet.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-gray-600 font-mono">spam_detector.py</span>
              <button
                onClick={copyCode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                {copied ? (
                  <><span>✓</span> Copied!</>
                ) : (
                  <><span>📋</span> Copy</>
                )}
              </button>
            </div>
          </div>

          {/* Code Content */}
          <div className="bg-[#0f1624] p-6 overflow-auto max-h-[520px]">
            <div className="flex gap-4">
              {/* Line numbers */}
              <div className="flex flex-col text-right text-xs text-gray-700 font-mono select-none flex-shrink-0 pt-0.5">
                {active.code.split("\n").map((_, i) => (
                  <span key={i} className="leading-6">{i + 1}</span>
                ))}
              </div>
              {/* Code */}
              <pre
                className="text-sm font-mono leading-6 text-gray-300 overflow-x-auto flex-1"
                dangerouslySetInnerHTML={{ __html: highlight(active.code) }}
              />
            </div>
          </div>

          {/* Status bar */}
          <div className="bg-[#1a1f35] border-t border-white/10 px-4 py-1.5 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <TerminalIcon className="w-3 h-3" />
                Python 3.10+
              </span>
              <span>{active.code.split("\n").length} lines</span>
            </div>
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span>LF</span>
              <span className="flex items-center gap-1 text-emerald-500/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Pylint: 9.8/10
              </span>
            </div>
          </div>
        </div>

        {/* Quick commands */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { cmd: "pip install -r requirements.txt", desc: "Install all dependencies", icon: "📦" },
            { cmd: "python spam_detector.py", desc: "Run full training pipeline", icon: "🚀" },
            { cmd: "python spam_detector.py --predict", desc: "Interactive CLI mode", icon: "💬" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-mono text-sm text-blue-300 mb-1.5 break-all">{item.cmd}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

