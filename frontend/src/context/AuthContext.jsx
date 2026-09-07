import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const DEMO_USERS = [
  { email: "demo@researchpilot.ai", password: "demo123", name: "Demo User", avatar: "D" },
  { email: "admin@researchpilot.ai", password: "admin123", name: "Admin",     avatar: "A" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("rp_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Invalid email or password.");
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("rp_user", JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rp_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
