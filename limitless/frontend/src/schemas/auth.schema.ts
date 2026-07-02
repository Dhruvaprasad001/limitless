import { z } from "zod";

export const loginSchema = z.object({
  // login is Google Sign-In only, no form fields
});

export type LoginFormValues = z.infer<typeof loginSchema>;
