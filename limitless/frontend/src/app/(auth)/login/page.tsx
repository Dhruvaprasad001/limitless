"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/config/routes";
import { APP_NAME } from "@/config/constants";
import { cn } from "@/utils/cn";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      setError(null);
      await login();
      router.push(ROUTES.dashboard);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-xl">
          {/* Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-2xl font-bold text-white shadow-md">
              L
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{APP_NAME}</h1>
            <p className="mt-1 text-sm text-slate-500">
              AI-powered team updates for modern teams
            </p>
          </div>

          {/* Divider */}
          <div className="mb-6 border-t border-slate-100" />

          {/* Sign in section */}
          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-slate-700">
              Sign in to your workspace
            </p>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={cn(
                "flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3",
                "text-sm font-medium text-slate-700 shadow-sm transition-all",
                "hover:bg-slate-50 hover:border-slate-400 hover:shadow",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
              ) : (
                <GoogleIcon />
              )}
              {loading ? "Signing in…" : "Continue with Google"}
            </button>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
