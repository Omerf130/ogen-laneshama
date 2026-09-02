export interface PageMetadata {
  path: string;
  title: string;
  description: string;
}

export type PageMetadataKey =
  | "home"
  | "about"
  | "treatments"
  | "treatmentPsychotherapy"
  | "treatmentAromaTouch"
  | "treatmentReiki"
  | "treatmentGuidance"
  | "pregnancyMotherhood"
  | "contact";

/** Resolved SEO values for metadata builders — title/description never empty. */
export interface ResolvedPageSeo {
  title: string;
  description: string;
  ogImageUrl?: string;
}

/** Raw DB SEO override before merge with static fallbacks. */
export interface PageSeoOverride {
  title?: string;
  description?: string;
  ogImageMediaId?: string;
}
