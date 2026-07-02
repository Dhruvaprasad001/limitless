export const QUERY_KEYS = {
  messages: ["messages"] as const,
  dashboard: ["dashboard"] as const,
  users: ["users"] as const,
} as const;

export const API_ENDPOINTS = {
  messages: "/messages/",
  query: "/query/",
  users: "/users/",
} as const;

export const APP_NAME = "Limitless";
export const DEFAULT_MESSAGES_LIMIT = 20;
