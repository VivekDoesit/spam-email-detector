import { useEffect, useRef, useState } from "react";
import { ShieldIcon, ArrowRightIcon, SparklesIcon } from "./Icons";

interface HeroSectionProps {
  scrollTo: (section: string) => void;
}

const floatingEmails = [
  { text: "FREE PRIZE 🎁", spam: true, x: 8, y: 20, delay: 0 },
  { text: "Team standup at 3pm", spam: false, x: 75, y: 15, delay: 0.5 },
  { text: "CLICK NOW! Win $1000", spam: true, x: 15, y: 70, delay: 1 },
  { text: "Invoice attached", spam: false, x: 70, y: 68, delay: 1.5 },
  { text: "Urgent! Verify account", spam: true, x: 45, y: 85, delay: 2 },
  { text: "Lunch plans?", spam: false, x: 82, y: 42, delay: 0.8 },
];

const stats = [
  { label: "Dataset Size", value: "5,574", unit: "messages" },
  { label: "Accuracy", value: "98.3%", unit: "F1 optimized" },
  { label: "Models Trained", value: "2", unit: "algorithms" },
  { label: "Features", value: "5,000", unit: "TF-IDF tokens" },
];

export default function HeroSection({ scrollTo }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Animated canvas network background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const N = 60;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.5)";
        ctx.fill();
      });

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(96,165,250,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ pointerEvents: "none" }}
      />

      {/* Radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59,130,246,0.08), transparent 50%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-[#0a0f1e] to-[#0a0f1e] pointer-events-none" />

      {/* Floating Email Chips */}
      {floatingEmails.map((email, i) => (
        <div
          key={i}
          className={`absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm
            animate-pulse ${
              email.spam
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          style={{
            left: `${email.x}%`,
            top: `${email.y}%`,
            animationDelay: `${email.delay}s`,
            animationDuration: `${3 + email.delay}s`,
          }}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              email.spam ? "bg-red-400" : "bg-emerald-400"
            }`}
          />
          {email.text}
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
          <SparklesIcon className="w-4 h-4" />
          ML Project · NLP · Scikit-Learn · Python
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          <span className="text-white">Spam</span>
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Shield
          </span>
          <span className="text-white"> AI</span>
          <br />
          <span className="text-3xl md:text-4xl font-bold text-gray-300">
            Email Spam Detection System
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          A production-grade ML pipeline that classifies emails as{" "}
          <span className="text-red-400 font-semibold">spam</span> or{" "}
          <span className="text-emerald-400 font-semibold">legitimate</span> using{" "}
          <span className="text-blue-400 font-semibold">Naive Bayes</span> &{" "}
          <span className="text-violet-400 font-semibold">Logistic Regression</span> with
          TF-IDF feature extraction — achieving{" "}
          <span className="text-white font-bold">98.3% accuracy</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => scrollTo("demo")}
            className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
          >
            <ShieldIcon className="w-5 h-5" />
            Try Live Demo
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollTo("code")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-200"
          >
            View Source Code
          </button>
          <button
            onClick={() => scrollTo("download")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-200"
          >
            Download Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm hover:bg-white/8 transition-colors"
            >
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400 leading-tight">
                <div className="font-medium text-gray-300">{stat.label}</div>
                <div>{stat.unit}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          {[
            { label: "Python", color: "from-yellow-400 to-yellow-600" },
            { label: "Scikit-Learn", color: "from-orange-400 to-orange-600" },
            { label: "NLTK", color: "from-green-400 to-green-600" },
            { label: "Pandas", color: "from-blue-400 to-blue-600" },
            { label: "NumPy", color: "from-cyan-400 to-cyan-600" },
            { label: "Matplotlib", color: "from-violet-400 to-violet-600" },
            { label: "Joblib", color: "from-pink-400 to-pink-600" },
          ].map((tech, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${tech.color} opacity-80 hover:opacity-100 transition-opacity`}
            >
              {tech.label}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 text-xs animate-bounce">
        <span>Scroll to explore</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

