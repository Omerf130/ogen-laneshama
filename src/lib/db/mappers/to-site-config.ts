import type { SiteSettingsLeanDocument } from "@/lib/db/repositories/site-settings.repository";
import { parseWithMapperValidation } from "@/lib/db/mappers/errors";
import { siteSettingsSchema } from "@/lib/validation/site-settings";
import type { SiteConfig } from "@/types/content";

export function mapSiteSettingsToSiteConfig(
  doc: SiteSettingsLeanDocument,
): SiteConfig {
  const validated = parseWithMapperValidation(
    "SiteSettings",
    "site",
    siteSettingsSchema,
    {
      businessName: doc.businessName,
      therapistName: doc.therapistName,
      tagline: doc.tagline,
      siteUrl: doc.siteUrl,
      contact: doc.contact,
      whatsapp: doc.whatsapp,
      socialLinks: doc.socialLinks,
      mainNav: doc.mainNav,
      footer: doc.footer,
      ...(doc.logoMediaId ? { logoMediaId: String(doc.logoMediaId) } : {}),
      ...(doc.defaultSeo ? { defaultSeo: doc.defaultSeo } : {}),
    },
  );

  return {
    businessName: validated.businessName,
    therapistName: validated.therapistName,
    tagline: validated.tagline,
    siteUrl: validated.siteUrl,
    contact: validated.contact,
    whatsapp: validated.whatsapp,
    socialLinks: validated.socialLinks,
  };
}
