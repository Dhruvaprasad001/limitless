"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { authService } from "@/services/auth.service";
import { registerAuthHandlers } from "@/lib/axios";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: () => Promise<User>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  const login = useCallback(async (): Promise<User> => {
    return authService.loginWithGoogle();
  }, []);

  useEffect(() => {
    registerAuthHandlers(getAccessToken, logout);
  }, [getAccessToken, logout]);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
