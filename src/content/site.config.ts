import type { SiteConfig } from "@/types/content";

export const siteConfig: SiteConfig = {
  businessName: "עוגן לנשמה",
  therapistName: "רחלי נגרין",
  // TODO: Replace with production URL before launch
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
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
