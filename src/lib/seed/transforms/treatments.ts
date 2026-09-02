import { treatments } from "@/content/treatments/treatments.data";
import type { TreatmentDocumentInput } from "@/lib/validation/treatment";
import { TREATMENT_SEO_KEY, seoFromMetadataKey } from "./seo";

export function buildTreatmentPayloads(): TreatmentDocumentInput[] {
  return treatments.map((treatment, index) => {
    const seoKey = TREATMENT_SEO_KEY[treatment.slug];
    const { faq, ...rest } = treatment;

    const payload: TreatmentDocumentInput = {
      ...structuredClone(rest),
      isActive: true,
      sortOrder: index,
      seo: seoFromMetadataKey(seoKey),
    };

    if (faq !== undefined) {
      payload.faq = structuredClone(faq);
    }

    return payload;
  });
}

export function getExpectedTreatmentSlugs(): string[] {
  return treatments.map((treatment) => treatment.slug);
}
