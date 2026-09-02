import { pageMetadata } from "@/content/pages/page-metadata";
import type { PageMetadataKey } from "@/types/seo";

export function seoFromMetadataKey(key: PageMetadataKey): {
  title: string;
  description: string;
} {
  const meta = pageMetadata[key];

  return {
    title: meta.title,
    description: meta.description,
  };
}

export const CONTENT_PAGE_SEO_KEY = {
  about: "about",
  "pregnancy-motherhood": "pregnancyMotherhood",
  contact: "contact",
  treatments: "treatments",
} as const satisfies Record<string, PageMetadataKey>;

export const TREATMENT_SEO_KEY = {
  psychotherapy: "treatmentPsychotherapy",
  "aroma-touch": "treatmentAromaTouch",
  reiki: "treatmentReiki",
  guidance: "treatmentGuidance",
} as const satisfies Record<string, PageMetadataKey>;
