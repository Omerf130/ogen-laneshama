import { z } from "zod";

export const ADMIN_PASSWORD_MIN_LENGTH = 12;

export const adminLoginSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  })
  .strict();

export const adminBootstrapSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().min(ADMIN_PASSWORD_MIN_LENGTH),
    name: z.string().trim().min(1).optional(),
  })
  .strict();

export const adminIdentitySchema = z
  .object({
    id: z.string().trim().min(1),
    email: z.string().trim().email(),
    name: z.string().trim().min(1).optional(),
  })
  .strict();

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminBootstrapInput = z.infer<typeof adminBootstrapSchema>;
export type AdminIdentity = z.infer<typeof adminIdentitySchema>;
