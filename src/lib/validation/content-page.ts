import { z } from "zod";
import { CONTENT_PAGE_SLUG_TYPE_MAP } from "@/types/db/persistence";
import {
  contentBlockSchema,
  contentImageSchema,
  pageCtaSchema,
  seoFieldsSchema,
  treatmentSlugSchema,
} from "./common";

const innerPageHeroSchema = z
  .object({
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
  })
  .strict();

export const aboutContentSchema = z
  .object({
    hero: innerPageHeroSchema,
    introduction: contentBlockSchema,
    philosophy: contentBlockSchema,
    approach: contentBlockSchema,
    methods: contentBlockSchema.extend({
      treatmentLinks: z.array(
        z
          .object({
            slug: treatmentSlugSchema,
            label: z.string().trim().min(1),
          })
          .strict(),
      ),
    }),
    safeSpace: contentBlockSchema,
    cta: pageCtaSchema,
    portrait: contentImageSchema,
  })
  .strict();

export const pregnancyMomentSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
  })
  .strict();

export const pregnancyMotherhoodContentSchema = z
  .object({
    hero: innerPageHeroSchema,
    recognition: contentBlockSchema,
    moments: z
      .object({
        title: z.string().trim().min(1),
        items: z.array(pregnancyMomentSchema).min(1),
      })
      .strict(),
    howSupportHelps: contentBlockSchema,
    process: contentBlockSchema,
    reassurance: contentBlockSchema,
    disclaimer: z.string().trim().min(1),
    cta: pageCtaSchema,
    image: contentImageSchema,
  })
  .strict();

export const contactFormContentSchema = z
  .object({
    nameLabel: z.string().trim().min(1),
    phoneLabel: z.string().trim().min(1),
    emailLabel: z.string().trim().min(1),
    messageLabel: z.string().trim().min(1),
    submitLabel: z.string().trim().min(1),
    devNotice: z.string(),
  })
  .strict();

export const contactPageContentSchema = z
  .object({
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
    intro: z.string().trim().min(1),
    contactMethodsHeading: z.string().trim().min(1),
    form: contactFormContentSchema,
    ctaWhatsApp: z.string().trim().min(1).optional(),
  })
  .strict();

export const treatmentsIndexContentSchema = z
  .object({
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
    intro: z.string().trim().min(1),
    cta: pageCtaSchema,
  })
  .strict();

export const contentPageTypeSchema = z.enum([
  "about",
  "pregnancy",
  "contact",
  "treatments-index",
]);

export const contentPageSlugSchema = z.enum([
  "about",
  "pregnancy-motherhood",
  "contact",
  "treatments",
]);

const contentByPageTypeSchema = z.discriminatedUnion("pageType", [
  z
    .object({
      pageType: z.literal("about"),
      content: aboutContentSchema,
    })
    .strict(),
  z
    .object({
      pageType: z.literal("pregnancy"),
      content: pregnancyMotherhoodContentSchema,
    })
    .strict(),
  z
    .object({
      pageType: z.literal("contact"),
      content: contactPageContentSchema,
    })
    .strict(),
  z
    .object({
      pageType: z.literal("treatments-index"),
      content: treatmentsIndexContentSchema,
    })
    .strict(),
]);

export const contentPageDocumentSchema = z
  .object({
    slug: contentPageSlugSchema,
    seo: seoFieldsSchema,
  })
  .strict()
  .and(contentByPageTypeSchema)
  .superRefine((value, ctx) => {
    const expectedPageType = CONTENT_PAGE_SLUG_TYPE_MAP[value.slug];

    if (value.pageType !== expectedPageType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `slug "${value.slug}" requires pageType "${expectedPageType}"`,
        path: ["pageType"],
      });
    }
  });

export type ContentPageDocumentInput = z.infer<typeof contentPageDocumentSchema>;
