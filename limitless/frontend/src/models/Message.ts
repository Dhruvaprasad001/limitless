export interface Message {
  id: string;
  tenantId: string;
  userId: string;
  content: string;
  eventTime: string;
  ingestedAt: string;
}

export function toMessage(raw: {
  id: string;
  tenant_id: string;
  user_id: string;
  content: string;
  event_time: string;
  ingested_at: string;
}): Message {
  return {
    id: raw.id,
    tenantId: raw.tenant_id,
    userId: raw.user_id,
    content: raw.content,
    eventTime: raw.event_time,
    ingestedAt: raw.ingested_at,
  };
}
