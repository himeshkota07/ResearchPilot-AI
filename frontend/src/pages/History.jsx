import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Search, Clock, Trash2, ArrowRight, BookOpen,
  MessageSquare, Sparkles, AlertTriangle, Database, FolderOpen
} from "lucide-react";
import { useResearch } from "../context/ResearchContext";
import PageHeader from "../components/common/PageHeader";
import AnimatedPage from "../components/common/AnimatedPage";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";

function formatRelativeTime(isoString) {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 2) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  } catch {
    return "Recently";
  }
}

export default function History() {
  const { history, loadPaperFromHistory, deleteFromHistory, clearHistory } = useResearch();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Filter papers
  const filtered = useMemo(() => {
    if (!query.trim()) return history;
    const q = query.toLowerCase();
    return history.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const fileName = (p.fileName || "").toLowerCase();
      const summary = (p.summary?.summary || "").toLowerCase();
      const datasets = (p.summary?.datasets || []).join(" ").toLowerCase();
      return title.includes(q) || fileName.includes(q) || summary.includes(q) || datasets.includes(q);
    });
  }, [history, query]);

  // Aggregate stats
  const totalGaps = useMemo(() => {
    return history.reduce((acc, p) => acc + (p.gaps?.research_gaps?.length || 0), 0);
  }, [history]);

  const totalFindings = useMemo(() => {
    return history.reduce((acc, p) => acc + (p.summary?.key_points?.length || 0), 0);
  }, [history]);

  const handleSelectPaper = (id, route = "/") => {
    loadPaperFromHistory(id);
    navigate(route);
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PageHeader
            title="Research Papers History"
            icon="📚"
            subtitle="Search, revisit, and reload any previously analyzed research paper."
          />

          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all paper history?")) {
                  clearHistory();
                }
              }}
              className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-900/60 border border-slate-800 hover:border-red-500/30 transition"
            >
              <Trash2 size={13} />
              Clear All History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No Research Papers in History"
            description="Upload and analyze your first research paper from the Dashboard to build your research library."
            action={
              <Button variant="primary" icon="🏠" onClick={() => navigate("/")}>
                Go to Dashboard
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className="rounded-2xl p-4 transition-all"
                style={{
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(99,102,241,0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Total Papers</p>
                    <p className="text-xl font-bold text-white mt-0.5">{history.length}</p>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl p-4 transition-all"
                style={{
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(248,113,113,0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Gaps Uncovered</p>
                    <p className="text-xl font-bold text-white mt-0.5">{totalGaps}</p>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl p-4 transition-all"
                style={{
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(251,191,36,0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Key Contributions</p>
                    <p className="text-xl font-bold text-white mt-0.5">{totalFindings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div
              className="relative flex items-center rounded-2xl p-3"
              style={{
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              <Search size={16} className="absolute left-6 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search history by title, dataset, or keywords..."
                className="w-full rounded-xl bg-slate-900/60 pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 border border-slate-700/60 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Paper Cards Grid */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl p-12 text-center bg-slate-900/40 border border-slate-800">
                <Search size={28} className="mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">No matching papers found</p>
                <p className="text-xs text-slate-500 mt-1">Try a different search term.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((paper) => {
                  const gapsCount = paper.gaps?.research_gaps?.length || 0;
                  const findingsCount = paper.summary?.key_points?.length || 0;

                  return (
                    <motion.div
                      key={paper.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group rounded-2xl p-5 transition-all duration-300 hover:shadow-xl"
                      style={{
                        background: "rgba(15,23,42,0.65)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(99,102,241,0.15)",
                      }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Info */}
                        <div className="space-y-2 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-indigo-400 font-semibold">
                              {paper.fileName}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <Clock size={11} /> {formatRelativeTime(paper.analyzedAt)}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                            {paper.title}
                          </h3>

                          {paper.summary?.summary && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {paper.summary.summary}
                            </p>
                          )}

                          {/* Stats Badges */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {findingsCount > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20">
                                <Sparkles size={11} /> {findingsCount} Contributions
                              </span>
                            )}
                            {gapsCount > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-red-300 bg-red-500/10 border border-red-500/20">
                                <AlertTriangle size={11} /> {gapsCount} Research Gaps
                              </span>
                            )}
                            {paper.summary?.datasets?.length > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-sky-300 bg-sky-500/10 border border-sky-500/20">
                                <Database size={11} /> {paper.summary.datasets.slice(0, 2).join(", ")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end flex-shrink-0 pt-2 lg:pt-0">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSelectPaper(paper.id, "/chat")}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition"
                            >
                              <MessageSquare size={13} />
                              <span>Ask AI</span>
                            </button>
                            <button
                              onClick={() => handleSelectPaper(paper.id, "/report")}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition"
                            >
                              <BookOpen size={13} />
                              <span>Report</span>
                            </button>
                            <button
                              onClick={() => deleteFromHistory(paper.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-400 bg-slate-800/80 hover:bg-red-500/10 border border-slate-700/60 transition"
                              title="Delete from history"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleSelectPaper(paper.id, "/")}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-600/25"
                          >
                            <span>Load Analysis</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
