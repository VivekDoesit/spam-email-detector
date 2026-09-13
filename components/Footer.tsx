import { ShieldIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#080d1a] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Spam<span className="text-blue-400">Shield</span>
                <span className="text-violet-400 text-xs ml-1 font-normal">AI</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              A production-grade email spam detection system demonstrating
              practical NLP and Machine Learning pipeline implementation.
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Tech Stack
            </h4>
            <div className="space-y-2 text-sm text-gray-500">
              {[
                ["Python 3.10+", "Core language"],
                ["Scikit-Learn", "ML framework"],
                ["NLTK", "NLP preprocessing"],
                ["Pandas & NumPy", "Data manipulation"],
                ["Matplotlib / Seaborn", "Visualization"],
                ["Joblib", "Model persistence"],
              ].map(([tech, desc]) => (
                <div key={tech} className="flex justify-between">
                  <span className="text-gray-400 font-medium">{tech}</span>
                  <span className="text-gray-600 text-xs">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { label: "SMS Spam Collection Dataset", url: "https://archive.ics.uci.edu/ml/datasets/SMS+Spam+Collection" },
                { label: "Scikit-Learn Documentation", url: "https://scikit-learn.org/stable/" },
                { label: "NLTK Documentation", url: "https://www.nltk.org/" },
                { label: "spam_detector.py", url: "/ml_project/spam_detector.py" },
                { label: "README.md", url: "/ml_project/README.md" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            Built with ❤️ using Python · Scikit-Learn · NLTK · React · Tailwind CSS
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              98.3% Accuracy
            </span>
            <span>·</span>
            <span>MIT License</span>
            <span>·</span>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

