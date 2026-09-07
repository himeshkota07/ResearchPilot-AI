import { motion } from "framer-motion";

const variants = {
  primary: {
    background: "linear-gradient(135deg, #6366f1, #a78bfa)",
    color: "white",
    border: "none",
    boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
  },
  secondary: {
    background: "rgba(30,41,59,0.6)",
    color: "#e2e8f0",
    border: "1px solid rgba(99,102,241,0.2)",
    boxShadow: "none",
  },
  danger: {
    background: "linear-gradient(135deg, #ef4444, #f87171)",
    color: "white",
    border: "none",
    boxShadow: "0 4px 15px rgba(239,68,68,0.3)",
  },
  success: {
    background: "linear-gradient(135deg, #10b981, #34d399)",
    color: "white",
    border: "none",
    boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
  },
  ghost: {
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid rgba(99,102,241,0.15)",
    boxShadow: "none",
  },
};

export default function Button({
  children,
  icon,
  variant = "primary",
  onClick,
  disabled = false,
  loading = false,
  size = "md",
  className = "",
  type = "button",
}) {
  const style = variants[variant] ?? variants.primary;

  const padding =
    size === "sm" ? "8px 14px" :
    size === "lg" ? "14px 28px" :
    "11px 20px";

  const fontSize =
    size === "sm" ? "13px" :
    size === "lg" ? "16px" :
    "14px";

  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.03, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        ...style,
        padding,
        fontSize,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontWeight: 600,
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Shimmer overlay on hover */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
        }}
      />

      {loading ? (
        <>
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}