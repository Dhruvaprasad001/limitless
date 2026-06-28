import apiClient from "@/lib/axios";
import type { AxiosInstance } from "axios";

export function getApiClient(): AxiosInstance {
  return apiClient;
}
