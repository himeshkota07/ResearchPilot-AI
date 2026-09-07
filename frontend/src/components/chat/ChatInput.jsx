import { SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatInput({ question, setQuestion, onSend, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = !loading && question.trim().length > 0;

  return (
    <div
      className="flex items-end gap-3 rounded-2xl p-3"
      style={{
        background: "rgba(8,14,28,0.7)",
        border: "1px solid rgba(99,102,241,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      <textarea
        rows={1}
        placeholder="Ask anything about this paper…"
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          // Auto-resize
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
        }}
        onKeyDown={handleKeyDown}
        disabled={loading}
        className="flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-600 leading-relaxed"
        style={{ minHeight: 24, maxHeight: 120 }}
      />

      {/* Character hint */}
      {question.length > 0 && (
        <span className="text-[10px] text-slate-600 flex-shrink-0 mb-1">
          Enter ↵
        </span>
      )}

      {/* Send button */}
      <motion.button
        whileHover={canSend ? { scale: 1.08 } : {}}
        whileTap={canSend ? { scale: 0.92 } : {}}
        onClick={onSend}
        disabled={!canSend}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all"
        style={{
          background: canSend
            ? "linear-gradient(135deg,#6366f1,#a78bfa)"
            : "rgba(30,41,59,0.5)",
          boxShadow: canSend ? "0 0 12px rgba(99,102,241,0.4)" : "none",
          border: canSend ? "none" : "1px solid rgba(99,102,241,0.1)",
          cursor: canSend ? "pointer" : "not-allowed",
        }}
      >
        {loading ? (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30 70" />
          </svg>
        ) : (
          <SendHorizonal size={16} className={canSend ? "text-white" : "text-slate-600"} />
        )}
      </motion.button>
    </div>
  );
}