import { z } from "zod";
import { homepageDocumentSchema } from "@/lib/validation/homepage";
import {
  aboutContentSchema,
  contactPageContentSchema,
  contentPageDocumentSchema,
  pregnancyMotherhoodContentSchema,
  treatmentsIndexContentSchema,
} from "@/lib/validation/content-page";
import { treatmentDocumentSchema } from "@/lib/validation/treatment";
import { faqItemDocumentSchema } from "@/lib/validation/faq";
import { testimonialDocumentSchema } from "@/lib/validation/testimonial";
import {
  contactInfoSchema,
  seoFieldsSchema,
  socialLinkSchema,
  whatsAppInfoSchema,
} from "@/lib/validation/common";
import { CONTENT_PAGE_SLUGS } from "@/lib/db/repositories/constants";

export const TREATMENT_SLUGS = [
  "psychotherapy",
  "aroma-touch",
  "reiki",
  "guidance",
] as const;

export const adminHomepageSaveSchema = homepageDocumentSchema;

export const adminSiteSettingsSaveSchema = z
  .object({
    businessName: z.string().trim().min(1),
    therapistName: z.string().trim().min(1),
    tagline: z.string().trim().min(1),
    siteUrl: z.string().trim().min(1),
    contact: contactInfoSchema.extend({
      email: z.string().trim().email().or(z.literal("")),
    }),
    whatsapp: whatsAppInfoSchema,
    socialLinks: z.array(socialLinkSchema),
    footerBrandSentence: z.string().trim().min(1),
    defaultSeo: seoFieldsSchema,
  })
  .strict();

export const adminContentPageSlugSchema = z.enum(CONTENT_PAGE_SLUGS);

export const adminAboutPageSaveSchema = z
  .object({
    slug: z.literal("about"),
    content: aboutContentSchema,
    seo: seoFieldsSchema,
  })
  .strict();

export const adminPregnancyPageSaveSchema = z
  .object({
    slug: z.literal("pregnancy-motherhood"),
    content: pregnancyMotherhoodContentSchema,
    seo: seoFieldsSchema,
  })
  .strict();

export const adminContactPageSaveSchema = z
  .object({
    slug: z.literal("contact"),
    content: contactPageContentSchema,
    seo: seoFieldsSchema,
  })
  .strict();

export const adminTreatmentsIndexPageSaveSchema = z
  .object({
    slug: z.literal("treatments"),
    content: treatmentsIndexContentSchema,
    seo: seoFieldsSchema,
  })
  .strict();

export const adminContentPageSaveSchema = z.discriminatedUnion("slug", [
  adminAboutPageSaveSchema,
  adminPregnancyPageSaveSchema,
  adminContactPageSaveSchema,
  adminTreatmentsIndexPageSaveSchema,
]);

export const adminTreatmentSlugParamSchema = z.enum(TREATMENT_SLUGS);

export const adminTreatmentUpdateSchema = treatmentDocumentSchema.omit({
  slug: true,
});

export const adminTreatmentSaveSchema = z
  .object({
    slug: adminTreatmentSlugParamSchema,
    treatment: adminTreatmentUpdateSchema,
  })
  .strict();

export const adminTreatmentActiveSchema = z
  .object({
    slug: adminTreatmentSlugParamSchema,
    isActive: z.boolean(),
  })
  .strict();

export const adminTreatmentReorderSchema = z
  .object({
    orderedSlugs: z.array(adminTreatmentSlugParamSchema).length(TREATMENT_SLUGS.length),
  })
  .strict()
  .refine(
    (value) => new Set(value.orderedSlugs).size === value.orderedSlugs.length,
    "Duplicate treatment slugs in reorder payload",
  );

export const adminFaqCreateSchema = faqItemDocumentSchema.omit({ id: true, sortOrder: true });

export const adminFaqUpdateSchema = faqItemDocumentSchema.omit({ id: true, sortOrder: true }).extend({
  id: z.string().trim().min(1),
});

export const adminFaqDeleteSchema = z
  .object({
    id: z.string().trim().min(1),
  })
  .strict();

export const adminFaqReorderSchema = z
  .object({
    orderedIds: z.array(z.string().trim().min(1)).min(1),
  })
  .strict();

export const adminFaqTogglePublishSchema = z
  .object({
    id: z.string().trim().min(1),
    isPublished: z.boolean(),
  })
  .strict();

export const adminTestimonialCreateSchema = testimonialDocumentSchema.omit({
  sortOrder: true,
});

export const adminTestimonialUpdateSchema = testimonialDocumentSchema
  .omit({ sortOrder: true })
  .extend({
    mongoId: z.string().trim().min(1),
  });

export const adminTestimonialDeleteSchema = z
  .object({
    mongoId: z.string().trim().min(1),
  })
  .strict();

export const adminTestimonialReorderSchema = z
  .object({
    orderedMongoIds: z.array(z.string().trim().min(1)).min(1),
  })
  .strict();

export const adminTestimonialTogglePublishSchema = z
  .object({
    mongoId: z.string().trim().min(1),
    isPublished: z.boolean(),
  })
  .strict();

export function validateContentPageDocument(input: unknown) {
  return contentPageDocumentSchema.safeParse(input);
}
