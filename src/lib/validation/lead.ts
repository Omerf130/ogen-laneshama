import { z } from "zod";
import { leadStatusSchema } from "./common";

export const publicContactFormSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(1).max(40),
    email: z.string().trim().email().max(254),
    message: z.string().trim().min(1).max(4000),
    website: z.string().optional(),
    formStartedAt: z.coerce.number().optional(),
  })
  .strict();

/** @deprecated Use publicContactFormSchema for public submissions */
export const publicLeadInputSchema = z
  .object({
    name: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    email: z.string().trim().email(),
    message: z.string().trim().min(1),
    sourcePage: z.string().trim().min(1).default("/contact"),
    sourceReferrer: z.string().trim().min(1).optional(),
    userAgent: z.string().trim().min(1).optional(),
    ipHash: z.string().trim().min(1).optional(),
  })
  .strict();

export const adminLeadUpdateSchema = z
  .object({
    status: leadStatusSchema.optional(),
    isRead: z.boolean().optional(),
    internalNotes: z.string().optional(),
    archivedAt: z.coerce.date().nullable().optional(),
  })
  .strict();

export const leadDocumentSchema = z
  .object({
    name: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    email: z.string().trim().email(),
    message: z.string().trim().min(1),
    status: leadStatusSchema.default("NEW"),
    isRead: z.boolean().default(false),
    internalNotes: z.string().optional(),
    sourcePage: z.string().trim().min(1),
    sourceReferrer: z.string().trim().min(1).optional(),
    userAgent: z.string().trim().min(1).optional(),
    ipHash: z.string().trim().min(1).optional(),
    archivedAt: z.coerce.date().nullable().optional(),
  })
  .strict();

export type PublicContactFormInput = z.infer<typeof publicContactFormSchema>;
export type PublicLeadInput = z.infer<typeof publicLeadInputSchema>;
export type AdminLeadUpdateInput = z.infer<typeof adminLeadUpdateSchema>;
export type LeadDocumentInput = z.infer<typeof leadDocumentSchema>;
