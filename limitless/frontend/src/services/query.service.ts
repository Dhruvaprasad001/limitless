import apiClient from "@/lib/axios";
import { QueryApi, Configuration } from "../../client";
import { env } from "@/config/env";

const api = new QueryApi(
  new Configuration({ basePath: env.apiBaseUrl }),
  env.apiBaseUrl,
  apiClient
);

export const queryService = {
  async askQuestion(question: string) {
    const { data } = await api.queryUpdatesQueryPost({ queryRequest: { question } });
    return data;
  },
};
