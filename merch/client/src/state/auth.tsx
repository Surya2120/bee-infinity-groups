import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

type User = { id: string; username: string; email: string };
type AuthState = {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

const TOKEN_KEY = "bee_merch_token";
const USER_KEY = "bee_merch_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (!token) return;
      try {
        const data = await apiFetch<{ user: User }>("/api/auth/me", { token });
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      async login(email, password) {
        const data = await apiFetch<{ token: string; user: User }>("/api/auth/login", {
          method: "POST",
          body: { email, password }
        });
        setToken(data.token);
        setUser(data.user);
      },
      async register(username, email, password) {
        const data = await apiFetch<{ token: string; user: User }>("/api/auth/register", {
          method: "POST",
          body: { username, email, password }
        });
        setToken(data.token);
        setUser(data.user);
      },
      logout() {
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

