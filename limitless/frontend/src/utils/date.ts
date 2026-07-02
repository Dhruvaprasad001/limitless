import { formatDistanceToNow, format, parseISO } from "date-fns";

// The backend returns naive UTC datetimes without a timezone suffix.
// Appending "Z" tells date-fns to interpret them as UTC so the browser
// automatically converts to the user's local timezone (e.g. IST UTC+5:30).
function parseUTC(dateStr: string): Date {
  const normalized = dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : `${dateStr}Z`;
  return parseISO(normalized);
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseUTC(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return format(parseUTC(dateStr), "MMM d, yyyy h:mm a");
  } catch {
    return dateStr;
  }
}

export function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(parseUTC(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}
