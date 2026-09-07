import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Zap, Globe, Bell, Shield, Palette, Info, Cpu, Database, Sparkles, CheckCircle2 } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import AnimatedPage from "../components/common/AnimatedPage";
import { useAuth } from "../context/AuthContext";

function SettingRow({ icon: Icon, color, title, description, control }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl p-4 transition-all"
      style={{ background: "rgba(15,23,42,0.4)", border: "1px solid rgba(99,102,241,0.08)" }}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>
      <div className="flex-shrink-0">{control}</div>
    </div>
  );
}

function Toggle({ value, onChange, color = "#6366f1" }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative h-6 w-11 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: value ? color : "rgba(30,41,59,0.8)", border: `1px solid ${value ? color : "rgba(99,102,241,0.2)"}` }}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

const AGENTS_INFO = [
  { name: "Planner Agent", desc: "Coordinates decomposition and workflow execution", icon: "🗺️", color: "#6366f1" },
  { name: "Summarizer Agent", desc: "Synthesizes abstracts, methodology, and datasets", icon: "📄", color: "#a78bfa" },
  { name: "Gap Analyzer", desc: "Detects research blindspots, flaws, and novel directions", icon: "🔍", color: "#38bdf8" },
  { name: "Report Generator", desc: "Compiles formatted executive synthesis & exports", icon: "📑", color: "#34d399" },
  { name: "Conversational QA", desc: "Answers paper queries with ChromaDB vector search", icon: "🤖", color: "#fbbf24" },
];

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    darkMode: true,
    fastMode: true,
    notifications: false,
    autoSave: true,
  });

  const set = (key) => (val) => setSettings((s) => ({ ...s, [key]: val }));

  const sections = [
    {
      label: "Appearance & Interface",
      items: [
        { icon: Moon,    color: "#818cf8", title: "Dark Mode",       description: "High-contrast frosted glass theme", key: "darkMode", readonly: true },
        { icon: Palette, color: "#a78bfa", title: "Glassmorphism UI", description: "Hardware-accelerated blur & borders", key: null, info: "Active" },
      ],
    },
    {
      label: "Intelligence Engine",
      items: [
        { icon: Zap,   color: "#fbbf24", title: "Fast Analysis Mode", description: "Use optimized mistral-small for quicker inferences", key: "fastMode" },
        { icon: Globe, color: "#38bdf8", title: "Auto-Save State",   description: "Persist parsed paper state in active session", key: "autoSave"  },
      ],
    },
    {
      label: "Notifications & Privacy",
      items: [
        { icon: Bell,   color: "#34d399", title: "Pipeline Alerts",  description: "Display toasts when AI agents finish stages", key: "notifications" },
        { icon: Shield, color: "#f87171", title: "Vector Privacy",   description: "Ephemeral vector store session scrubbing", key: null, info: "Enabled" },
      ],
    },
  ];

  return (
    <AnimatedPage>
      <div className="pb-12 space-y-6">
        <PageHeader title="Settings & Overview" icon="⚙️" subtitle="Manage assistant configurations, intelligence preferences, and view system architecture." />

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 shadow-xl"
          style={{
            background: "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(167,139,250,0.08))",
            border: "1px solid rgba(99,102,241,0.25)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#a78bfa)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                }}>
                {user?.avatar ?? "U"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{user?.name ?? "Researcher"}</h3>
                <p className="text-sm text-slate-400">{user?.email ?? "researcher@example.com"}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-400 font-medium">Session Authenticated</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>
                Researcher Tier
              </span>
            </div>
          </div>
        </motion.div>

        {/* Settings sections */}
        {sections.map((section, si) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
            className="rounded-2xl overflow-hidden shadow-md"
            style={{
              background: "rgba(15,23,42,0.6)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(99,102,241,0.1)",
            }}
          >
            <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400/90">{section.label}</p>
            </div>
            <div className="p-3.5 space-y-2">
              {section.items.map((item) => (
                <SettingRow
                  key={item.title}
                  icon={item.icon}
                  color={item.color}
                  title={item.title}
                  description={item.description}
                  control={
                    item.info ? (
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                        style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}>
                        {item.info}
                      </span>
                    ) : (
                      <Toggle
                        value={item.key ? settings[item.key] : false}
                        onChange={item.key ? set(item.key) : () => {}}
                        color={item.color}
                      />
                    )
                  }
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* About & Architecture Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl overflow-hidden shadow-md"
          style={{
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(99,102,241,0.12)",
          }}
        >
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-white">Multi-Agent Architecture</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> All Agents Operational
            </span>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              ResearchPilot AI employs an orchestrated pipeline of specialized AI agents built on Mistral AI and ChromaDB to synthesize, critique, and interact with scientific papers:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AGENTS_INFO.map((ag) => (
                <div
                  key={ag.name}
                  className="rounded-xl p-3.5 flex flex-col justify-between"
                  style={{
                    background: "rgba(15,23,42,0.5)",
                    border: `1px solid ${ag.color}25`,
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-lg">{ag.icon}</span>
                    <span className="text-xs font-bold text-white">{ag.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{ag.desc}</p>
                </div>
              ))}
            </div>

            {/* Technical specs strip */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-lg p-2 bg-slate-900/40 border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">LLM Engine</p>
                <p className="text-xs font-bold text-indigo-300 mt-0.5">Mistral AI</p>
              </div>
              <div className="rounded-lg p-2 bg-slate-900/40 border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Vector DB</p>
                <p className="text-xs font-bold text-indigo-300 mt-0.5">ChromaDB</p>
              </div>
              <div className="rounded-lg p-2 bg-slate-900/40 border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Backend API</p>
                <p className="text-xs font-bold text-indigo-300 mt-0.5">FastAPI Async</p>
              </div>
              <div className="rounded-lg p-2 bg-slate-900/40 border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Frontend</p>
                <p className="text-xs font-bold text-indigo-300 mt-0.5">React 18 + Vite</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-600 font-mono">
          ResearchPilot AI · v1.2.0 · Autonomous Scientific Research Synthesis Suite
        </div>
      </div>
    </AnimatedPage>
  );
}