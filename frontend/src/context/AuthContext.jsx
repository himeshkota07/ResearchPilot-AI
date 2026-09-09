import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const USERS_STORAGE_KEY = "rp_registered_users";
const CURRENT_USER_KEY = "rp_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Get all registered users from localStorage
  const getRegisteredUsers = () => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // Sign In
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();

    const found = users.find(
      (u) => u.email === cleanEmail && u.password === password
    );

    if (!found) {
      throw new Error("Invalid email or password. If you don't have an account, please Sign Up.");
    }

    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  };

  // Sign Up
  const signup = (name, email, password) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) throw new Error("Please enter your name.");
    if (!cleanEmail || !cleanEmail.includes("@")) throw new Error("Please enter a valid email address.");
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters long.");

    const users = getRegisteredUsers();
    const existing = users.find((u) => u.email === cleanEmail);
    if (existing) {
      throw new Error("An account with this email already exists. Please Sign In.");
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password,
      avatar: cleanName.charAt(0).toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  };

  // Log Out
  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
