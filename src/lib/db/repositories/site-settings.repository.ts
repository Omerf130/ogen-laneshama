import { SiteSettingsModel } from "@/lib/db/models/site-settings.model";
import { SITE_SETTINGS_ID } from "@/lib/db/repositories/constants";
import { ensureDbConnection } from "@/lib/db/repositories/shared";
import type { SiteSettingsInput } from "@/lib/validation/site-settings";

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

export async function findSiteSettingsForAdmin(): Promise<SiteSettingsLeanDocument | null> {
  return findSiteSettings();
}

export async function updateSiteSettings(input: {
  businessName: string;
  therapistName: string;
  tagline: string;
  siteUrl: string;
  contact: SiteSettingsInput["contact"];
  whatsapp: SiteSettingsInput["whatsapp"];
  socialLinks: SiteSettingsInput["socialLinks"];
  footerBrandSentence: string;
  defaultSeo?: SiteSettingsInput["defaultSeo"];
}): Promise<SiteSettingsLeanDocument> {
  await ensureDbConnection();

  const doc = await SiteSettingsModel.findByIdAndUpdate(
    SITE_SETTINGS_ID,
    {
      $set: {
        businessName: input.businessName,
        therapistName: input.therapistName,
        tagline: input.tagline,
        siteUrl: input.siteUrl,
        contact: input.contact,
        whatsapp: input.whatsapp,
        socialLinks: input.socialLinks,
        "footer.brandSentence": input.footerBrandSentence,
        defaultSeo: input.defaultSeo,
      },
    },
    { new: true, upsert: false, runValidators: true },
  ).lean<SiteSettingsLeanDocument>();

  if (!doc) {
    throw new Error("SiteSettings document not found");
  }

  return doc;
}
