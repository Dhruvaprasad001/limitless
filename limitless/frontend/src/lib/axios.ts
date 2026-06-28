import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";

let getTokenFn: (() => Promise<string | null>) | null = null;
let logoutFn: (() => void) | null = null;

export function registerAuthHandlers(
  getToken: () => Promise<string | null>,
  logout: () => void
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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      logoutFn?.();
      if (typeof window !== "undefined") {
        window.location.href = ROUTES.login;
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
