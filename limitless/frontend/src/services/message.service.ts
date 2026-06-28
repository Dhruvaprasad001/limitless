import type { AxiosInstance } from "axios";
import { API_ENDPOINTS, DEFAULT_MESSAGES_LIMIT } from "@/config/constants";
import type { MessageCreate, MessageResponse } from "@/types/message";

export class MessageService {
  constructor(private readonly client: AxiosInstance) {}

  async createMessage(data: MessageCreate): Promise<MessageResponse> {
    const response = await this.client.post<MessageResponse>(
      API_ENDPOINTS.messages,
      data
    );
    return response.data;
  }

  async getMessages(limit: number = DEFAULT_MESSAGES_LIMIT): Promise<MessageResponse[]> {
    const response = await this.client.get<MessageResponse[]>(API_ENDPOINTS.messages, {
      params: { limit },
    });
    return response.data;
  }
}

import apiClient from "@/lib/axios";
export const messageService = new MessageService(apiClient);
