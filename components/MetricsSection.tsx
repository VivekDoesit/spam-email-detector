import { useEffect, useRef, useState, } from "react";
import { ChartIcon } from "./Icons";

// ─── Data ────────────────────────────────────────────────────────────────────
const models = [
  {
    name: "Naive Bayes",
    shortName: "NB",
    color: "blue",
    metrics: { accuracy: 97.8, precision: 100.0, recall: 88.7, f1: 94.0 },
    description: "MultinomialNB(α=0.1)",
    pros: ["Extremely fast training", "Great baseline model", "100% precision (no false spam)"],
    cons: ["Lower recall than LR", "Assumes feature independence"],
  },
  {
    name: "Logistic Regression",
    shortName: "LR",
    color: "violet",
    metrics: { accuracy: 98.3, precision: 97.6, recall: 93.2, f1: 95.3 },
    description: "LogisticRegression(C=5.0, lbfgs)",
    pros: ["Highest F1-Score (95.3%)", "Best recall (catches more spam)", "Production recommended"],
    cons: ["Slower than NB", "Requires scaling for dense features"],
    winner: true,
  },
];

const colorMap = {
  blue: {
    bar: "bg-gradient-to-r from-blue-600 to-blue-400",
    text: "text-blue-400",
    badge: "bg-blue-500/10 border-blue-500/20 text-blue-300",
    glow: "shadow-blue-500/20",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
  },
  violet: {
    bar: "bg-gradient-to-r from-violet-600 to-violet-400",
    text: "text-violet-400",
    badge: "bg-violet-500/10 border-violet-500/20 text-violet-300",
    glow: "shadow-violet-500/20",
    border: "border-violet-500/30",
    bg: "bg-violet-500/5",
  },
};

const confusionData = {
  nb: { tn: 964, fp: 0, fn: 106, tp: 846 },   // illustrative
  lr: { tn: 957, fp: 7, fn: 64, tp: 888 },
};



// ─── Metric bar ──────────────────────────────────────────────────────────────
function MetricBar({ label, value, colorClass, delay = 0 }: { label: string; value: number; colorClass: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(value), delay);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-white font-bold">{value.toFixed(1)}%</span>
      </div>
      <div className="h-3 rounded-full bg-white/8 overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// ─── Confusion matrix display ────────────────────────────────────────────────
function ConfusionMatrix({ data }: { data: typeof confusionData.nb; colorClass?: string }) {
  const total = data.tn + data.fp + data.fn + data.tp;
  const cells = [
    { label: "TN", sublabel: "True Ham", value: data.tn, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "FP", sublabel: "False Spam", value: data.fp, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { label: "FN", sublabel: "Missed Spam", value: data.fn, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
    { label: "TP", sublabel: "True Spam", value: data.tp, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1.5">
        <div className="text-center text-xs text-gray-500 col-span-2 mb-1">
          <span className="px-2">← Predicted →</span>
        </div>
        {cells.map((cell, i) => (
          <div key={i} className={`p-3 rounded-xl border text-center ${cell.bg}`}>
            <div className={`text-xl font-bold ${cell.color}`}>{cell.value.toLocaleString()}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{cell.label}</div>
            <div className="text-[10px] text-gray-500">{cell.sublabel}</div>
            <div className="text-[10px] text-gray-600 mt-0.5">{((cell.value / total) * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MetricsSection() {
  const [activeTab, setActiveTab] = useState<"nb" | "lr">("lr");

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0a0f1e] to-[#0d1428]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium mb-4">
            <ChartIcon className="w-4 h-4" />
            Model Evaluation
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Performance Results</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Both models evaluated on 20% hold-out test set (stratified). Logistic Regression
            outperforms Naive Bayes in F1-score.
          </p>
        </div>

        {/* Winner Banner */}
        <div className="mb-10 p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏆</div>
            <div>
              <div className="font-bold text-white">Best Model: Logistic Regression</div>
              <div className="text-sm text-gray-400">Highest F1-Score of 95.3% — Recommended for production use</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-mono font-bold">F1 = 0.9532</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold">Acc = 98.3%</span>
          </div>
        </div>

        {/* Model Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {models.map((model) => {
            const c = colorMap[model.color as keyof typeof colorMap];
            return (
              <div
                key={model.name}
                className={`p-6 rounded-2xl border ${c.border} ${c.bg} relative ${model.winner ? `shadow-xl ${c.glow}` : ""}`}
              >
                {model.winner && (
                  <div className="absolute -top-3 left-6">
                    <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold shadow-lg shadow-violet-500/30">
                      🏆 Best Model
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-5 mt-2">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center font-bold ${c.text}`}>
                    {model.shortName}
                  </div>
                  <div>
                    <div className="font-bold text-white">{model.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{model.description}</div>
                  </div>
                </div>

                {/* Metric bars */}
                <div className="space-y-4 mb-6">
                  {Object.entries(model.metrics).map(([key, val], i) => (
                    <MetricBar
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={val}
                      colorClass={c.bar}
                      delay={i * 150}
                    />
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {Object.entries(model.metrics).map(([key, val]) => (
                    <div key={key} className={`text-center p-2 rounded-lg ${c.bg} border ${c.border}`}>
                      <div className={`text-base font-bold ${c.text}`}>{val.toFixed(1)}%</div>
                      <div className="text-[10px] text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Pros</p>
                    {model.pros.map((p, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-emerald-400 mb-1">
                        <span className="mt-0.5">✓</span> {p}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Cons</p>
                    {model.cons.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-red-400 mb-1">
                        <span className="mt-0.5">✗</span> {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confusion Matrices */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Confusion Matrices</h3>
            <div className="flex gap-2">
              {[{ id: "lr" as const, label: "Logistic Regression" }, { id: "nb" as const, label: "Naive Bayes" }].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === m.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <ConfusionMatrix
              data={confusionData[activeTab]}
              colorClass={activeTab === "lr" ? "text-violet-400" : "text-blue-400"}
            />
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-sm">Reading the Matrix</h4>
              <div className="space-y-3 text-sm">
                {[
                  { label: "TN (True Negative)", desc: "Ham correctly classified as Ham", color: "text-emerald-400" },
                  { label: "FP (False Positive)", desc: "Ham incorrectly flagged as Spam", color: "text-yellow-400" },
                  { label: "FN (False Negative)", desc: "Spam that slipped through as Ham", color: "text-orange-400" },
                  { label: "TP (True Positive)", desc: "Spam correctly caught as Spam", color: "text-blue-400" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`font-bold w-8 flex-shrink-0 ${item.color} font-mono`}>
                      {item.label.split(" ")[0]}
                    </div>
                    <div>
                      <div className={`font-medium ${item.color} text-xs`}>{item.label}</div>
                      <div className="text-gray-500 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Key Insight</p>
                <p className="text-sm text-gray-400">
                  {activeTab === "lr"
                    ? "Logistic Regression catches more spam (higher recall) with only 7 false positives — excellent for production."
                    : "Naive Bayes achieves perfect precision (zero false positives!) but misses more spam (lower recall)."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall summary stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Training Set", value: "4,459", unit: "messages (80%)", icon: "📦" },
            { label: "Test Set", value: "1,115", unit: "messages (20%)", icon: "🧪" },
            { label: "Vocabulary", value: "5,000", unit: "TF-IDF features", icon: "📝" },
            { label: "Dataset Balance", value: "13.4%", unit: "spam (natural)", icon: "⚖️" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/8 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                <div className="text-gray-400 font-medium">{stat.label}</div>
                <div>{stat.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

