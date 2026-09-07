import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname ?? "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 600));

    try {
      login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("demo@researchpilot.ai");
    setPassword("demo123");
    setError("");
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: "#050b18" }}
    >
      {/* ── Ambient background blobs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl animate-gradient"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)", backgroundSize: "200% 200%" }} />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
        <div className="absolute top-1/2 left-0 h-64 w-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
      </div>

      {/* ── Animated grid pattern ── */}
      <div className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Login card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(15,23,42,0.8)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(99,102,241,0.2)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)",
          }}
        >
          {/* Logo & brand */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-60"
                style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)" }} />
              <img src={logo} alt="ResearchPilot AI"
                className="relative h-16 w-16 rounded-2xl object-contain"
                style={{ border: "1px solid rgba(99,102,241,0.4)" }} />
            </div>
            <h1 className="text-2xl font-bold gradient-text">ResearchPilot AI</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>
          </div>

          {/* Demo credentials hint */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={fillDemo}
            type="button"
            className="mb-6 w-full rounded-xl p-3 text-left transition-all"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px dashed rgba(99,102,241,0.3)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={13} className="text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-400">Try Demo Account</span>
              <span className="ml-auto text-[10px] text-indigo-500 underline">Click to fill</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              demo@researchpilot.ai &nbsp;/&nbsp; demo123
            </div>
          </motion.button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all"
                  style={{
                    background: "rgba(8,14,28,0.7)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl py-3 pl-10 pr-11 text-sm text-white outline-none transition-all"
                  style={{
                    background: "rgba(8,14,28,0.7)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-400"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg,#6366f1,#a78bfa)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.45)",
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30 70" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-[11px] text-slate-600">
            ResearchPilot AI · Multi-Agent Research Assistant
          </p>
        </div>
      </motion.div>
    </div>
  );
}
