import type { ContentPageLeanDocument } from "@/lib/db/repositories/content-page.repository";
import { MapperValidationError, parseWithMapperValidation } from "@/lib/db/mappers/errors";
import {
  aboutContentSchema,
  contactPageContentSchema,
  contentPageDocumentSchema,
  pregnancyMotherhoodContentSchema,
  treatmentsIndexContentSchema,
} from "@/lib/validation/content-page";
import { CONTENT_PAGE_SLUG_TYPE_MAP } from "@/types/db/persistence";
import type {
  AboutContent,
  ContactPageContent,
  PregnancyMotherhoodContent,
  TreatmentSlug,
  TreatmentsIndexContent,
} from "@/types/content";

function validateContentPageDocument(doc: ContentPageLeanDocument): void {
  parseWithMapperValidation(
    "ContentPage",
    doc.slug,
    contentPageDocumentSchema,
    {
      slug: doc.slug,
      pageType: doc.pageType,
      content: doc.content,
      ...(doc.seo ? { seo: doc.seo } : {}),
    },
  );

  const expectedPageType = CONTENT_PAGE_SLUG_TYPE_MAP[doc.slug];

  if (doc.pageType !== expectedPageType) {
    throw new MapperValidationError("ContentPage", doc.slug, [
      `pageType "${doc.pageType}" does not match slug "${doc.slug}"`,
    ]);
  }
}

export function mapContentPageToAboutContent(
  doc: ContentPageLeanDocument,
): AboutContent {
  validateContentPageDocument(doc);

  if (doc.pageType !== "about") {
    throw new MapperValidationError("ContentPage", doc.slug, [
      `Expected pageType "about", got "${doc.pageType}"`,
    ]);
  }

  const validated = parseWithMapperValidation(
    "ContentPage",
    doc.slug,
    aboutContentSchema,
    doc.content,
  );

  return {
    ...validated,
    methods: {
      ...validated.methods,
      treatmentLinks: validated.methods.treatmentLinks.map((link) => ({
        slug: link.slug as TreatmentSlug,
        label: link.label,
      })),
    },
  };
}

export function mapContentPageToPregnancyMotherhoodContent(
  doc: ContentPageLeanDocument,
): PregnancyMotherhoodContent {
  validateContentPageDocument(doc);

  if (doc.pageType !== "pregnancy") {
    throw new MapperValidationError("ContentPage", doc.slug, [
      `Expected pageType "pregnancy", got "${doc.pageType}"`,
    ]);
  }

  return parseWithMapperValidation(
    "ContentPage",
    doc.slug,
    pregnancyMotherhoodContentSchema,
    doc.content,
  );
}

export function mapContentPageToContactPageContent(
  doc: ContentPageLeanDocument,
): ContactPageContent {
  validateContentPageDocument(doc);

  if (doc.pageType !== "contact") {
    throw new MapperValidationError("ContentPage", doc.slug, [
      `Expected pageType "contact", got "${doc.pageType}"`,
    ]);
  }

  return parseWithMapperValidation(
    "ContentPage",
    doc.slug,
    contactPageContentSchema,
    doc.content,
  );
}

export function mapContentPageToTreatmentsIndexContent(
  doc: ContentPageLeanDocument,
): TreatmentsIndexContent {
  validateContentPageDocument(doc);

  if (doc.pageType !== "treatments-index") {
    throw new MapperValidationError("ContentPage", doc.slug, [
      `Expected pageType "treatments-index", got "${doc.pageType}"`,
    ]);
  }

  return parseWithMapperValidation(
    "ContentPage",
    doc.slug,
    treatmentsIndexContentSchema,
    doc.content,
  );
}
