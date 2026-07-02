"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { inviteService } from "@/services/invite.service";
import type { InvitePreview } from "../../../../client";
import { ROUTES } from "@/config/routes";
import { APP_NAME } from "@/config/constants";
import { cn } from "@/utils/cn";

type PageState = "loading" | "preview" | "joining" | "error";

export default function JoinPage() {
  const { token } = useParams<{ token: string }>();
  const { user, login } = useAuth();
  const router = useRouter();

  const [state, setState] = useState<PageState>("loading");
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch org name so we can show it before the user signs in
  useEffect(() => {
    inviteService
      .preview(token)
      .then((p) => {
        setPreview(p);
        setState("preview");
      })
      .catch(() => {
        setErrorMsg("This invite link is invalid or has expired.");
        setState("error");
      });
  }, [token]);

  // Once the user is authenticated, accept the invite and redirect
  useEffect(() => {
    if (state !== "joining" || !user) return;

    inviteService
      .accept(token)
      .then(() => router.push(ROUTES.dashboard))
      .catch(() => {
        setErrorMsg("Failed to join the workspace. Please try again.");
        setState("error");
      });
  }, [state, user, token, router]);

  async function handleJoin() {
    try {
      setState("joining");
      if (!user) {
        await login();
      }
      // The useEffect above will fire once `user` is set
    } catch {
      setErrorMsg("Sign-in failed. Please try again.");
      setState("error");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950 text-white text-lg font-bold">
            L
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">{APP_NAME}</h1>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-8">
          {state === "loading" && (
            <div className="flex justify-center py-4">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
            </div>
          )}

          {state === "preview" && preview && (
            <>
              <p className="mb-1 text-center text-xs font-medium uppercase tracking-widest text-neutral-400">
                You&apos;re invited to
              </p>
              <p className="mb-6 text-center text-lg font-semibold text-neutral-950">
                {preview.tenant_name}
              </p>
              <button
                onClick={handleJoin}
                className={cn(
                  "flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-3",
                  "text-sm font-medium text-neutral-800 transition-all",
                  "hover:bg-neutral-50 hover:border-neutral-400",
                  "focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
                )}
              >
                <GoogleIcon />
                {user ? "Join workspace" : "Sign in with Google to join"}
              </button>
            </>
          )}

          {state === "joining" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
              <p className="text-sm text-neutral-500">Joining workspace…</p>
            </div>
          )}

          {state === "error" && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-center text-sm text-red-700">
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
