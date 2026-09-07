// ── Color Palette ───────────────────────────────────────────
export const colors = {
  // Backgrounds
  bg: "#050b18",
  bgLayer1: "rgba(15, 23, 42, 0.6)",
  bgLayer2: "rgba(30, 41, 59, 0.5)",
  sidebar: "rgba(8, 14, 28, 0.9)",

  // Cards
  card: "rgba(15, 23, 42, 0.6)",
  cardBorder: "rgba(99, 102, 241, 0.15)",
  cardHover: "rgba(30, 41, 59, 0.7)",

  // Brand
  primary: "#6366f1",
  primaryLight: "#818cf8",
  secondary: "#a78bfa",
  accent: "#38bdf8",

  // Semantic
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171",
  info: "#60a5fa",

  // Text
  text: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",

  // Borders
  border: "rgba(99, 102, 241, 0.15)",
  borderLight: "rgba(148, 163, 184, 0.1)",
};

// ── Gradients ───────────────────────────────────────────────
export const gradients = {
  brand: "linear-gradient(135deg, #6366f1, #a78bfa, #38bdf8)",
  brandAlt: "linear-gradient(135deg, #3b82f6, #6366f1)",
  blue: "linear-gradient(135deg, #3b82f6, #6366f1)",
  violet: "linear-gradient(135deg, #6366f1, #a78bfa)",
  cyan: "linear-gradient(135deg, #38bdf8, #818cf8)",
  success: "linear-gradient(135deg, #10b981, #34d399)",
  danger: "linear-gradient(135deg, #ef4444, #f87171)",
  card: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(167,139,250,0.04))",
  sidebar: "linear-gradient(180deg, rgba(8,14,28,0.98) 0%, rgba(5,11,24,0.95) 100%)",
};

// ── Typography ──────────────────────────────────────────────
export const typography = {
  fontSizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30 },
  weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
};

// ── Spacing & Radius ────────────────────────────────────────
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
};

// ── Shadows ─────────────────────────────────────────────────
export const shadow = {
  card: "0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
  glow: "0 0 20px rgba(99,102,241,0.3)",
  glowStrong: "0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)",
  button: "0 4px 15px rgba(99,102,241,0.4)",
};

// ── Transitions ─────────────────────────────────────────────
export const transition = {
  fast: "all 0.15s ease",
  base: "all 0.25s ease",
  slow: "all 0.4s ease",
};

// ── Animation presets for Framer Motion ─────────────────────
export const motion = {
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
  stagger: {
    animate: { transition: { staggerChildren: 0.08 } },
  },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
};