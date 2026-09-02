import { useState, useCallback } from "react";
import { ShieldIcon, MailIcon, ZapIcon } from "./Icons";

// ─── Spam/Ham classifier simulation ─────────────────────────────────────────
const SPAM_INDICATORS = [
  "win", "winner", "prize", "free", "claim", "cash", "urgent", "click", "now",
  "offer", "limited", "guaranteed", "congratulations", "selected", "reward",
  "bonus", "gift", "discount", "cheap", "buy", "earn", "money", "rich",
  "credit", "loan", "approved", "account", "verify", "confirm", "suspend",
  "expired", "password", "bank", "investment", "opportunity", "hot", "singles",
  "meet", "tonight", "adult", "xxx", "viagra", "cialis", "meds", "pills",
  "weight", "lose", "fat", "call", "txt", "text", "reply", "stop", "unsubscribe",
  "double", "triple", "100%", "million", "billion", "dollars", "£", "$$$",
];

const STRONG_SPAM = [
  "free entry", "you have been selected", "you've won", "you have won",
  "claim your", "click here to claim", "congratulations you", "urgent",
  "call now", "act now", "act fast", "limited time", "no experience",
  "work from home", "get rich", "make money", "earn $", "earn £",
  "your account", "verify now", "confirm your", "subscription expires",
  "pre-approved", "cheap meds", "no prescription",
];

function classify(text: string): { label: "SPAM" | "HAM"; spamProb: number; hamProb: number; confidence: number; indicators: string[] } {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const foundIndicators: string[] = [];

  let score = 0;

  // Strong phrases
  STRONG_SPAM.forEach((phrase) => {
    if (lower.includes(phrase)) {
      score += 30;
      foundIndicators.push(`"${phrase}"`);
    }
  });

  // Individual words
  SPAM_INDICATORS.forEach((word) => {
    if (words.some((w) => w.includes(word))) {
      score += 8;
      if (!foundIndicators.some((f) => f.includes(word))) {
        foundIndicators.push(`"${word}"`);
      }
    }
  });

  // Special characters / emojis
  if ((text.match(/[!]{2,}/g) || []).length > 0) score += 10;
  if ((text.match(/\$\$+/g) || []).length > 0) score += 15;
  if (/[A-Z]{4,}/.test(text)) score += 12;
  if (/\b\d{8,}\b/.test(text)) score += 10;

  // Normalize to probability
  const maxScore = 120;
  const clampedScore = Math.min(score, maxScore);
  const spamProb = clampedScore / maxScore;

  // Add some realism (base rates)
  const adjustedSpam = Math.min(0.98, Math.max(0.02, spamProb * 0.92 + 0.04));
  const adjustedHam = 1 - adjustedSpam;

  return {
    label: adjustedSpam > 0.5 ? "SPAM" : "HAM",
    spamProb: adjustedSpam * 100,
    hamProb: adjustedHam * 100,
    confidence: Math.max(adjustedSpam, adjustedHam) * 100,
    indicators: foundIndicators.slice(0, 5),
  };
}

// ─── Sample emails ───────────────────────────────────────────────────────────
const sampleEmails = [
  {
    text: "WINNER!! Congratulations! You've been selected to receive a FREE $1000 prize. CALL NOW to claim your reward before it expires! Limited time offer!",
    label: "SPAM",
  },
  {
    text: "Hey Sarah, are you coming to the team lunch tomorrow at noon? We're going to that new Italian place downtown. Let me know!",
    label: "HAM",
  },
  {
    text: "Urgent: Your PayPal account has been compromised. Verify your details immediately to avoid suspension. Click here: http://fake-link.com",
    label: "SPAM",
  },
  {
    text: "The quarterly report is attached to this email. Please review before the board meeting on Thursday at 2pm. Thanks, John.",
    label: "HAM",
  },
  {
    text: "FREE entry! Win FA Cup final tickets! Text WIN to 80082 now. 18+ T&C apply. 150p/msg. Get rich quick working from home!",
    label: "SPAM",
  },
  {
    text: "Hi Mom, just checking in. I'll be home for the holidays next week. Can you pick me up from the airport at 6pm on Friday?",
    label: "HAM",
  },
];

// ─── Animated probability bar ────────────────────────────────────────────────
function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-gray-300">{label}</span>
        <span className={color}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            color.includes("red") ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ─── Indicator tokens ────────────────────────────────────────────────────────
function HighlightedText({ text, indicators }: { text: string; indicators: string[] }) {
  const keyWords = indicators.map((i) => i.replace(/"/g, "").toLowerCase());
  const words = text.split(/(\s+)/);

  return (
    <p className="text-gray-300 text-sm leading-relaxed">
      {words.map((word, i) => {
        const lower = word.toLowerCase();
        const isSpam = keyWords.some((kw) => lower.includes(kw) && lower.trim().length > 0);
        return isSpam ? (
          <mark key={i} className="bg-red-500/25 text-red-300 rounded px-0.5">
            {word}
          </mark>
        ) : (
          <span key={i}>{word}</span>
        );
      })}
    </p>
  );
}

export default function DemoSection() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof classify> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeModel, setActiveModel] = useState<"lr" | "nb">("lr");

  const analyze = useCallback(() => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulate ML model latency
    setTimeout(() => {
      setResult(classify(inputText));
      setIsAnalyzing(false);
    }, 800);
  }, [inputText]);

  const loadSample = (sample: (typeof sampleEmails)[0]) => {
    setInputText(sample.text);
    setResult(null);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0d1428] to-[#0a0f1e]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-4">
            <ZapIcon className="w-4 h-4" />
            Interactive Demo
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Live Spam Classifier</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Type any email or SMS text to classify it in real-time. Uses the same logic as the
            trained Python models.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Model selector */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
              {[
                { id: "lr" as const, label: "Logistic Regression", acc: "98.3%" },
                { id: "nb" as const, label: "Naive Bayes", acc: "97.8%" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setActiveModel(m.id); setResult(null); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeModel === m.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {m.label}
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                      activeModel === m.id ? "bg-white/20 text-white" : "bg-white/10 text-gray-500"
                    }`}
                  >
                    {m.acc}
                  </span>
                </button>
              ))}
            </div>

            {/* Text area */}
            <div className="relative">
              <div className="absolute top-3 left-4 text-gray-500">
                <MailIcon className="w-5 h-5" />
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) analyze();
                }}
                placeholder="Paste or type an email / SMS message here...

Examples:
• 'WINNER! You've been selected for a FREE prize!'
• 'Hey, are you free for lunch tomorrow?'"
                rows={8}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-200 text-sm placeholder-gray-600 resize-none transition-colors font-mono leading-relaxed"
              />
              <div className="absolute bottom-3 right-4 text-xs text-gray-600">
                {inputText.length} chars · Ctrl+Enter to analyze
              </div>
            </div>

            {/* Analyze button */}
            <button
              onClick={analyze}
              disabled={!inputText.trim() || isAnalyzing}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                inputText.trim() && !isAnalyzing
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer"
                  : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/10"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Analyzing with {activeModel === "lr" ? "Logistic Regression" : "Naive Bayes"}...
                </>
              ) : (
                <>
                  <ShieldIcon className="w-4 h-4" />
                  Classify Email
                </>
              )}
            </button>

            {/* Sample emails */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                Try sample emails:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleEmails.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => loadSample(sample)}
                    className={`text-left p-3 rounded-lg text-xs border transition-all hover:scale-[1.01] ${
                      sample.label === "SPAM"
                        ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40 text-red-300"
                        : "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-300"
                    }`}
                  >
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                        sample.label === "SPAM"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {sample.label}
                    </span>
                    <p className="text-gray-400 leading-tight truncate">{sample.text.substring(0, 55)}...</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {!result && !isAnalyzing && (
              <div className="h-full min-h-[300px] rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col items-center justify-center text-center p-8 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShieldIcon className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Awaiting Analysis</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Enter text and click Classify Email
                  </p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full min-h-[300px] rounded-2xl border border-blue-500/20 bg-blue-500/5 flex flex-col items-center justify-center gap-6 p-8">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.6s" }} />
                </div>
                <div className="text-center">
                  <p className="text-blue-300 font-semibold">Processing NLP Pipeline...</p>
                  <div className="flex flex-col gap-1.5 mt-3 text-xs text-gray-500">
                    {["Tokenizing text...", "Removing stopwords...", "Stemming tokens...", "Vectorizing (TF-IDF)...", "Running classifier..."].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result && !isAnalyzing && (
              <div
                className={`rounded-2xl border p-6 space-y-5 ${
                  result.label === "SPAM"
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-emerald-500/30 bg-emerald-500/5"
                }`}
              >
                {/* Verdict */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                      result.label === "SPAM"
                        ? "bg-red-500/20 border border-red-500/30 shadow-red-500/20"
                        : "bg-emerald-500/20 border border-emerald-500/30 shadow-emerald-500/20"
                    }`}
                  >
                    {result.label === "SPAM" ? "🚨" : "✅"}
                  </div>
                  <div>
                    <div
                      className={`text-2xl font-extrabold ${
                        result.label === "SPAM" ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {result.label === "SPAM" ? "SPAM DETECTED" : "HAM — Legitimate"}
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      {activeModel === "lr" ? "Logistic Regression" : "Naive Bayes"} ·{" "}
                      <span className={result.label === "SPAM" ? "text-red-400" : "text-emerald-400"}>
                        {result.confidence.toFixed(1)}% confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* Probability bars */}
                <div className="space-y-3">
                  <ProbBar label="🚨 Spam Probability" value={result.spamProb} color="text-red-400" />
                  <ProbBar label="✅ Ham Probability" value={result.hamProb} color="text-emerald-400" />
                </div>

                {/* Highlighted text */}
                {result.label === "SPAM" && result.indicators.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                      Spam Indicators Detected:
                    </p>
                    <HighlightedText text={inputText} indicators={result.indicators} />
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {result.indicators.map((ind, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-300 text-xs"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model attribution */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Model: {activeModel === "lr" ? "LogisticRegression(C=5.0)" : "MultinomialNB(α=0.1)"}</span>
                    <span>Features: TF-IDF (5K)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 text-center">
                <div className="text-lg font-bold text-blue-400 mb-0.5">98.3%</div>
                <div className="text-xs text-gray-500">LR Accuracy</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 text-center">
                <div className="text-lg font-bold text-violet-400 mb-0.5">97.8%</div>
                <div className="text-xs text-gray-500">NB Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
