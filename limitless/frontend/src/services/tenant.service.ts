import type { AxiosInstance } from "axios";
import { API_ENDPOINTS } from "@/config/constants";
import type { TenantResponse } from "@/types/tenant";

export class TenantService {
  constructor(private readonly client: AxiosInstance) {}

  async getMyTenant(): Promise<TenantResponse> {
    const response = await this.client.get<TenantResponse>(API_ENDPOINTS.tenant);
    return response.data;
  }

  async updateMyTenant(name: string): Promise<TenantResponse> {
    const response = await this.client.patch<TenantResponse>(API_ENDPOINTS.tenant, { name });
    return response.data;
  }
}

import apiClient from "@/lib/axios";
export const tenantService = new TenantService(apiClient);
