import { z } from "zod";
import { leadStatusSchema } from "./common";

export const VERCEL_BLOB_PROVIDER = "vercel-blob";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024;

export const adminLeadUpdateActionSchema = z
  .object({
    leadId: z.string().trim().min(1),
    status: leadStatusSchema.optional(),
    isRead: z.boolean().optional(),
    internalNotes: z.string().max(4000).optional(),
  })
  .strict();

export const adminLeadArchiveActionSchema = z
  .object({
    leadId: z.string().trim().min(1),
  })
  .strict();

export const adminMediaUpdateAltSchema = z
  .object({
    mediaId: z.string().trim().min(1),
    alt: z.string().trim().min(1).max(200),
  })
  .strict();

export const adminMediaDeleteSchema = z
  .object({
    mediaId: z.string().trim().min(1),
  })
  .strict();

export const adminMediaCreateFromBlobSchema = z
  .object({
    originalFilename: z.string().trim().min(1).max(255),
    filename: z.string().trim().min(1).max(255),
    alt: z.string().trim().min(1).max(200),
    mimeType: z.enum(ALLOWED_IMAGE_MIME_TYPES),
    providerKey: z.string().trim().min(1),
    url: z.string().trim().url(),
    size: z.number().int().positive().max(MAX_IMAGE_UPLOAD_BYTES).optional(),
  })
  .strict();
