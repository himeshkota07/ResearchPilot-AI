import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, TrendingUp, Compass, Lightbulb, Copy, Check, Filter } from "lucide-react";
import { useResearch } from "../context/ResearchContext";
import PageHeader from "../components/common/PageHeader";
import AnimatedPage from "../components/common/AnimatedPage";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";

/* ── Item Card with copy ──────────────────────────────── */
function FindingCard({ index, item, category, color, icon: Icon }) {
  const [copied, setCopied] = useState(false);
  const text = item.text || item.gap || item.improvement || item.direction || item.idea || "";
  const extra = item.description || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(`${text}${extra ? `\n\n${extra}` : ""}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col justify-between rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
      style={{
        background: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${color}25`,
        boxShadow: `0 4px 20px -4px ${color}10`,
      }}
    >
      <div>
        {/* Category & index header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg text-xs"
              style={{ background: `${color}20`, border: `1px solid ${color}35` }}
            >
              <Icon size={12} style={{ color }} />
            </div>
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color }}
            >
              {category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">
              #{String(index + 1).padStart(2, "0")}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700/60 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy finding"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {/* Content text */}
        <p className="text-sm font-medium text-slate-200 leading-relaxed">
          {text}
        </p>

        {extra && (
          <div
            className="mt-3 rounded-xl p-3 text-xs text-slate-400 leading-relaxed bg-slate-900/50"
            style={{ borderLeft: `2px solid ${color}50` }}
          >
            {extra}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   Analysis Page
   ═══════════════════════════════════════════════════════ */
export default function Analysis() {
  const { gaps } = useResearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const categories = useMemo(() => [
    { id: "all", label: "All Findings", count: (gaps?.research_gaps?.length || 0) + (gaps?.possible_improvements?.length || 0) + (gaps?.future_research_directions?.length || 0) + (gaps?.novel_project_ideas?.length || 0) },
    { id: "gaps", label: "Research Gaps", count: gaps?.research_gaps?.length || 0, color: "#f87171", icon: AlertTriangle },
    { id: "improvements", label: "Improvements", count: gaps?.possible_improvements?.length || 0, color: "#34d399", icon: TrendingUp },
    { id: "directions", label: "Future Work", count: gaps?.future_research_directions?.length || 0, color: "#a78bfa", icon: Compass },
    { id: "ideas", label: "Novel Ideas", count: gaps?.novel_project_ideas?.length || 0, color: "#fbbf24", icon: Lightbulb },
  ], [gaps]);

  const allItems = useMemo(() => {
    if (!gaps) return [];
    const list = [];
    (gaps.research_gaps || []).forEach((item) => list.push({ item, category: "Research Gap", filterId: "gaps", color: "#f87171", icon: AlertTriangle }));
    (gaps.possible_improvements || []).forEach((item) => list.push({ item, category: "Improvement", filterId: "improvements", color: "#34d399", icon: TrendingUp }));
    (gaps.future_research_directions || []).forEach((item) => list.push({ item, category: "Future Direction", filterId: "directions", color: "#a78bfa", icon: Compass }));
    (gaps.novel_project_ideas || []).forEach((item) => list.push({ item, category: "Novel Project Idea", filterId: "ideas", color: "#fbbf24", icon: Lightbulb }));
    return list;
  }, [gaps]);

  const filteredItems = useMemo(() => {
    return allItems.filter(({ item, filterId }) => {
      const matchesFilter = selectedFilter === "all" || filterId === selectedFilter;
      if (!matchesFilter) return false;
      if (!query.trim()) return true;

      const q = query.toLowerCase();
      const text = (item.text || item.gap || item.improvement || item.direction || item.idea || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      return text.includes(q) || desc.includes(q);
    });
  }, [allItems, selectedFilter, query]);

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-12">
        <PageHeader
          title="Deep Research Analysis"
          icon="🔍"
          subtitle="Explore extracted gaps, suggested methodological improvements, future directions, and formulated ideas."
        />

        {!gaps ? (
          <EmptyState
            icon="🔍"
            title="No Analysis Yet"
            description="Upload and analyze a research paper from the Dashboard to explore deep analysis cards here."
            action={
              <Button variant="primary" icon="🏠" onClick={() => navigate("/")}>
                Go to Dashboard
              </Button>
            }
          />
        ) : (
          <div className="space-y-5">
            {/* Search and Filters Bar */}
            <div
              className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl p-4"
              style={{
                background: "rgba(15,23,42,0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              {/* Search input */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search keywords in gaps, methodologies, or project ideas..."
                  className="w-full rounded-xl bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 border border-slate-700/60 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedFilter(cat.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedFilter === cat.id
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        selectedFilter === cat.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            {filteredItems.length === 0 ? (
              <div className="rounded-2xl p-12 text-center bg-slate-900/40 border border-slate-800">
                <Filter size={28} className="mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">No matching analysis findings</p>
                <p className="text-xs text-slate-500 mt-1">Try broadening your search query or switching filters.</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <AnimatePresence>
                  {filteredItems.map(({ item, category, color, icon }, i) => (
                    <FindingCard
                      key={`${category}-${i}`}
                      index={i}
                      item={item}
                      category={category}
                      color={color}
                      icon={icon}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}