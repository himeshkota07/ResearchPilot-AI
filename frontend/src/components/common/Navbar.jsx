import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, Search, History } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useResearch } from "../../context/ResearchContext";
import PaperSearchModal from "./PaperSearchModal";

const pageMeta = {
  "/":         { title: "Dashboard",        subtitle: "Upload & analyze research papers" },
  "/analysis": { title: "Research Analysis", subtitle: "Gaps, improvements & future directions" },
  "/chat":     { title: "AI Chat",           subtitle: "Ask questions about your paper" },
  "/summary":  { title: "Paper Summary",     subtitle: "Key insights extracted by AI" },
  "/report":   { title: "Generated Report",  subtitle: "Full research report" },
  "/history":  { title: "Paper History",     subtitle: "Past analyzed research papers" },
  "/settings": { title: "Settings",          subtitle: "Customize your experience" },
};

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth();
  const { history } = useResearch();
  const [searchOpen, setSearchOpen] = useState(false);

  const meta = pageMeta[location.pathname] ?? { title: "ResearchPilot AI", subtitle: "Multi-Agent Research Assistant" };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (user?.avatar ?? "U");

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className="flex h-16 flex-shrink-0 items-center justify-between px-6 z-20 relative"
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
          {/* Search bar (Desktop) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSearchOpen(true)}
            className="hidden items-center gap-2.5 rounded-xl px-3.5 py-2 md:flex transition-all text-left group"
            style={{
              background: "rgba(30,41,59,0.6)",
              border: "1px solid rgba(99,102,241,0.18)",
              width: 220,
            }}
          >
            <Search size={14} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span className="w-full text-xs text-slate-400 group-hover:text-slate-200 transition-colors truncate">
              {history.length > 0 ? `Search papers (${history.length})...` : "Search papers..."}
            </span>
            <kbd
              className="rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold text-indigo-300"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}
            >
              ⌘K
            </kbd>
          </motion.button>

          {/* Search icon button (Mobile) */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setSearchOpen(true)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl transition"
            style={{
              background: "rgba(30,41,59,0.6)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
            title="Search Papers History"
          >
            <Search size={16} className="text-indigo-400" />
          </motion.button>

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

          {/* User avatar */}
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

      {/* Global Search & History Modal */}
      <PaperSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
