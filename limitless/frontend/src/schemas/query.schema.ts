import { z } from "zod";

export const queryRequestSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters").max(500),
});

export type QueryRequestFormValues = z.infer<typeof queryRequestSchema>;
