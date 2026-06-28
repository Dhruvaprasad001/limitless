export interface QueryPlan {
  intent: string | null;
  entity: string | null;
  timeRange: string | null;
  confident: boolean;
}

export interface QueryResult {
  answer: string;
  supportingMessageIds: string[];
  supportingTimestamps: string[];
  queryPlan: QueryPlan;
}

export function toQueryResult(raw: {
  answer: string;
  supporting_message_ids: string[];
  supporting_timestamps: string[];
  query_plan: {
    intent: string | null;
    entity: string | null;
    time_range: string | null;
    confident: boolean;
  };
}): QueryResult {
  return {
    answer: raw.answer,
    supportingMessageIds: raw.supporting_message_ids,
    supportingTimestamps: raw.supporting_timestamps,
    queryPlan: {
      intent: raw.query_plan.intent,
      entity: raw.query_plan.entity,
      timeRange: raw.query_plan.time_range,
      confident: raw.query_plan.confident,
    },
  };
}
