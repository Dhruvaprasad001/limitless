import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  className?: string;
}

export function DashboardCard({ label, value, icon, className }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-6",
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-white">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">{label}</p>
        <p className="mt-1.5 truncate text-xl font-bold text-neutral-950 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
