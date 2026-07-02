export interface QueryRequest {
  question: string;
}

export interface QueryPlan {
  intent: string | null;
  entity: string | null;
  time_range: string | null;
  confident: boolean;
}

export interface QueryResponse {
  answer: string;
  supporting_message_ids: string[];
  supporting_timestamps: string[];
  supporting_user_names: string[];
  supporting_messages: string[];
  query_plan: QueryPlan;
}
