import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResearch } from "../context/ResearchContext";
import UploadCard from "../components/UploadCard";
import AgentStatus from "../components/AgentStatus";
import SummaryCard from "../components/SummaryCard";
import GapCard from "../components/GapCard";
import ReportCard from "../components/ReportCard";
import AnimatedPage from "../components/common/AnimatedPage";
import { FileText, Search, BookOpen, Cpu, Zap } from "lucide-react";

const TABS = [
  { key: "summary",  label: "Summary",  icon: FileText,  description: "Paper overview" },
  { key: "analysis", label: "Analysis", icon: Search,    description: "Research gaps" },
  { key: "report",   label: "Report",   icon: BookOpen,  description: "Full report" },
];

// Floating particle component
function Particle({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      animate={{
        y: [0, -80, -150],
        x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
        opacity: [0, 0.8, 0],
        scale: [0.5, 1, 0.3],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: "easeOut",
      }}
      style={style}
    />
  );
}

// Animated stat counter
function StatNumber({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) return;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}{suffix}</>;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const resultsRef = useRef(null);

  const { summary, setSummary, gaps, setGaps, report, setReport } = useResearch();

  const handleAnalysisComplete = (data) => {
    setSummary(data.summary);
    setGaps(data.research_analysis ?? data.gaps);
    setReport(data.report);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  const hasResults = summary || gaps || report;

  const stats = hasResults ? [
    {
      icon: FileText,
      label: "Papers Analyzed",
      value: 1,
      color: "#6366f1",
      bg: "rgba(99,102,241,0.1)",
    },
    {
      icon: Search,
      label: "Gaps Identified",
      value: gaps?.research_gaps?.length ?? 0,
      color: "#f87171",
      bg: "rgba(248,113,113,0.1)",
    },
    {
      icon: Zap,
      label: "Key Insights",
      value: summary?.key_points?.length ?? 0,
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.1)",
    },
    {
      icon: Cpu,
      label: "AI Agents Used",
      value: 7,
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
    },
  ] : null;

  const particles = Array.from({ length: 8 }, (_, i) => ({
    width: 4 + Math.random() * 6,
    height: 4 + Math.random() * 6,
    left: `${10 + i * 12}%`,
    bottom: "20%",
    background: ["#6366f1", "#a78bfa", "#38bdf8", "#34d399", "#fbbf24"][i % 5],
  }));

  return (
    <AnimatedPage>
      <div className="space-y-5 pb-8">

        {/* ── Hero banner ──────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-7"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(167,139,250,0.1), rgba(56,189,248,0.07))",
            border: "1px solid rgba(99,102,241,0.22)",
          }}
        >
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
          <div className="pointer-events-none absolute -bottom-16 left-1/4 h-48 w-48 rounded-full blur-3xl opacity-15"
            style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />

          {/* Floating particles */}
          {particles.map((p, i) => (
            <Particle key={i} style={p} />
          ))}

          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <motion.span
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-2xl"
              >
                🚀
              </motion.span>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                ResearchPilot AI
              </span>
              <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>
                v1.0
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-snug">
              Analyze Research Papers{" "}
              <span className="gradient-text">with AI</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl leading-relaxed">
              Upload any PDF and let a 7-agent AI pipeline summarize findings, discover research gaps,
              and generate a comprehensive report — in seconds.
            </p>
          </div>
        </div>

        {/* ── Stats strip (post-analysis) ───────────────────── */}
        <AnimatePresence>
          {stats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 gap-3 lg:grid-cols-4"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="stat-card rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
                        style={{ background: stat.bg, border: `1px solid ${stat.color}33` }}>
                        <Icon size={16} style={{ color: stat.color }} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">
                          <StatNumber value={stat.value} />
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Upload + Agent status — 2-column on large screens */}
        <div className="grid gap-5 lg:grid-cols-2">
          <UploadCard
            loading={loading}
            setLoading={setLoading}
            onAnalysisComplete={handleAnalysisComplete}
          />
          <AgentStatus loading={loading} hasResults={hasResults} />
        </div>

        {/* ── Results section ───────────────────────────────── */}
        <AnimatePresence>
          {hasResults && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Tab strip */}
              <div className="mb-5 flex items-center gap-1 rounded-2xl p-1.5 w-full"
                style={{
                  background: "rgba(15,23,42,0.7)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(99,102,241,0.12)",
                }}
              >
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className="relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200"
                      style={{ color: activeTab === tab.key ? "white" : "#64748b" }}
                    >
                      {activeTab === tab.key && (
                        <motion.div
                          layoutId="tab-active"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: "linear-gradient(135deg,rgba(99,102,241,0.35),rgba(167,139,250,0.2))",
                            border: "1px solid rgba(99,102,241,0.4)",
                            boxShadow: "0 0 16px rgba(99,102,241,0.2)",
                          }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <Icon size={15} className="relative" />
                      <span className="relative">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "summary"  && <SummaryCard data={summary} />}
                  {activeTab === "analysis" && <GapCard data={gaps} />}
                  {activeTab === "report"   && <ReportCard data={report} />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}