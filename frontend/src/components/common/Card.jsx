import { motion } from "framer-motion";

export default function Card({ children, className = "", glowing = false, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: glowing
        ? "0 12px 40px rgba(99,102,241,0.3), 0 0 0 1px rgba(99,102,241,0.3)"
        : "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)"
      }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`rounded-2xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(99,102,241,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        padding: 24,
      }}
    >
      {children}
    </motion.div>
  );
}