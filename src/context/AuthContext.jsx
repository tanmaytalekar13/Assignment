import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const session = authApi.getSession();
    if (session) setUser(session);
    setInitializing(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      login: async (username, password) => {
        const session = await authApi.login(username, password);
        setUser(session);
        return session;
      },
      signup: async (username, password) => {
        const session = await authApi.signup(username, password);
        setUser(session);
        return session;
      },
      logout: () => {
        authApi.logout();
        setUser(null);
      },
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
