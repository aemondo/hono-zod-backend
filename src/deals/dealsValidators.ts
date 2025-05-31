import { DealSchema } from "./deal";

export const dealUpdateSchema = DealSchema.omit({ createdAt: true, id: true });
