import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  description: z.string().min(10),
  requirements: z.string().optional(),
  minBudget: z.coerce.number().nonnegative(),
  maxBudget: z.coerce.number().positive(),
  deadline: z.coerce.date(),
  ndaRequired: z.coerce.boolean().default(false),
  skills: z
    .union([
      z.array(z.string()),
      z.string()
    ])
    .optional()
});

export const bidSchema = z.object({
  amount: z.coerce.number().positive(),
  proposal: z.string().min(10)
});
