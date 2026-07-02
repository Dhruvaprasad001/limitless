export interface MessageCreate {
  content: string;
  event_time?: string;
}

export interface MessageResponse {
  id: string;
  tenant_id: string;
  user_id: string;
  content: string;
  event_time: string;
  ingested_at: string;
}

export interface MessageListResponse {
  total: number;
  page: number;
  limit: number;
  items: MessageResponse[];
}
