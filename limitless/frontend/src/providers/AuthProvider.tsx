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

// Firebase ID tokens expire after 1 hour. We write the token into the
// __session cookie so the Next.js middleware can gate protected routes
// without making a network call. We refresh 5 minutes before expiry.
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
const COOKIE_NAME = "__session";

function setSessionCookie(token: string) {
  // SameSite=Strict, no Secure flag needed for localhost dev.
  // Token is valid for ~1 hour; give the cookie the same lifetime.
  const maxAge = 60 * 60; // 1 hour in seconds
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

function clearSessionCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Returns a fresh token, refreshing from Firebase if the cached one is
  // within TOKEN_REFRESH_BUFFER_MS of expiring. Also keeps the cookie in sync.
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) return null;

    const result = await auth.currentUser.getIdTokenResult();
    const expiresAt = new Date(result.expirationTime).getTime();
    const needsRefresh = expiresAt - Date.now() < TOKEN_REFRESH_BUFFER_MS;

    const token = needsRefresh
      ? await auth.currentUser.getIdToken(true)
      : result.token;

    setSessionCookie(token);
    return token;
  }, []);

  const logout = useCallback(async () => {
    clearSessionCookie();
    await authService.logout();
  }, []);

  const login = useCallback(async (): Promise<User> => {
    const firebaseUser = await authService.loginWithGoogle();
    // Eagerly write the cookie so middleware passes on the next navigation.
    const token = await firebaseUser.getIdToken();
    setSessionCookie(token);
    return firebaseUser;
  }, []);

  useEffect(() => {
    registerAuthHandlers(getAccessToken, logout);
  }, [getAccessToken, logout]);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Refresh the cookie whenever Firebase refreshes the session
        // (e.g. on app focus, tab restore, or token rotation).
        try {
          const token = await firebaseUser.getIdToken();
          setSessionCookie(token);
        } catch {
          // If token fetch fails here, let the next API call handle it.
        }
      } else {
        clearSessionCookie();
      }
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
