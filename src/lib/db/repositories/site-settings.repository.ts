import { SiteSettingsModel } from "@/lib/db/models/site-settings.model";
import { SITE_SETTINGS_ID } from "@/lib/db/repositories/constants";
import { ensureDbConnection } from "@/lib/db/repositories/shared";

export interface SiteSettingsLeanDocument {
  _id: string;
  businessName: string;
  therapistName: string;
  tagline: string;
  siteUrl: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  whatsapp: {
    number: string;
    message: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    label: string;
  }>;
  logoMediaId?: unknown;
  mainNav: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  footer: {
    brandSentence: string;
    navItems: Array<{
      label: string;
      href: string;
      external?: boolean;
    }>;
  };
  defaultSeo?: {
    title?: string;
    description?: string;
    ogImageMediaId?: unknown;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export async function findSiteSettings(): Promise<SiteSettingsLeanDocument | null> {
  await ensureDbConnection();

  return SiteSettingsModel.findById(SITE_SETTINGS_ID).lean<SiteSettingsLeanDocument>().exec();
}
