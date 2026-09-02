import { z } from "zod";

export const adminUserDocumentSchema = z
  .object({
    email: z.string().trim().email(),
    passwordHash: z.string().trim().min(1),
    name: z.string().trim().min(1).optional(),
    isActive: z.boolean().default(true),
    lastLoginAt: z.coerce.date().optional(),
  })
  .strict();

export const adminUserCreateSchema = adminUserDocumentSchema;

export type AdminUserDocumentInput = z.infer<typeof adminUserDocumentSchema>;
