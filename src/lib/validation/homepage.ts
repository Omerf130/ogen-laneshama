import { z } from "zod";
import {
  exactlyFourProcessStepsSchema,
  exactlyFourWhoIsItForItemsSchema,
  mediaRefSchema,
  seoFieldsSchema,
} from "./common";

const homepageHeroSchema = z
  .object({
    eyebrow: z.string().trim().min(1),
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
    ctaPrimary: z.string().trim().min(1),
  })
  .strict();

const homepageWhoIsItForSchema = z
  .object({
    eyebrow: z.string().trim().min(1),
    titleLines: z.tuple([
      z.string().trim().min(1),
      z.string().trim().min(1),
    ]),
    items: exactlyFourWhoIsItForItemsSchema,
  })
  .strict();

const homepageRecognitionSchema = z
  .object({
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
    supportingStatements: z.array(z.string().trim().min(1)).min(1),
    featuredStatement: z.string().trim().min(1),
    featuredAccent: z.string().trim().min(1).optional(),
    whoIsItFor: homepageWhoIsItForSchema,
  })
  .strict();

const homepageAboutPreviewSchema = z
  .object({
    eyebrow: z.string().trim().min(1),
    title: z.string().trim().min(1),
    featuredStatement: z.string().trim().min(1),
    featuredAccent: z.string().trim().min(1).optional(),
    supportingCopy: z.string().trim().min(1),
    whyRacheli: z
      .object({
        title: z.string().trim().min(1),
        points: z.array(z.string().trim().min(1)).min(1),
      })
      .strict(),
    ctaLabel: z.string().trim().min(1),
  })
  .strict();

const homepageTreatmentsPreviewSchema = z
  .object({
    eyebrow: z.string().trim().min(1),
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
    ctaLabel: z.string().trim().min(1),
  })
  .strict();

const homepagePregnancySpotlightSchema = z
  .object({
    eyebrow: z.string().trim().min(1),
    featuredStatement: z.string().trim().min(1),
    excerpt: z.string().trim().min(1),
    disclaimer: z.string().trim().min(1),
    ctaLabel: z.string().trim().min(1),
  })
  .strict();

const homepageProcessSchema = z
  .object({
    eyebrow: z.string().trim().min(1),
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
    steps: exactlyFourProcessStepsSchema,
  })
  .strict();

const homepageTestimonialsSectionSchema = z
  .object({
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
  })
  .strict();

const homepageFaqSectionSchema = z
  .object({
    eyebrow: z.string().trim().min(1),
    title: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
  })
  .strict();

const homepageContactCtaSchema = z
  .object({
    eyebrow: z.string().trim().min(1),
    featuredStatement: z.string().trim().min(1),
    subtitle: z.string().trim().min(1),
    ctaLabel: z.string().trim().min(1),
  })
  .strict();

export const homepageContentSchema = z
  .object({
    hero: homepageHeroSchema,
    recognition: homepageRecognitionSchema,
    aboutPreview: homepageAboutPreviewSchema,
    treatmentsPreview: homepageTreatmentsPreviewSchema,
    pregnancySpotlight: homepagePregnancySpotlightSchema,
    process: homepageProcessSchema,
    testimonialsSection: homepageTestimonialsSectionSchema,
    faqSection: homepageFaqSectionSchema,
    contactCta: homepageContactCtaSchema,
  })
  .strict();

export const homepageAssetsSchema = z
  .object({
    hero: mediaRefSchema.optional(),
    aboutPortrait: mediaRefSchema.optional(),
    pregnancySpotlight: mediaRefSchema.optional(),
    botanicalAccent: mediaRefSchema.optional(),
  })
  .strict()
  .optional();

export const homepageSectionVisibilitySchema = z
  .object({
    faq: z.boolean().optional(),
    testimonials: z.boolean().optional(),
  })
  .strict()
  .optional();

export const homepageDocumentSchema = z
  .object({
    content: homepageContentSchema,
    assets: homepageAssetsSchema,
    sectionVisibility: homepageSectionVisibilitySchema,
    seo: seoFieldsSchema,
  })
  .strict();

export type HomepageDocumentInput = z.infer<typeof homepageDocumentSchema>;
