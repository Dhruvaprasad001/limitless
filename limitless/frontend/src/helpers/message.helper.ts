import type { MessageResponse } from "../../client";
import { formatRelative } from "@/utils/date";
import { truncate } from "@/utils/format";

export function getMessagePreview(msg: MessageResponse, maxLength = 120): string {
  return truncate(msg.content, maxLength);
}

export function getMessageTimestamp(msg: MessageResponse): string {
  return formatRelative(msg.event_time);
}

export function sortMessagesByNewest(messages: MessageResponse[]): MessageResponse[] {
  return [...messages].sort(
    (a, b) => new Date(b.event_time).getTime() - new Date(a.event_time).getTime()
  );
}
