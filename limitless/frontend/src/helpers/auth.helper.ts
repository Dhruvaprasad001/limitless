import type { User } from "firebase/auth";

export function getUserDisplayName(user: User | null): string {
  return user?.displayName ?? user?.email ?? "Unknown";
}

export function getUserInitials(user: User | null): string {
  const name = user?.displayName ?? user?.email ?? "";
  return name
    .split(/[\s@]/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
