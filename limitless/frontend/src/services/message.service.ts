import apiClient from "@/lib/axios";
import { MessagesApi, Configuration } from "@client";
import { env } from "@/config/env";

const api = new MessagesApi(
  new Configuration({ basePath: env.apiBaseUrl }),
  env.apiBaseUrl,
  apiClient
);

export const messageService = {
  async createMessage(content: string, event_time?: string | null) {
    const { data } = await api.createMessageMessagesPost({
      messageCreate: { content, event_time },
    });
    return data;
  },

  async getMessages(limit = 20, page = 1) {
    const { data } = await api.listMessagesMessagesGet({ limit, page });
    return data;
  },
};
