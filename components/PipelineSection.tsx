import { useEffect, useRef, useState } from "react";
import { DatabaseIcon, FilterIcon, CpuIcon, ChartIcon, DownloadIcon } from "./Icons";

const steps = [
  {
    icon: DatabaseIcon,
    number: "01",
    title: "Data Loading",
    subtitle: "SMS Spam Collection Dataset",
    color: "blue",
    items: [
      "Auto-download from UCI repository",
      "5,574 labeled SMS messages",
      "4,827 Ham (86.6%) + 747 Spam (13.4%)",
      "Fallback synthetic dataset if offline",
    ],
    code: `df = pd.read_csv(path, sep='\\t',
    names=['label','text'])
df['label_num'] = df['label'].map(
    {'spam': 1, 'ham': 0})`,
  },
  {
    icon: FilterIcon,
    number: "02",
    title: "Text Preprocessing",
    subtitle: "NLP Cleaning Pipeline",
    color: "violet",
    items: [
      "Lowercase normalization",
      "URL / email / phone removal",
      "Punctuation stripping",
      "Stopword removal (NLTK)",
      "Porter Stemming",
    ],
    code: `text = text.lower()
text = re.sub(r'http\\S+', ' url ', text)
tokens = word_tokenize(text)
tokens = [stemmer.stem(t) for t in tokens
          if t not in STOP_WORDS]`,
  },
  {
    icon: CpuIcon,
    number: "03",
    title: "Feature Extraction",
    subtitle: "Text → Numerical Vectors",
    color: "emerald",
    items: [
      "TF-IDF Vectorizer (default)",
      "Bag-of-Words alternative",
      "5,000 max features",
      "Unigrams + Bigrams (1,2)-gram",
      "Log sublinear TF scaling",
    ],
    code: `vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    sublinear_tf=True)
X_train_vec = vectorizer.fit_transform(X)`,
  },
  {
    icon: ChartIcon,
    number: "04",
    title: "Model Training",
    subtitle: "Naive Bayes + Logistic Regression",
    color: "orange",
    items: [
      "80/20 stratified train-test split",
      "MultinomialNB (α=0.1)",
      "LogisticRegression (C=5.0, lbfgs)",
      "Trained on vectorized features",
    ],
    code: `nb  = MultinomialNB(alpha=0.1)
lr  = LogisticRegression(C=5.0,
          max_iter=1000)
nb.fit(X_train_vec, y_train)
lr.fit(X_train_vec, y_train)`,
  },
  {
    icon: DownloadIcon,
    number: "05",
    title: "Evaluation & Save",
    subtitle: "Metrics + Persistence",
    color: "pink",
    items: [
      "Accuracy, Precision, Recall, F1",
      "Confusion matrix visualization",
      "Model comparison bar chart",
      "Save model with joblib",
      "CLI interactive prediction",
    ],
    code: `f1 = f1_score(y_test, y_pred)
cm = confusion_matrix(y_test, y_pred)
joblib.dump(model, 'model.joblib')
# Load later:
model = joblib.load('model.joblib')`,
  },
];

const colorMap: Record<string, string> = {
  blue: "from-blue-500 to-blue-600 shadow-blue-500/30",
  violet: "from-violet-500 to-violet-600 shadow-violet-500/30",
  emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30",
  orange: "from-orange-500 to-orange-600 shadow-orange-500/30",
  pink: "from-pink-500 to-pink-600 shadow-pink-500/30",
};

const borderMap: Record<string, string> = {
  blue: "border-blue-500/20 hover:border-blue-500/40",
  violet: "border-violet-500/20 hover:border-violet-500/40",
  emerald: "border-emerald-500/20 hover:border-emerald-500/40",
  orange: "border-orange-500/20 hover:border-orange-500/40",
  pink: "border-pink-500/20 hover:border-pink-500/40",
};

const textMap: Record<string, string> = {
  blue: "text-blue-400",
  violet: "text-violet-400",
  emerald: "text-emerald-400",
  orange: "text-orange-400",
  pink: "text-pink-400",
};

const bgMap: Record<string, string> = {
  blue: "bg-blue-500/10",
  violet: "bg-violet-500/10",
  emerald: "bg-emerald-500/10",
  orange: "bg-orange-500/10",
  pink: "bg-pink-500/10",
};

export default function PipelineSection() {
  const [visible, setVisible] = useState<boolean[]>(steps.map(() => false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = steps.map((_, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 120);
          }
        },
        { threshold: 0.15 }
      );
      if (refs.current[i]) observer.observe(refs.current[i]!);
      return observer;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0a0f1e] to-[#0d1428]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
            <CpuIcon className="w-4 h-4" />
            Complete ML Pipeline
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            How SpamShield Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A modular, production-ready pipeline from raw text to real-time predictions —
            each step is a separate function following ML best practices.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                className={`grid lg:grid-cols-2 gap-6 p-6 rounded-2xl border ${borderMap[step.color]} bg-white/[0.02] backdrop-blur-sm transition-all duration-700 ${
                  visible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {/* Left: Info */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[step.color]} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-mono font-bold ${textMap[step.color]}`}>
                        STEP {step.number}
                      </span>
                      <span className="text-xs text-gray-500">{step.subtitle}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <ul className="space-y-1.5">
                      {step.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-br ${colorMap[step.color]}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: Code */}
                <div className={`rounded-xl ${bgMap[step.color]} border ${borderMap[step.color]} p-4 font-mono text-sm`}>
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    </div>
                    <span className={`text-xs ${textMap[step.color]} opacity-70`}>
                      spam_detector.py
                    </span>
                  </div>
                  <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
                    {step.code}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flow Arrow Summary */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-gray-400">
          {["Raw Text", "Cleaned Text", "TF-IDF Matrix", "Naive Bayes", "Logistic Regression", "Prediction"].map(
            (label, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

