import { motion } from "framer-motion";

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl glass glow-blue">
        <span className="text-4xl animate-float">{icon}</span>
      </div>

      {/* Text */}
      <h3 className="mb-3 text-2xl font-bold gradient-text">{title}</h3>
      <p className="mb-8 max-w-sm text-slate-400 leading-relaxed">{description}</p>

      {/* Optional action */}
      {action && (
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
