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
        "flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 truncate text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
