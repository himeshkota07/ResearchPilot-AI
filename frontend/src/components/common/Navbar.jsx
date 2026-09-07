import { useLocation } from "react-router-dom";
import { Menu, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const pageMeta = {
  "/":         { title: "Dashboard",        subtitle: "Upload & analyze research papers" },
  "/analysis": { title: "Research Analysis", subtitle: "Gaps, improvements & future directions" },
  "/chat":     { title: "AI Chat",           subtitle: "Ask questions about your paper" },
  "/summary":  { title: "Paper Summary",     subtitle: "Key insights extracted by AI" },
  "/report":   { title: "Generated Report",  subtitle: "Full research report" },
  "/settings": { title: "Settings",          subtitle: "Customize your experience" },
};

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth();
  const meta = pageMeta[location.pathname] ?? { title: "ResearchPilot AI", subtitle: "Multi-Agent Research Assistant" };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (user?.avatar ?? "U");

  return (
    <header
      className="flex h-16 flex-shrink-0 items-center justify-between px-6"
      style={{
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        background: "rgba(5,11,24,0.7)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Left: toggle + page title */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl transition"
          style={{
            background: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <Menu size={18} className="text-slate-400" />
        </motion.button>

        <div>
          <h1 className="text-sm font-semibold text-white leading-tight">{meta.title}</h1>
          <p className="text-[11px] text-slate-500">{meta.subtitle}</p>
        </div>
      </div>

      {/* Right: search + actions */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div
          className="hidden items-center gap-2 rounded-xl px-3 py-2 md:flex"
          style={{
            background: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(99,102,241,0.12)",
            width: 200,
          }}
        >
          <Search size={14} className="text-slate-500" />
          <input
            readOnly
            placeholder="Search papers..."
            className="w-full bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-600 cursor-default"
          />
          <kbd className="rounded px-1 py-0.5 text-[10px] text-slate-600"
            style={{ background: "rgba(99,102,241,0.1)" }}>
            ⌘K
          </kbd>
        </div>

        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl transition"
          style={{
            background: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(99,102,241,0.12)",
          }}
        >
          <Bell size={16} className="text-slate-400" />
          <span
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: "#6366f1" }}
          />
        </motion.button>

        {/* User avatar — uses real initials */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#6366f1,#a78bfa)",
            border: "1.5px solid rgba(99,102,241,0.5)",
            boxShadow: "0 0 12px rgba(99,102,241,0.25)",
          }}
          title={user?.name ?? "User"}
        >
          {initials}
        </motion.div>
      </div>
    </header>
  );
}