export type JourneyStage =
  | "hero"
  | "recognition"
  | "about"
  | "treatments"
  | "safety"
  | "testimonials"
  | "faq"
  | "cta";

export interface HomepageHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
}

export interface HomepageWhoIsItFor {
  eyebrow: string;
  titleLines: [string, string];
  items: string[];
}

export interface HomepageRecognition {
  title: string;
  subtitle: string;
  supportingStatements: string[];
  featuredStatement: string;
  featuredAccent?: string;
  whoIsItFor: HomepageWhoIsItFor;
}

export interface HomepageAboutPreview {
  eyebrow: string;
  title: string;
  featuredStatement: string;
  featuredAccent?: string;
  supportingCopy: string;
  whyRacheli: {
    title: string;
    points: string[];
  };
  ctaLabel: string;
}

export interface HomepagePregnancySpotlight {
  eyebrow: string;
  featuredStatement: string;
  excerpt: string;
  disclaimer: string;
  ctaLabel: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface HomepageProcess {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

export interface HomepageTreatmentsPreview {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
}

export interface HomepageFaqSection {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface HomepageTestimonialsSection {
  title: string;
  subtitle: string;
}

export interface HomepageContactCta {
  eyebrow: string;
  featuredStatement: string;
  subtitle: string;
  ctaLabel: string;
}

export interface HomepageContent {
  hero: HomepageHero;
  recognition: HomepageRecognition;
  aboutPreview: HomepageAboutPreview;
  treatmentsPreview: HomepageTreatmentsPreview;
  pregnancySpotlight: HomepagePregnancySpotlight;
  process: HomepageProcess;
  testimonialsSection: HomepageTestimonialsSection;
  faqSection: HomepageFaqSection;
  contactCta: HomepageContactCta;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialSlot {
  id: string;
  quote?: string;
  name?: string;
  context?: string;
}

import type { ContentImageFitMode, ContentImageObjectPosition } from "@/types/content";

export interface HomepageImageAsset {
  src: string | null;
  fitMode?: ContentImageFitMode;
  objectPosition?: ContentImageObjectPosition;
}

export interface HomepageAssets {
  hero: HomepageImageAsset;
  pregnancySpotlight: HomepageImageAsset;
  aboutPortrait: HomepageImageAsset;
  botanicalAccent: HomepageImageAsset;
}

export interface HomepageSectionVisibility {
  faq?: boolean;
  testimonials?: boolean;
}
