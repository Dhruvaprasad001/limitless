import apiClient from "@/lib/axios";
import { UsersApi, Configuration } from "@client";
import { env } from "@/config/env";

const api = new UsersApi(
  new Configuration({ basePath: env.apiBaseUrl }),
  env.apiBaseUrl,
  apiClient
);

export const userService = {
  async getUsers() {
    const { data } = await api.listUsersUsersGet({});
    return data;
  },
};
