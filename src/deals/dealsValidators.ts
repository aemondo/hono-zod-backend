import { z } from "zod/v4";

export const dealSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});
