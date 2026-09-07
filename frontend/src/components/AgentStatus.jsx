import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const AGENTS = [
  {
    id: "planner",
    label: "Planner",
    desc: "Creates the research execution plan",
    icon: "🗺️",
    color: "#6366f1",
  },
  {
    id: "pdf",
    label: "PDF Reader",
    desc: "Extracts text from the uploaded paper",
    icon: "📖",
    color: "#8b5cf6",
  },
  {
    id: "chroma",
    label: "ChromaDB",
    desc: "Embeds text chunks into vector store",
    icon: "🗄️",
    color: "#a78bfa",
  },
  {
    id: "retriever",
    label: "Retriever",
    desc: "Fetches relevant context for queries",
    icon: "🔎",
    color: "#38bdf8",
  },
  {
    id: "summarize",
    label: "Summarizer",
    desc: "Generates structured paper summary",
    icon: "📝",
    color: "#34d399",
  },
  {
    id: "gap",
    label: "Gap Analyzer",
    desc: "Identifies research gaps & future work",
    icon: "🔍",
    color: "#fbbf24",
  },
  {
    id: "report",
    label: "Report Gen",
    desc: "Writes the full research report",
    icon: "📑",
    color: "#f87171",
  },
];

export default function AgentStatus({ loading, hasResults }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(99,102,241,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl text-base"
            style={{
              background: "linear-gradient(135deg,#6366f1,#a78bfa)",
              boxShadow: "0 0 12px rgba(99,102,241,0.3)",
            }}
          >
            🤖
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Agent Pipeline</h3>
            <p className="text-[10px] text-slate-500">7 specialized AI agents</p>
          </div>
        </div>

        {/* Status pill */}
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            background: loading
              ? "rgba(251,191,36,0.1)"
              : hasResults
              ? "rgba(52,211,153,0.1)"
              : "rgba(30,41,59,0.5)",
            border: `1px solid ${loading ? "rgba(251,191,36,0.3)" : hasResults ? "rgba(52,211,153,0.3)" : "rgba(99,102,241,0.15)"}`,
          }}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              loading ? "animate-pulse bg-amber-400" : hasResults ? "bg-emerald-400" : "bg-slate-600"
            }`}
          />
          <span className={`text-[11px] font-medium ${loading ? "text-amber-400" : hasResults ? "text-emerald-400" : "text-slate-500"}`}>
            {loading ? "Running" : hasResults ? "Completed" : "Ready"}
          </span>
        </div>
      </div>

      {/* ── Progress bar ───────────────────────────────── */}
      <div className="h-1 w-full" style={{ background: "rgba(30,41,59,0.5)" }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: loading ? "60%" : hasResults ? "100%" : "0%" }}
          transition={{ duration: loading ? 8 : 0.5, ease: loading ? "easeInOut" : "easeOut" }}
          style={{
            background: "linear-gradient(90deg, #6366f1, #a78bfa, #38bdf8)",
          }}
        />
      </div>

      {/* ── Vertical stepper ───────────────────────────── */}
      <div className="px-5 py-4 space-y-1">
        {AGENTS.map((agent, i) => {
          const isDone = hasResults;
          const isActive = loading;
          const stepDelay = i * 0.2;

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300"
              style={{
                background: isActive
                  ? `${agent.color}10`
                  : isDone
                  ? "rgba(52,211,153,0.05)"
                  : "transparent",
                border: isActive
                  ? `1px solid ${agent.color}25`
                  : isDone
                  ? "1px solid rgba(52,211,153,0.15)"
                  : "1px solid transparent",
              }}
            >
              {/* Status icon */}
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <CheckCircle2 size={18} color="#34d399" />
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: stepDelay }}
                  >
                    <Loader2 size={18} style={{ color: agent.color }} />
                  </motion.div>
                ) : (
                  <Circle size={18} color="rgba(99,102,241,0.25)" />
                )}
              </div>

              {/* Agent icon */}
              <motion.span
                className="text-base flex-shrink-0"
                animate={isActive ? { rotate: [0, 8, -8, 0] } : {}}
                transition={
                  isActive
                    ? { duration: 0.8, repeat: Infinity, delay: stepDelay }
                    : {}
                }
              >
                {agent.icon}
              </motion.span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-sm font-medium block leading-tight"
                  style={{
                    color: isDone ? "#34d399" : isActive ? agent.color : "#64748b",
                  }}
                >
                  {agent.label}
                </span>
                <span className="text-[11px] text-slate-600 block leading-tight truncate">
                  {agent.desc}
                </span>
              </div>

              {/* Active pulse dot */}
              {isActive && (
                <div className="flex gap-0.5 flex-shrink-0">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 + stepDelay }}
                      className="h-1 w-1 rounded-full"
                      style={{ background: agent.color }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}