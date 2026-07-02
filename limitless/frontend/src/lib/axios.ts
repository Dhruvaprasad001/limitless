import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";

let getTokenFn: (() => Promise<string | null>) | null = null;
let logoutFn: (() => Promise<void>) | null = null;

export function registerAuthHandlers(
  getToken: () => Promise<string | null>,
  logout: () => Promise<void>
) {
  getTokenFn = getToken;
  logoutFn = logout;
}

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (getTokenFn) {
    const token = await getTokenFn();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Track whether we're already retrying a 401 to avoid infinite loops.
let isRefreshing = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        // Force-refresh the Firebase token. getAccessToken already handles
        // expiry logic and updates the __session cookie.
        if (getTokenFn) {
          const freshToken = await getTokenFn();
          if (freshToken && error.config) {
            // Retry the original request once with the new token.
            error.config.headers.Authorization = `Bearer ${freshToken}`;
            isRefreshing = false;
            return apiClient(error.config);
          }
        }
        // No token available — session is genuinely gone, log out.
        await logoutFn?.();
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.login;
        }
      } catch {
        // Token refresh threw — session is genuinely gone, log out.
        await logoutFn?.();
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.login;
        }
      } finally {
        isRefreshing = false;
      }
    }

    if (status && status >= 500) {
      if (typeof window !== "undefined") {
        const event = new CustomEvent("api:server-error", {
          detail: { message: "Something went wrong. Please try again." },
        });
        window.dispatchEvent(event);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
