import { motion } from "framer-motion";

export default function Loader({ text = "Loading…" }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6"
      style={{ background: "#050b18" }}
    >
      {/* Animated logo ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute h-20 w-20 rounded-full"
          style={{
            border: "2px solid transparent",
            borderTopColor: "#6366f1",
            borderRightColor: "#a78bfa",
          }}
        />
        {/* Inner counter-rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          className="absolute h-14 w-14 rounded-full"
          style={{
            border: "2px solid transparent",
            borderBottomColor: "#38bdf8",
            borderLeftColor: "#6366f1",
          }}
        />
        {/* Core icon */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a78bfa)",
            boxShadow: "0 0 24px rgba(99,102,241,0.5)",
          }}
        >
          🚀
        </motion.div>
      </div>

      {/* Brand text */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-bold gradient-text"
        >
          ResearchPilot AI
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-1 text-sm text-slate-500"
        >
          {text}
        </motion.p>
      </div>

      {/* Dot progress */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "#6366f1" }}
          />
        ))}
      </div>
    </div>
  );
}
