import type { FaqItem } from "@/types/homepage";

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "other";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface WhatsAppInfo {
  number: string;
  message: string;
}

export interface SiteConfig {
  businessName: string;
  therapistName: string;
  tagline: string;
  siteUrl: string;
  contact: ContactInfo;
  whatsapp: WhatsAppInfo;
  socialLinks: SocialLink[];
}

export type TreatmentSlug =
  | "psychotherapy"
  | "aroma-touch"
  | "reiki"
  | "guidance";

export type TreatmentLayoutVariant =
  | "standard"
  | "immersive"
  | "process-focused";

export type ContentBlockVariant = "default" | "emphasis" | "aside";

export interface ContentImage {
  src: string | null;
  alt: string;
  mediaId?: string;
}

export interface ContentBlock {
  id: string;
  title?: string;
  body: string | string[];
  variant?: ContentBlockVariant;
}

export interface PageCtaContent {
  label: string;
  href: string;
}

export interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
  };
  introduction: ContentBlock;
  philosophy: ContentBlock;
  approach: ContentBlock;
  methods: ContentBlock & {
    treatmentLinks: { slug: TreatmentSlug; label: string }[];
  };
  safeSpace: ContentBlock;
  cta: PageCtaContent;
  portrait: ContentImage;
}

export interface Treatment {
  slug: TreatmentSlug;
  title: string;
  shortDescription: string;
  emotionalOpening: string;
  whatItIs: ContentBlock;
  whoItSuits: ContentBlock;
  sessionProcess: ContentBlock;
  supportiveGoals: ContentBlock;
  expectations: ContentBlock;
  disclaimer?: string;
  cta: PageCtaContent;
  image: ContentImage;
  faq?: FaqItem[];
  layoutVariant: TreatmentLayoutVariant;
}

export interface TreatmentsIndexContent {
  title: string;
  subtitle: string;
  intro: string;
  cta: PageCtaContent;
}

export interface PregnancyMoment {
  title: string;
  description: string;
}

export interface PregnancyMotherhoodContent {
  hero: {
    title: string;
    subtitle: string;
  };
  recognition: ContentBlock;
  moments: {
    title: string;
    items: PregnancyMoment[];
  };
  howSupportHelps: ContentBlock;
  process: ContentBlock;
  reassurance: ContentBlock;
  disclaimer: string;
  cta: PageCtaContent;
  image: ContentImage;
}

export interface ContactFormContent {
  nameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  devNotice: string;
}

export interface ContactPageContent {
  title: string;
  subtitle: string;
  intro: string;
  contactMethodsHeading: string;
  form: ContactFormContent;
  ctaWhatsApp?: string;
}

export interface PagesAssets {
  aboutPortrait: ContentImage;
  pregnancyImage: ContentImage;
  treatmentImages: Record<TreatmentSlug, ContentImage>;
}
