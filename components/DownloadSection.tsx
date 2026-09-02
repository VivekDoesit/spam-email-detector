import { DownloadIcon, CheckIcon } from "./Icons";

const files = [
  {
    name: "spam_detector.py",
    size: "18 KB",
    desc: "Main ML script — complete pipeline",
    icon: "🐍",
    color: "blue",
    lines: "~500 lines",
  },
  {
    name: "requirements.txt",
    size: "0.2 KB",
    desc: "Python dependency list",
    icon: "📦",
    color: "orange",
    lines: "7 packages",
  },
  {
    name: "README.md",
    size: "6 KB",
    desc: "Documentation & usage guide",
    icon: "📄",
    color: "green",
    lines: "~200 lines",
  },
];

const features = [
  "Auto-downloads SMS Spam Collection dataset",
  "Two ML models: Naive Bayes & Logistic Regression",
  "TF-IDF and Bag-of-Words feature extraction",
  "Porter Stemming + NLTK stopword removal",
  "Confusion matrix & comparison visualizations",
  "Model persistence with joblib (save & load)",
  "Interactive CLI for real-time predictions",
  "Stratified 80/20 train-test split",
  "Comprehensive evaluation metrics (F1, Precision, Recall)",
  "Edge case handling & modular functions",
];

const requirements = [
  { pkg: "scikit-learn", version: "≥1.3.0", color: "orange" },
  { pkg: "pandas", version: "≥2.0.0", color: "blue" },
  { pkg: "numpy", version: "≥1.24.0", color: "cyan" },
  { pkg: "matplotlib", version: "≥3.7.0", color: "violet" },
  { pkg: "seaborn", version: "≥0.12.0", color: "pink" },
  { pkg: "nltk", version: "≥3.8.0", color: "green" },
  { pkg: "joblib", version: "≥1.3.0", color: "yellow" },
];

const colorMap: Record<string, string> = {
  blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400",
  orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400",
  green: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
  cyan: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-400",
  violet: "from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-400",
  pink: "from-pink-500/10 to-pink-600/5 border-pink-500/20 text-pink-400",
  yellow: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-yellow-400",
};

function downloadFile(content: string, filename: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadRequirements(): string {
  return `scikit-learn>=1.3.0
pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
seaborn>=0.12.0
nltk>=3.8.0
joblib>=1.3.0
`;
}

export default function DownloadSection() {
  const handleDownload = (filename: string) => {
    switch (filename) {
      case "spam_detector.py":
        // Redirect to the public file
        window.open("/ml_project/spam_detector.py", "_blank");
        break;
      case "requirements.txt":
        downloadFile(downloadRequirements(), "requirements.txt");
        break;
      case "README.md":
        window.open("/ml_project/README.md", "_blank");
        break;
    }
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0a0f1e] via-[#0d1428] to-[#0a0f1e]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium mb-4">
            <DownloadIcon className="w-4 h-4" />
            Download Project
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Get the Full Project
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Download all project files and run a production-grade spam detection system
            on your machine in minutes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* File Downloads */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Project Files</h3>
            {files.map((file) => {
              const colors = colorMap[file.color].split(" ");
              return (
                <div
                  key={file.name}
                  className={`flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r ${colors[0]} ${colors[1]} ${colors[2]} hover:opacity-90 transition-all group`}
                >
                  <div className="text-3xl flex-shrink-0">{file.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono font-bold text-white text-sm">{file.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${colorMap[file.color].split(" ")[2]} bg-white/5 ${colors[3]}`}>
                        {file.lines}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">{file.desc}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-600">{file.size}</span>
                    <button
                      onClick={() => handleDownload(file.name)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/30`}
                    >
                      <DownloadIcon className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Installation steps */}
            <div className="mt-8 p-5 rounded-xl bg-white/[0.03] border border-white/10">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                🚀 Quick Start (3 steps)
              </h4>
              <div className="space-y-3">
                {[
                  { step: "1", cmd: "pip install -r requirements.txt", desc: "Install dependencies" },
                  { step: "2", cmd: "python spam_detector.py", desc: "Run training pipeline" },
                  { step: "3", cmd: "python spam_detector.py --predict", desc: "Interactive mode" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <code className="text-blue-300 text-xs font-mono">{item.cmd}</code>
                      <span className="text-gray-500 text-xs ml-3">— {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Features */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
              <h4 className="text-sm font-bold text-white mb-4">✅ What's Included</h4>
              <div className="space-y-2">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
              <h4 className="text-sm font-bold text-white mb-4">📦 Dependencies</h4>
              <div className="space-y-2">
                {requirements.map((req, i) => {
                  const textClass = colorMap[req.color]?.split(" ")?.[3] || "text-gray-400";
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className={`font-mono font-bold ${textClass}`}>{req.pkg}</span>
                      <span className="text-gray-600">{req.version}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-600">
                Python 3.8+ required
              </div>
            </div>

            {/* System requirements */}
            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/15">
              <h4 className="text-sm font-bold text-white mb-3">💻 System Requirements</h4>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Python</span>
                  <span className="text-blue-400 font-mono">≥ 3.8</span>
                </div>
                <div className="flex justify-between">
                  <span>RAM</span>
                  <span className="text-blue-400 font-mono">≥ 2 GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Disk</span>
                  <span className="text-blue-400 font-mono">~50 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Internet</span>
                  <span className="text-blue-400 font-mono">1× (dataset)</span>
                </div>
                <div className="flex justify-between">
                  <span>OS</span>
                  <span className="text-blue-400 font-mono">Win/Mac/Linux</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to Build Your Own Spam Filter?
          </h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Download all files, follow the README, and have a production-grade NLP pipeline
            running in under 5 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.open("/ml_project/spam_detector.py", "_blank")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all"
            >
              <DownloadIcon className="w-5 h-5" />
              Download spam_detector.py
            </button>
            <button
              onClick={() => window.open("/ml_project/README.md", "_blank")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all"
            >
              📄 View README
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
