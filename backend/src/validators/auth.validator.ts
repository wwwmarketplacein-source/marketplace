import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),

  firstName: z.string().min(2),
  lastName: z.string().min(2),

  companyName: z.string().min(2),

  role: z.enum([
    "BUYER",
    "VENDOR",
    "INVESTOR"
  ])
}); 