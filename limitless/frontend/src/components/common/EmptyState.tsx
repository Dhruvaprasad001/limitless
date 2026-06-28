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
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
