import { z } from "zod";

export const DealSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  amount: z.number().positive(),
  createdAt: z.date(),
});

export type Deal = z.infer<typeof DealSchema>;
