import type { MessageResponse } from "@/types/message";
import { formatRelative, formatDateTime } from "@/utils/date";
import { initials } from "@/utils/format";
import { cn } from "@/utils/cn";

interface MessageCardProps {
  message: MessageResponse;
  className?: string;
}

export function MessageCard({ message, className }: MessageCardProps) {
  const isOptimistic = message.id.startsWith("optimistic-");

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-opacity",
        isOptimistic && "opacity-60",
        className
      )}
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
        {initials(message.user_id.slice(0, 8))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium text-slate-500">
            {message.user_id.slice(0, 8)}…
          </p>
          <time
            className="flex-shrink-0 text-xs text-slate-400"
            dateTime={message.event_time}
            title={formatDateTime(message.event_time)}
          >
            {formatRelative(message.event_time)}
          </time>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-800">{message.content}</p>
        {isOptimistic && (
          <p className="mt-1 text-xs text-slate-400">Sending…</p>
        )}
      </div>
    </div>
  );
}
