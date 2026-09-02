import { z } from "zod";

export const faqItemDocumentSchema = z
  .object({
    id: z.string().trim().min(1),
    question: z.string().trim().min(1),
    answer: z.string().trim().min(1),
    sortOrder: z.number().int().min(0),
    isPublished: z.boolean(),
  })
  .strict();

export type FaqItemDocumentInput = z.infer<typeof faqItemDocumentSchema>;
