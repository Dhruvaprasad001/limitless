import { formatDateTime } from "@/utils/date";
import { initials } from "@/utils/format";
import { cn } from "@/utils/cn";

interface EvidenceCardProps {
  userName: string;
  timestamp: string;
  message: string;
  index: number;
  className?: string;
}

export function EvidenceCard({ userName, timestamp, message, index, className }: EvidenceCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-bold text-white">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700">
              {initials(userName)}
            </div>
            <span className="truncate text-xs font-semibold text-neutral-800">{userName}</span>
            <time className="shrink-0 text-xs text-neutral-400">{formatDateTime(timestamp)}</time>
          </div>
          <p className="text-xs leading-relaxed text-neutral-600 line-clamp-3">{message}</p>
        </div>
      </div>
    </div>
  );
}
