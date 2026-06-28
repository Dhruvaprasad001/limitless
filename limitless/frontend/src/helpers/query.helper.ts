import type { QueryResponse } from "@/types/query";

export function hasSupportingEvidence(result: QueryResponse): boolean {
  return result.supporting_message_ids.length > 0;
}

export function getConfidenceLabel(confident: boolean): string {
  return confident ? "High confidence" : "Low confidence";
}

export function summarizePlan(result: QueryResponse): string {
  const plan = result.query_plan;
  const parts: string[] = [];
  if (plan.intent) parts.push(`Intent: ${plan.intent}`);
  if (plan.entity) parts.push(`Entity: ${plan.entity}`);
  if (plan.time_range) parts.push(`Time: ${plan.time_range}`);
  return parts.join(" · ") || "General query";
}
