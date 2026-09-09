import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, SearchCode,
  FileText, BarChart3, Settings, ChevronLeft,
  Sparkles, LogOut, Telescope, History as HistoryIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const mainMenu = [
  { title: "Dashboard",  path: "/",         icon: LayoutDashboard, description: "Overview & upload" },
  { title: "AI Chat",    path: "/chat",      icon: MessageSquare,   description: "Ask questions" },
];

const analysisMenu = [
  { title: "Analysis",   path: "/analysis",  icon: SearchCode,      description: "Research gaps" },
  { title: "Summary",    path: "/summary",   icon: FileText,        description: "Paper summary" },
  { title: "Report",     path: "/report",    icon: BarChart3,       description: "Full report" },
  { title: "History",    path: "/history",   icon: HistoryIcon,     description: "Paper history" },
];

const generalMenu = [
  { title: "Settings",   path: "/settings",  icon: Settings,        description: "Preferences" },
];

function NavSection({ label, items }) {
  return (
    <div className="mb-1">
      <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
        {label}
      </p>
      {items.map((item) => (
        <NavItem key={item.path} item={item} />
      ))}
    </div>
  );
}

function NavItem({ item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
          isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(167,139,250,0.15))",
                border: "1px solid rgba(99,102,241,0.35)",
                boxShadow: "0 0 16px rgba(99,102,241,0.2)",
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          {!isActive && (
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "rgba(30,41,59,0.5)" }} />
          )}
          <div className={`relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
            isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
          }`}>
            <Icon size={16} />
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="text-sm font-medium leading-tight truncate">{item.title}</div>
            <div className="text-[11px] text-slate-600 group-hover:text-slate-500 transition truncate">
              {item.description}
            </div>
          </div>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className="flex h-full w-64 flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(8,14,28,0.99) 0%, rgba(5,11,24,0.96) 100%)",
        borderRight: "1px solid rgba(99,102,241,0.12)",
      }}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div className="relative p-5 pb-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-xl blur-md"
              style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)" }}
            />
            <img
              src={logo}
              alt="ResearchPilot AI"
              className="relative h-11 w-11 rounded-xl object-contain"
              style={{ border: "1px solid rgba(99,102,241,0.35)" }}
            />
          </div>
          <div>
            <h2 className="text-base font-bold gradient-text leading-tight">ResearchPilot</h2>
            <p className="text-xs text-slate-500">AI Research Assistant</p>
          </div>
        </div>
        <div className="mt-4 h-px w-full"
          style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.5), transparent)" }} />
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="flex-1 space-y-3 px-3 py-2 overflow-y-auto">
        <NavSection label="Main" items={mainMenu} />
        <div className="mx-3 h-px" style={{ background: "rgba(99,102,241,0.08)" }} />
        <NavSection label="Research" items={analysisMenu} />
        <div className="mx-3 h-px" style={{ background: "rgba(99,102,241,0.08)" }} />
        <NavSection label="General" items={generalMenu} />
      </nav>

      {/* ── User card + logout ────────────────────────────── */}
      <div className="p-3 space-y-2">
        {/* User info */}
        <div
          className="flex items-center gap-3 rounded-xl p-3"
          style={{
            background: "rgba(30,41,59,0.5)",
            border: "1px solid rgba(99,102,241,0.12)",
          }}
        >
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)" }}
          >
            {user?.avatar ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name ?? "User"}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email ?? ""}</p>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:text-red-400"
          style={{ border: "1px solid rgba(239,68,68,0.1)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <LogOut size={15} />
          Sign Out
        </motion.button>

        {/* Status badge */}
        <div className="rounded-xl p-2.5"
          style={{
            background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(167,139,250,0.05))",
            border: "1px solid rgba(99,102,241,0.12)",
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-indigo-400" />
            <span className="text-[11px] font-medium text-slate-400">Powered by Mistral AI</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-600">System operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}