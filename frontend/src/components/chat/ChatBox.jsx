import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

const suggestions = [
  { icon: "📄", text: "Summarize this paper" },
  { icon: "🔬", text: "Explain the methodology" },
  { icon: "📊", text: "What datasets were used?" },
  { icon: "💡", text: "Suggest future work" },
  { icon: "⚖️", text: "What are the limitations?" },
  { icon: "📚", text: "Explain the conclusion" },
];

export default function ChatBox({ messages, question, setQuestion, loading, onSend }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        height: "calc(100vh - 140px)",
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(99,102,241,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Chat header */}
      <div
        className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(99,102,241,0.12)" }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
          style={{
            background: "linear-gradient(135deg,#6366f1,#a78bfa)",
            boxShadow: "0 0 12px rgba(99,102,241,0.4)",
          }}
        >
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-white">ResearchPilot AI</h2>
          <p className="text-[11px] text-slate-500">Ask questions about your paper</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-slate-500">Online</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center pt-8"
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-5 text-5xl"
              >
                🤖
              </motion.div>
              <h2 className="mb-2 text-xl font-bold gradient-text">
                How can I help with your research?
              </h2>
              <p className="mb-7 text-sm text-slate-400 max-w-sm">
                Choose a suggestion below or type your own question.
              </p>

              {/* Suggestion grid */}
              <div className="grid w-full max-w-xl gap-2 grid-cols-2 sm:grid-cols-3">
                {suggestions.map((item, i) => (
                  <motion.button
                    key={item.text}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(99,102,241,0.25)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setQuestion(item.text);
                      setTimeout(() => onSend(item.text), 50);
                    }}
                    className="flex flex-col items-start gap-2 rounded-xl p-3 text-left transition-all"
                    style={{
                      background: "rgba(15,23,42,0.5)",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-medium text-slate-300 leading-snug">{item.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="messages">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} index={i} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ borderTop: "1px solid rgba(99,102,241,0.1)" }}
      >
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          onSend={onSend}
          loading={loading}
        />
      </div>
    </div>
  );
}