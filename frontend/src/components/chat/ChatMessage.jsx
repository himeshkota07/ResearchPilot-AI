import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Bot, User } from "lucide-react";

export default function ChatMessage({ message, index }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group mb-5 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div
          className="mr-3 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-md"
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            boxShadow: "0 0 12px rgba(99,102,241,0.35)",
          }}
        >
          <Bot size={16} />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {/* Label */}
        <div className={`mb-1.5 flex items-center gap-2 text-[11px] text-slate-400 ${isUser ? "justify-end" : ""}`}>
          <span className="font-medium text-slate-300">{isUser ? "You" : "ResearchPilot Assistant"}</span>
          <span>·</span>
          <span className="text-slate-500">{timestamp}</span>
        </div>

        {/* Bubble */}
        <div
          className="relative rounded-2xl px-4.5 py-3.5 text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  color: "white",
                  boxShadow: "0 4px 18px rgba(79,70,229,0.3)",
                  borderBottomRightRadius: 4,
                }
              : {
                  background: "rgba(15,23,42,0.75)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(99,102,241,0.18)",
                  color: "#e2e8f0",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                  borderBottomLeftRadius: 4,
                }
          }
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div>
              <div className="prose-dark pr-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-500 hover:text-white bg-slate-800/60 border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy response"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div
          className="ml-3 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-md"
          style={{
            background: "linear-gradient(135deg,#334155,#1e293b)",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          <User size={15} />
        </div>
      )}
    </motion.div>
  );
}