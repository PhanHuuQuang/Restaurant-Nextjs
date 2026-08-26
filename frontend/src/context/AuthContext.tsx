"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { getProfile, type User } from "@/api/auth";
import { getToken, setToken, removeToken } from "@/lib/token";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
      getProfile(stored)
        .then(setUser)
        .catch(() => {
          removeToken();
          setTokenState(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
    const profile = await getProfile(newToken);
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
