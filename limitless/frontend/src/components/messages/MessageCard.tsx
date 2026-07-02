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
        "flex gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-opacity",
        isOptimistic && "opacity-50",
        className
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">
        {initials(message.user_name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium text-neutral-500">
            {message.user_name}
          </p>
          <time
            className="shrink-0 text-xs text-neutral-400"
            dateTime={message.event_time}
            title={formatDateTime(message.event_time)}
          >
            {formatRelative(message.event_time)}
          </time>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-neutral-800">{message.content}</p>
        {isOptimistic && (
          <p className="mt-1 text-xs text-neutral-400">Sending…</p>
        )}
      </div>
    </div>
  );
}
