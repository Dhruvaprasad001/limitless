import type { AxiosInstance } from "axios";
import { API_ENDPOINTS } from "@/config/constants";
import type { UserResponse } from "@/types/user";

export class UserService {
  constructor(private readonly client: AxiosInstance) {}

  async getUsers(): Promise<UserResponse[]> {
    const response = await this.client.get<UserResponse[]>(API_ENDPOINTS.users);
    return response.data;
  }
}

import apiClient from "@/lib/axios";
export const userService = new UserService(apiClient);
