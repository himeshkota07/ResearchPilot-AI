import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#050b18" }}
    >
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          className="absolute top-1/2 -right-40 h-96 w-96 rounded-full opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
        />
        <div
          className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full opacity-6 blur-3xl"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }}
        />
      </div>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-20 overflow-hidden flex-shrink-0"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}