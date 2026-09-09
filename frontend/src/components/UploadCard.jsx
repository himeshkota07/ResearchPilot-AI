import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, XCircle, Sparkles, X } from "lucide-react";
import api from "../api/api";
import { useResearch } from "../context/ResearchContext";

const steps = [
  { id: "read",    label: "Reading PDF",        icon: "📖", color: "#6366f1" },
  { id: "embed",   label: "Embedding chunks",   icon: "🧠", color: "#8b5cf6" },
  { id: "summary", label: "Generating summary", icon: "📝", color: "#34d399" },
  { id: "gaps",    label: "Analyzing gaps",     icon: "🔍", color: "#fbbf24" },
  { id: "report",  label: "Building report",    icon: "📑", color: "#f87171" },
];

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function UploadCard({ onAnalysisComplete, loading, setLoading }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const { setUploadedFile, saveToHistory } = useResearch();

  /* ── Drag & Drop ─────────────────────────────────────── */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf" || dropped?.name?.endsWith(".pdf")) {
      setFile(dropped);
      setError(null);
      setDone(false);
    } else {
      setError("Only PDF files are supported.");
    }
  }, []);

  const handleDragOver  = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);

  /* ── Upload ──────────────────────────────────────────── */
  const simulateSteps = async () => {
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      setProgress(Math.round(((i + 1) / steps.length) * 90));
      await new Promise((r) => setTimeout(r, 500));
    }
  };

  const uploadFile = async () => {
    if (!file) { setError("Please select a PDF first."); return; }

    setError(null);
    setDone(false);
    setLoading(true);
    setActiveStep(0);
    setProgress(5);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const [response] = await Promise.all([
        api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }),
        simulateSteps(),
      ]);

      setUploadedFile(file);
      onAnalysisComplete(response.data);
      if (saveToHistory) {
        saveToHistory({
          file,
          summary: response.data.summary,
          gaps: response.data.research_analysis ?? response.data.gaps,
          report: response.data.report,
        });
      }
      setDone(true);
      setActiveStep(-1);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail ?? err.message ?? "Upload failed.");
      setActiveStep(-1);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-6"
      style={{
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(99,102,241,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)", boxShadow: "0 0 16px rgba(99,102,241,0.35)" }}>
          <Upload size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Upload Research Paper</h2>
          <p className="text-xs text-slate-500">PDF · max 25 MB</p>
        </div>
      </div>

      {/* Drop zone */}
      <motion.label
        animate={{
          borderColor: dragOver
            ? "rgba(99,102,241,0.9)"
            : file
            ? "rgba(52,211,153,0.5)"
            : "rgba(99,102,241,0.2)",
          background: dragOver
            ? "rgba(99,102,241,0.08)"
            : "rgba(15,23,42,0.3)",
        }}
        transition={{ duration: 0.2 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-8 transition-all duration-200 select-none relative"
        style={{ minHeight: 140 }}
      >
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg,rgba(52,211,153,0.2),rgba(52,211,153,0.08))",
                  border: "1px solid rgba(52,211,153,0.35)",
                }}>
                <FileText size={22} className="text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-white text-sm">{file.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{formatSize(file.size)}</p>
              </div>
              {/* Remove file button */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setFile(null); setDone(false); setError(null); setProgress(0); }}
                className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition"
              >
                <X size={12} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex flex-col items-center gap-3 text-center px-4"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${dragOver ? "animate-pulse-glow" : ""}`}
                style={{
                  background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(167,139,250,0.08))",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                <Upload size={22} className="text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-200 text-sm">
                  {dragOver ? "Drop it here!" : "Drag & drop your PDF"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">or click to browse files</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files[0] ?? null);
            setError(null);
            setDone(false);
            setProgress(0);
          }}
        />
      </motion.label>

      {/* Progress bar */}
      <AnimatePresence>
        {(loading || done) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-500">
                {done ? "Complete" : `Step ${activeStep + 1} of ${steps.length}`}
              </span>
              <span className="text-[11px] font-medium" style={{ color: done ? "#34d399" : "#818cf8" }}>
                {progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(30,41,59,0.8)" }}>
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  background: done
                    ? "linear-gradient(90deg,#34d399,#10b981)"
                    : "linear-gradient(90deg,#6366f1,#a78bfa,#38bdf8)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-sm text-red-400"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <XCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success badge */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-emerald-400"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}
          >
            <CheckCircle size={15} />
            <span>Analysis complete! Results appear below.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step list during loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-xl p-4"
              style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Processing…
              </p>
              <div className="space-y-2">
                {steps.map((step, i) => {
                  const isDone   = i < activeStep;
                  const isActive = i === activeStep;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] transition-all duration-300"
                        style={
                          isDone
                            ? { background: "#34d399" }
                            : isActive
                            ? { background: `linear-gradient(135deg,${step.color},#a78bfa)`, boxShadow: `0 0 10px ${step.color}80` }
                            : { background: "rgba(30,41,59,0.8)" }
                        }
                      >
                        {isDone ? "✓" : step.icon}
                      </div>
                      <span
                        className="text-sm transition-colors duration-200"
                        style={{
                          color: isDone ? "#34d399" : isActive ? step.color : "#475569",
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {step.label}
                      </span>
                      {isActive && (
                        <div className="ml-auto flex gap-1">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.15 }}
                              className="h-1 w-1 rounded-full"
                              style={{ background: step.color }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze button */}
      <motion.button
        whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        onClick={uploadFile}
        disabled={loading || !file}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: loading
            ? "rgba(99,102,241,0.4)"
            : "linear-gradient(135deg,#6366f1,#a78bfa)",
          boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30 70" />
            </svg>
            Analyzing…
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Analyze Paper
          </>
        )}
      </motion.button>
    </motion.div>
  );
}