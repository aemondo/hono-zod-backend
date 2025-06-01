import { z } from "zod";

export const DealSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  amount: z.number().positive().default(0),
  createdAt: z.date(),
});

export type Deal = z.infer<typeof DealSchema>;
