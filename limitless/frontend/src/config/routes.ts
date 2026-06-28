export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  messages: "/messages",
  ask: "/ask",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
