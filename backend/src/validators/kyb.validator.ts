import { z } from "zod";

export const kybSchema = z.object({
  addressLine1: z.string().min(2),
  city: z.string().min(2),
  postalCode: z.string().min(2),
  annualTurnover: z.coerce.number().optional(),
  turnoverTier: z.string().optional()
});
