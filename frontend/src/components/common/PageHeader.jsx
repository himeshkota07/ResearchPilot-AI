import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-1">
        {icon && <span className="text-2xl">{icon}</span>}
        <h1 className="text-2xl font-bold gradient-text">{title}</h1>
      </div>

      {subtitle && (
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}

      {/* Animated underline accent */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-3 h-px origin-left"
        style={{
          background: "linear-gradient(90deg, rgba(99,102,241,0.6), rgba(167,139,250,0.3), transparent)",
        }}
      />
    </motion.div>
  );
}