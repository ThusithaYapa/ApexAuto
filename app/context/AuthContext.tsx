/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
} from "../lib/api";

type User = { id: string; name: string; email: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setUser: (u: User) => void;
  fetchProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((u: User) => {
    setUserState(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
      else localStorage.removeItem(USER_KEY);
    }
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await getProfile();
      if (data.success && data.user) {
        setUserState(data.user);
        if (typeof window !== "undefined")
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      setToken(t);
      getProfile()
        .then(({ data }) => {
          if (data.success && data.user) {
            setUserState(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await apiLogin(email, password);
      if (!data.success || !data.token)
        return {
          success: false,
          message: (data as { message?: string }).message || "Login failed",
        };
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
      setToken(data.token);
      setUserState(data.user);
      return { success: true };
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed";
      return { success: false, message };
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const { data } = await apiRegister(name, email, password);
        if (!data.success || !data.token)
          return {
            success: false,
            message:
              (data as { message?: string }).message || "Registration failed",
          };

        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }

        setToken(data.token);
        setUserState(data.user);
        return { success: true };
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Registration failed";
        return { success: false, message };
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setUser,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined)
    throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
