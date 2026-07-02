import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-neutral-950">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
