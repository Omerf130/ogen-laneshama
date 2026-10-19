import type { SiteConfig } from "@/types/content";
import { OFFICIAL_SITE_URL, resolveSiteUrl } from "@/lib/seo/site-url";

export const siteConfig: SiteConfig = {
  businessName: "עוגן לנשימה",
  therapistName: "רחלי נגרין",
  tagline: "מרחב בטוח לליווי רגשי ורוחני לנשים",
  siteUrl: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? OFFICIAL_SITE_URL),
  contact: {
    // TODO: Add real contact details
    phone: "",
    email: "",
    address: "",
  },
  whatsapp: {
    // TODO: Add WhatsApp number and default message
    number: "",
    message: "",
  },
  socialLinks: [],
};
