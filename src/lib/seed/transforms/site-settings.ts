import { footerContent } from "@/content/navigation/footer.data";
import { mainNavItems } from "@/content/navigation/nav.data";
import { siteConfig } from "@/content/site.config";
import type { SiteSettingsInput } from "@/lib/validation/site-settings";

export function buildSiteSettingsPayload(): SiteSettingsInput {
  return {
    businessName: siteConfig.businessName,
    therapistName: siteConfig.therapistName,
    tagline: siteConfig.tagline,
    siteUrl: siteConfig.siteUrl,
    contact: { ...siteConfig.contact },
    whatsapp: { ...siteConfig.whatsapp },
    socialLinks: [...siteConfig.socialLinks],
    mainNav: mainNavItems.map((item) => ({ ...item })),
    footer: {
      brandSentence: footerContent.brandSentence,
      navItems: footerContent.navItems.map((item) => ({ ...item })),
    },
  };
}
