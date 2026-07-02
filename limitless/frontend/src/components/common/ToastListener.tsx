"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export function ToastListener() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    function handleServerError(e: Event) {
      const msg = (e as CustomEvent<{ message: string }>).detail?.message;
      setToast(msg ?? "Something went wrong.");
      setTimeout(() => setToast(null), 4000);
    }
    window.addEventListener("api:server-error", handleServerError);
    return () => window.removeEventListener("api:server-error", handleServerError);
  }, []);

  if (!toast) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700 shadow-lg",
        "animate-in fade-in slide-in-from-bottom-4"
      )}
    >
      {toast}
    </div>
  );
}
