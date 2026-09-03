import { z } from "zod";

export const TREATMENT_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const seoFieldsSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    ogImageMediaId: z.string().trim().min(1).optional(),
  })
  .strict()
  .optional();

export const mediaRefSchema = z
  .object({
    mediaId: z.string().trim().min(1).optional(),
    src: z.string().trim().nullable().optional(),
    alt: z.string().trim().min(1),
  })
  .strict();

export const pageCtaSchema = z
  .object({
    label: z.string().trim().min(1),
    href: z.string().trim().min(1),
  })
  .strict();

export const contactInfoSchema = z
  .object({
    phone: z.string(),
    email: z.string(),
    address: z.string(),
  })
  .strict();

export const whatsAppInfoSchema = z
  .object({
    number: z.string(),
    message: z.string(),
  })
  .strict();

export const socialPlatformSchema = z.enum([
  "facebook",
  "instagram",
  "youtube",
  "linkedin",
  "other",
]);

export const socialLinkSchema = z
  .object({
    platform: socialPlatformSchema,
    url: z.string().trim().min(1),
    label: z.string().trim().min(1),
  })
  .strict();

export const navItemSchema = z
  .object({
    label: z.string().trim().min(1),
    href: z.string().trim().min(1),
    external: z.boolean().optional(),
  })
  .strict();

export const footerContentSchema = z
  .object({
    brandSentence: z.string().trim().min(1),
    navItems: z.array(navItemSchema),
  })
  .strict();

export const contentBlockVariantSchema = z.enum([
  "default",
  "emphasis",
  "aside",
]);

export const contentBlockSchema = z
  .object({
    id: z.string().trim().min(1),
    title: z.string().trim().min(1).optional(),
    body: z.union([
      z.string().trim().min(1),
      z.array(z.string().trim().min(1)).min(1),
    ]),
    variant: contentBlockVariantSchema.optional(),
  })
  .strict();

export const contentImageSchema = z
  .object({
    src: z.string().nullable(),
    alt: z.string().trim().min(1),
    mediaId: z.string().trim().min(1).optional(),
  })
  .strict();

export const treatmentSlugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(TREATMENT_SLUG_REGEX, {
    message: "Slug must be lowercase URL-safe (letters, numbers, hyphens)",
  });

export const processStepSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
  })
  .strict();

export const exactlyFourProcessStepsSchema = z
  .array(processStepSchema)
  .length(4, {
    message:
      "Process section requires exactly 4 steps (frontend design constraint)",
  });

export const exactlyFourWhoIsItForItemsSchema = z
  .array(z.string().trim().min(1))
  .length(4, {
    message:
      "Who Is It For requires exactly 4 items (frontend design constraint)",
  });

export const embeddedFaqItemSchema = z
  .object({
    id: z.string().trim().min(1),
    question: z.string().trim().min(1),
    answer: z.string().trim().min(1),
  })
  .strict();

export const treatmentLayoutVariantSchema = z.enum([
  "standard",
  "immersive",
  "process-focused",
]);

export const leadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "CLOSED",
  "ARCHIVED",
]);
