import { z } from "zod";

export const messageCreateSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
  event_time: z.string().optional(),
});

export type MessageCreateFormValues = z.infer<typeof messageCreateSchema>;
