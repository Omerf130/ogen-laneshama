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

export interface Treatment {
  slug: TreatmentSlug;
  title: string;
  shortDescription: string;
  longDescription: string;
  /** Content guideline reminder — not displayed by default */
  contentNote?: string;
}

export interface PregnancyMotherhoodContent {
  title: string;
  shortDescription: string;
  longDescription: string;
  contentNote: string;
}

export interface AboutContent {
  title: string;
  shortDescription: string;
  longDescription: string;
}

export interface ContactPageContent {
  title: string;
  shortDescription: string;
}
