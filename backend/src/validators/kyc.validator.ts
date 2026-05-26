import { z } from "zod";

export const kycSchema = z.object({
  designation: z.string().min(2),
  phone: z.string().min(6),
  idType: z.string().min(2),
  idNumber: z.string().min(3)
});
