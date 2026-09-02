import { z } from "zod";

export const mediaAssetDocumentSchema = z
  .object({
    originalFilename: z.string().trim().min(1),
    filename: z.string().trim().min(1),
    alt: z.string().trim().min(1),
    mimeType: z.string().trim().min(1),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    provider: z.string().trim().min(1),
    providerKey: z.string().trim().min(1),
    url: z.string().trim().min(1),
  })
  .strict();

export type MediaAssetDocumentInput = z.infer<typeof mediaAssetDocumentSchema>;
