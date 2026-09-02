import { z } from "zod";
import {
  contentBlockSchema,
  contentImageSchema,
  embeddedFaqItemSchema,
  pageCtaSchema,
  seoFieldsSchema,
  treatmentLayoutVariantSchema,
  treatmentSlugSchema,
} from "./common";

export const treatmentDocumentSchema = z
  .object({
    slug: treatmentSlugSchema,
    title: z.string().trim().min(1),
    shortDescription: z.string().trim().min(1),
    emotionalOpening: z.string().trim().min(1),
    whatItIs: contentBlockSchema,
    whoItSuits: contentBlockSchema,
    sessionProcess: contentBlockSchema,
    supportiveGoals: contentBlockSchema,
    expectations: contentBlockSchema,
    disclaimer: z.string().trim().min(1).optional(),
    cta: pageCtaSchema,
    image: contentImageSchema,
    faq: z.array(embeddedFaqItemSchema).optional(),
    layoutVariant: treatmentLayoutVariantSchema,
    isActive: z.boolean(),
    sortOrder: z.number().int().min(0),
    seo: seoFieldsSchema,
  })
  .strict();

export type TreatmentDocumentInput = z.infer<typeof treatmentDocumentSchema>;
