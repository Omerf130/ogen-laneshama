import type { TreatmentLeanDocument } from "@/lib/db/repositories/treatment.repository";
import { parseWithMapperValidation } from "@/lib/db/mappers/errors";
import { normalizeContentBlock } from "@/lib/db/mappers/normalize-content-block";
import { treatmentDocumentSchema } from "@/lib/validation/treatment";
import type { Treatment, TreatmentSlug } from "@/types/content";

export function mapTreatmentDocumentToTreatment(
  doc: TreatmentLeanDocument,
): Treatment {
  const validated = parseWithMapperValidation(
    "Treatment",
    doc.slug,
    treatmentDocumentSchema,
    {
      slug: doc.slug,
      title: doc.title,
      shortDescription: doc.shortDescription,
      emotionalOpening: doc.emotionalOpening,
      whatItIs: doc.whatItIs,
      whoItSuits: doc.whoItSuits,
      sessionProcess: doc.sessionProcess,
      supportiveGoals: doc.supportiveGoals,
      expectations: doc.expectations,
      disclaimer: doc.disclaimer,
      cta: doc.cta,
      image: doc.image,
      faq: doc.faq,
      layoutVariant: doc.layoutVariant,
      isActive: doc.isActive,
      sortOrder: doc.sortOrder,
      seo: doc.seo,
    },
  );

  const treatment: Treatment = {
    slug: validated.slug as TreatmentSlug,
    title: validated.title,
    shortDescription: validated.shortDescription,
    emotionalOpening: validated.emotionalOpening,
    whatItIs: normalizeContentBlock(validated.whatItIs),
    whoItSuits: normalizeContentBlock(validated.whoItSuits),
    sessionProcess: normalizeContentBlock(validated.sessionProcess),
    supportiveGoals: normalizeContentBlock(validated.supportiveGoals),
    expectations: normalizeContentBlock(validated.expectations),
    cta: validated.cta,
    image: validated.image,
    layoutVariant: validated.layoutVariant,
  };

  if (validated.disclaimer !== undefined) {
    treatment.disclaimer = validated.disclaimer;
  }

  if (validated.faq !== undefined) {
    treatment.faq = validated.faq;
  }

  return treatment;
}

export function mapTreatmentDocumentsToTreatments(
  docs: TreatmentLeanDocument[],
): Treatment[] {
  return docs.map(mapTreatmentDocumentToTreatment);
}
