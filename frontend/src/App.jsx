import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ResearchProvider } from "./context/ResearchContext";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login    from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat     from "./pages/Chat";
import Analysis from "./pages/Analysis";
import Summary  from "./pages/Summary";
import Report   from "./pages/Report";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ResearchProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Protected */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/"         element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/chat"     element={<Chat />} />
              <Route path="/summary"  element={<Summary />} />
              <Route path="/report"   element={<Report />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ResearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}