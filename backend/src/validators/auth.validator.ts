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
  ]),

  tradingName: z.string().optional(),
  registrationNumber: z.string().optional(),
  businessType: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().optional(),
  websiteUrl: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});