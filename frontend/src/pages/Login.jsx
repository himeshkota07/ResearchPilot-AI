import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Login() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }
      if (!password) {
        setError("Please enter a password.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setError("Please fill in both email and password.");
        return;
      }
    }

    setLoading(true);

    // Subtle delay for premium UX feel
    await new Promise((r) => setTimeout(r, 450));

    try {
      if (mode === "signup") {
        signup(name, email, password);
        setSuccess("Account created successfully! Redirecting…");
      } else {
        login(email, password);
      }
      setTimeout(() => {
        navigate(from, { replace: true });
      }, mode === "signup" ? 300 : 100);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-10 px-4"
      style={{ background: "#050b18" }}
    >
      {/* ── Ambient background blur blobs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl animate-gradient"
          style={{
            background: "radial-gradient(circle, #6366f1, transparent)",
            backgroundSize: "200% 200%",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
        />
        <div
          className="absolute top-1/2 left-0 h-64 w-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }}
        />
      </div>

      {/* ── Subtle background grid pattern ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Main Auth Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(15,23,42,0.85)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(99,102,241,0.2)",
            boxShadow:
              "0 25px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)",
          }}
        >
          {/* Brand header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-60"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#a78bfa)",
                }}
              />
              <img
                src={logo}
                alt="ResearchPilot AI"
                className="relative h-14 w-14 rounded-2xl object-contain"
                style={{ border: "1px solid rgba(99,102,241,0.4)" }}
              />
            </div>
            <h1 className="text-2xl font-bold gradient-text tracking-tight">
              ResearchPilot AI
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              {mode === "signin"
                ? "Welcome back! Sign in to continue your research."
                : "Create a new researcher account to get started."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            className="relative mb-6 flex rounded-xl p-1"
            style={{
              background: "rgba(8,14,28,0.7)",
              border: "1px solid rgba(99,102,241,0.18)",
            }}
          >
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`relative flex-1 py-2 text-xs font-semibold transition-all duration-200 rounded-lg ${
                mode === "signin"
                  ? "text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              style={{
                background:
                  mode === "signin"
                    ? "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(167,139,250,0.4))"
                    : "transparent",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`relative flex-1 py-2 text-xs font-semibold transition-all duration-200 rounded-lg ${
                mode === "signup"
                  ? "text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              style={{
                background:
                  mode === "signup"
                    ? "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(167,139,250,0.4))"
                    : "transparent",
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            <AnimatePresence initial={false}>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Jane Doe"
                      autoComplete="name"
                      className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all"
                      style={{
                        background: "rgba(8,14,28,0.7)",
                        border: "1px solid rgba(99,102,241,0.2)",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "rgba(99,102,241,0.6)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(99,102,241,0.2)")
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@university.edu"
                  autoComplete="email"
                  className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all"
                  style={{
                    background: "rgba(8,14,28,0.7)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(99,102,241,0.6)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(99,102,241,0.2)")
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  className="w-full rounded-xl py-2.5 pl-10 pr-11 text-sm text-white outline-none transition-all"
                  style={{
                    background: "rgba(8,14,28,0.7)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(99,102,241,0.6)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(99,102,241,0.2)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Minimum 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password (Sign Up only) */}
            <AnimatePresence initial={false}>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type={showPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all"
                      style={{
                        background: "rgba(8,14,28,0.7)",
                        border: "1px solid rgba(99,102,241,0.2)",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "rgba(99,102,241,0.6)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(99,102,241,0.2)")
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-red-400"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.25)",
                  }}
                >
                  <CheckCircle2 size={14} className="flex-shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                boxShadow: loading
                  ? "none"
                  : "0 4px 20px rgba(99,102,241,0.4)",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="3"
                      strokeDasharray="30 70"
                    />
                  </svg>
                  <span>
                    {mode === "signup" ? "Creating Account…" : "Signing In…"}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === "signup" ? "Create Account" : "Sign In"}
                  </span>
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle Switch Prompt */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {mode === "signin" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition ml-1"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition ml-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-[11px] text-slate-600">
            ResearchPilot AI · Multi-Agent Research Assistant
          </p>
        </div>
      </motion.div>
    </div>
  );
}
