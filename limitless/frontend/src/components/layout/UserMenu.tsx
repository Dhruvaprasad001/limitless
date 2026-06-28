"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/config/routes";
import { getUserInitials, getUserDisplayName } from "@/helpers/auth.helper";
import { cn } from "@/utils/cn";

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    router.push(ROUTES.login);
  }

  const initials = getUserInitials(user);
  const displayName = getUserDisplayName(user);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="User menu"
      >
        {user?.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={displayName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            {initials}
          </div>
        )}
        <span className="hidden text-slate-700 sm:block">{displayName}</span>
        <svg
          className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-slate-900">{displayName}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
