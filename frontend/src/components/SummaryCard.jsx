import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FlaskConical, Database, Star, Copy, Check, Clock, Sparkles } from "lucide-react";

const Section = ({ icon: Icon, color, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl p-5 transition-all duration-300"
    style={{
      background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(20px)",
      border: `1px solid ${color}25`,
      boxShadow: `0 4px 20px -4px ${color}10`,
    }}
  >
    <div className="mb-3.5 flex items-center gap-2.5">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-xl"
        style={{ background: `${color}18`, border: `1px solid ${color}35` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <h3 className="text-sm font-semibold tracking-wide text-white">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const Tag = ({ text, color }) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition hover:scale-105"
    style={{
      background: `${color}12`,
      border: `1px solid ${color}30`,
      color,
    }}
  >
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    {text}
  </span>
);

export default function SummaryCard({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  // Calculate estimated reading time
  const totalWords = [
    data.title,
    data.summary,
    data.methodology,
    ...(data.key_points || []),
  ]
    .filter(Boolean)
    .join(" ")
    .split(/\s+/).length;
  const readTimeMin = Math.max(1, Math.ceil(totalWords / 200));

  const handleCopy = () => {
    const markdown = [
      `# ${data.title}`,
      `\n## Summary\n${data.summary}`,
      `\n## Methodology\n${data.methodology}`,
      data.datasets?.length ? `\n## Datasets\n${data.datasets.map(d => `- ${d}`).join("\n")}` : "",
      data.key_points?.length ? `\n## Key Findings\n${data.key_points.map((k, i) => `${i + 1}. ${k}`).join("\n")}` : "",
    ].filter(Boolean).join("\n");

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Title banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(167,139,250,0.1))",
          border: "1px solid rgba(99,102,241,0.3)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.12)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-indigo-300"
                style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
                <Sparkles size={11} className="text-indigo-400" />
                Research Paper Summary
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                <Clock size={12} />
                ~{readTimeMin} min read
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white leading-snug tracking-tight">
              {data.title}
            </h2>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:text-white flex-shrink-0"
            style={{
              background: copied ? "rgba(52,211,153,0.15)" : "rgba(30,41,59,0.7)",
              border: `1px solid ${copied ? "rgba(52,211,153,0.4)" : "rgba(99,102,241,0.2)"}`,
              color: copied ? "#34d399" : "#cbd5e1",
            }}
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? "Copied All" : "Copy Markdown"}</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <Section icon={BookOpen} color="#6366f1" title="Abstract & Overview">
        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          {data.summary}
        </p>
      </Section>

      {/* Methodology */}
      <Section icon={FlaskConical} color="#a78bfa" title="Core Methodology">
        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          {data.methodology}
        </p>
      </Section>

      {/* Datasets */}
      {data.datasets?.length > 0 && (
        <Section icon={Database} color="#38bdf8" title="Datasets & Benchmarks">
          <div className="flex flex-wrap gap-2.5 pt-1">
            {data.datasets.map((d, i) => (
              <Tag key={i} text={d} color="#38bdf8" />
            ))}
          </div>
        </Section>
      )}

      {/* Key Points */}
      {data.key_points?.length > 0 && (
        <Section icon={Star} color="#fbbf24" title="Key Contributions & Findings">
          <motion.div
            className="space-y-2.5 pt-1"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {data.key_points.map((point, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0 },
                }}
                className="flex items-start gap-3 rounded-xl p-3.5 transition hover:bg-slate-800/40"
                style={{
                  background: "rgba(15,23,42,0.4)",
                  border: "1px solid rgba(251,191,36,0.12)",
                }}
              >
                <div
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums"
                  style={{
                    background: "rgba(251,191,36,0.15)",
                    border: "1px solid rgba(251,191,36,0.3)",
                    color: "#fbbf24",
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed flex-1 pt-0.5">
                  {point}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      )}
    </motion.div>
  );
}