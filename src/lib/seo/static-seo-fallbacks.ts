import { pageMetadata } from "@/content/pages/page-metadata";
import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";
import type { TreatmentSlug } from "@/types/content";
import type { PageMetadata, PageMetadataKey } from "@/types/seo";

export const CONTENT_PAGE_SEO_KEY = {
  about: "about",
  "pregnancy-motherhood": "pregnancyMotherhood",
  contact: "contact",
  treatments: "treatments",
} as const satisfies Record<RepositoryContentPageSlug, PageMetadataKey>;

export const TREATMENT_SEO_KEY = {
  psychotherapy: "treatmentPsychotherapy",
  "aroma-touch": "treatmentAromaTouch",
  reiki: "treatmentReiki",
  guidance: "treatmentGuidance",
} as const satisfies Record<TreatmentSlug, PageMetadataKey>;

export function getContentPageSeoKey(
  slug: RepositoryContentPageSlug,
): PageMetadataKey {
  return CONTENT_PAGE_SEO_KEY[slug];
}

export function getTreatmentSeoKey(slug: TreatmentSlug): PageMetadataKey {
  return TREATMENT_SEO_KEY[slug];
}

export function getStaticPageSeoFallback(key: PageMetadataKey): PageMetadata {
  return pageMetadata[key];
}

export const STATIC_TREATMENT_METADATA_KEYS = Object.values(TREATMENT_SEO_KEY);

export const STATIC_CORE_ROUTE_KEYS: PageMetadataKey[] = [
  "home",
  "about",
  "pregnancyMotherhood",
  "contact",
  "treatments",
];
