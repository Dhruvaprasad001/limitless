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
        "rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-bold text-white">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="truncate font-mono text-xs text-neutral-500" title={messageId}>
            {messageId}
          </p>
          <time className="text-xs text-neutral-400">{formatDateTime(timestamp)}</time>
        </div>
      </div>
    </div>
  );
}
