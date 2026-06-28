import { formatDateTime } from "@/utils/date";
import { cn } from "@/utils/cn";

interface EvidenceCardProps {
  messageId: string;
  timestamp: string;
  index: number;
  className?: string;
}

export function EvidenceCard({ messageId, timestamp, index, className }: EvidenceCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="truncate font-mono text-xs text-slate-500" title={messageId}>
            {messageId}
          </p>
          <time className="text-xs text-slate-400">{formatDateTime(timestamp)}</time>
        </div>
      </div>
    </div>
  );
}
