"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/config/routes";
import { APP_NAME } from "@/config/constants";

const navItems = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.messages, label: "Messages", icon: MessageSquare },
  { href: ROUTES.ask, label: "Ask AI", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
          <Zap className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold text-slate-900">{APP_NAME}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-400">© 2026 {APP_NAME}</p>
      </div>
    </aside>
  );
}
