import type { AxiosInstance } from "axios";
import { API_ENDPOINTS } from "@/config/constants";
import type { QueryRequest, QueryResponse } from "@/types/query";

export class QueryService {
  constructor(private readonly client: AxiosInstance) {}

  async askQuestion(data: QueryRequest): Promise<QueryResponse> {
    const response = await this.client.post<QueryResponse>(
      API_ENDPOINTS.query,
      data
    );
    return response.data;
  }
}

import apiClient from "@/lib/axios";
export const queryService = new QueryService(apiClient);
