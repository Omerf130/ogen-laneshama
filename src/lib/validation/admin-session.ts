import { z } from "zod";

export const adminSessionDocumentSchema = z
  .object({
    adminUserId: z.string().trim().min(1),
    tokenHash: z.string().trim().min(1),
    expiresAt: z.coerce.date(),
  })
  .strict();

export type AdminSessionDocumentInput = z.infer<typeof adminSessionDocumentSchema>;
