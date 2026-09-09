import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Calendar, Trash2, ArrowRight, BookOpen, MessageSquare, Sparkles, X, Clock } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

function formatRelativeTime(isoString) {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 2) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  } catch {
    return "Recently";
  }
}

export default function PaperSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { history, loadPaperFromHistory, deleteFromHistory } = useResearch();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter history
  const filteredPapers = useMemo(() => {
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

  const handleSelectPaper = (id, targetRoute = "/") => {
    loadPaperFromHistory(id);
    onClose();
    navigate(targetRoute);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteFromHistory(id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.15)",
            maxHeight: "80vh",
          }}
        >
          {/* Search Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: "1px solid rgba(99, 102, 241, 0.15)" }}
          >
            <Search size={18} className="text-indigo-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search papers by title, dataset, or keywords..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300"
              >
                <X size={14} />
              </button>
            )}
            <kbd className="hidden sm:inline-block rounded-lg px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Subheader Title */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/40 text-[11px] text-slate-400 border-b border-slate-800/60 font-medium">
            <span>
              {query ? `Search Results (${filteredPapers.length})` : "Recent Research Papers History"}
            </span>
            <span>{history.length} saved papers</span>
          </div>

          {/* Paper List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredPapers.length === 0 ? (
              <div className="py-12 text-center">
                <FileText size={32} className="mx-auto text-slate-600 mb-2 opacity-60" />
                <p className="text-sm font-semibold text-slate-300">No matching research papers found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try a different search term or upload a new paper from the Dashboard.
                </p>
              </div>
            ) : (
              filteredPapers.map((paper) => {
                const gapsCount = paper.gaps?.research_gaps?.length || 0;
                const findingsCount = paper.summary?.key_points?.length || 0;

                return (
                  <motion.div
                    key={paper.id}
                    layout
                    whileHover={{ scale: 1.005 }}
                    onClick={() => handleSelectPaper(paper.id, "/")}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl p-4 cursor-pointer transition-all duration-200"
                    style={{
                      background: "rgba(30, 41, 59, 0.45)",
                      border: "1px solid rgba(99, 102, 241, 0.12)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(40, 53, 76, 0.6)";
                      e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(30, 41, 59, 0.45)";
                      e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.12)";
                    }}
                  >
                    {/* Paper info */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-base shadow-sm mt-0.5"
                        style={{
                          background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(167,139,250,0.15))",
                          border: "1px solid rgba(99,102,241,0.3)",
                        }}
                      >
                        📄
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="text-sm font-semibold text-white leading-snug truncate group-hover:text-indigo-300 transition-colors">
                          {paper.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span className="font-mono text-slate-400 truncate max-w-[160px]">
                            {paper.fileName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock size={11} /> {formatRelativeTime(paper.analyzedAt)}
                          </span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {findingsCount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20">
                              <Sparkles size={10} /> {findingsCount} Findings
                            </span>
                          )}
                          {gapsCount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-red-300 bg-red-500/10 border border-red-500/20">
                              {gapsCount} Gaps
                            </span>
                          )}
                          {paper.summary?.datasets?.length > 0 && (
                            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium text-sky-300 bg-sky-500/10 border border-sky-500/20 truncate max-w-[150px]">
                              {paper.summary.datasets[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions on hover/mobile */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 pt-2 sm:pt-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPaper(paper.id, "/chat");
                        }}
                        className="flex items-center gap-1 p-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-indigo-600/60 transition"
                        title="Open AI Chat"
                      >
                        <MessageSquare size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPaper(paper.id, "/report");
                        }}
                        className="flex items-center gap-1 p-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-indigo-600/60 transition"
                        title="View Full Report"
                      >
                        <BookOpen size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, paper.id)}
                        className="p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-800/80 hover:bg-red-500/10 transition"
                        title="Delete from history"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPaper(paper.id, "/");
                        }}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm"
                      >
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div
            className="flex items-center justify-between px-5 py-3 text-xs text-slate-500 bg-slate-900/60"
            style={{ borderTop: "1px solid rgba(99, 102, 241, 0.12)" }}
          >
            <span>Tip: Click any paper to immediately load its summary, gaps & report.</span>
            <button
              onClick={onClose}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
