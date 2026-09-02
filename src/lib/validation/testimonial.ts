import { z } from "zod";

export const testimonialDocumentSchema = z
  .object({
    quote: z.string().trim().min(1),
    name: z.string().trim().min(1).optional(),
    context: z.string().trim().min(1).optional(),
    sortOrder: z.number().int().min(0),
    isPublished: z.boolean(),
  })
  .strict();

export type TestimonialDocumentInput = z.infer<typeof testimonialDocumentSchema>;
