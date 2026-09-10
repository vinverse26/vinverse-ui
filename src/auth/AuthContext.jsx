import { createContext, useContext, useMemo, useState } from "react";
import { logoutSession } from "../api/auth.js";

const AuthContext = createContext(null);
const USER_KEY = "vinverse_session";
const TOKEN_KEY = "vinverse_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  });

  const value = useMemo(
    () => ({
      user,
      login(next, token) {
        localStorage.setItem(USER_KEY, JSON.stringify(next));
        if (token) localStorage.setItem(TOKEN_KEY, token);
        setUser(next);
      },
      async logout() {
        await logoutSession();
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
