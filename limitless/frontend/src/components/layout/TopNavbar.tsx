"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/messages": "Messages",
  "/ask": "Ask AI",
};

export function TopNavbar() {
  const pathname = usePathname();
  const title =
    Object.entries(titleMap).find(([key]) => pathname.startsWith(key))?.[1] ??
    "Limitless";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-base font-semibold text-slate-900">{title}</h1>
      <UserMenu />
    </header>
  );
}
