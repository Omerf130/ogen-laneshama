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
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface HomepageRecognition {
  title: string;
  subtitle: string;
  statements: string[];
  whoIsItFor: {
    title: string;
    items: string[];
  };
}

export interface HomepageAboutPreview {
  title: string;
  subtitle: string;
  excerpt: string;
  whyRacheli: {
    title: string;
    points: string[];
  };
  ctaLabel: string;
}

export interface HomepagePregnancySpotlight {
  title: string;
  excerpt: string;
  disclaimer: string;
  ctaLabel: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface HomepageSafety {
  process: {
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
}

export interface HomepageContactCta {
  title: string;
  subtitle: string;
  ctaLabel: string;
}

export interface HomepageContent {
  hero: HomepageHero;
  recognition: HomepageRecognition;
  aboutPreview: HomepageAboutPreview;
  pregnancySpotlight: HomepagePregnancySpotlight;
  safety: HomepageSafety;
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

export interface HomepageAssets {
  aboutPortrait: string | null;
  botanicalAccent: string | null;
}
