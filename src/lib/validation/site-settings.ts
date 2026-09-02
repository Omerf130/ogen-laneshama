import { z } from "zod";
import {
  contactInfoSchema,
  footerContentSchema,
  navItemSchema,
  seoFieldsSchema,
  socialLinkSchema,
  whatsAppInfoSchema,
} from "./common";

export const siteSettingsSchema = z
  .object({
    businessName: z.string().trim().min(1),
    therapistName: z.string().trim().min(1),
    tagline: z.string().trim().min(1),
    siteUrl: z.string().trim().min(1),
    contact: contactInfoSchema,
    whatsapp: whatsAppInfoSchema,
    socialLinks: z.array(socialLinkSchema),
    logoMediaId: z.string().trim().min(1).optional(),
    mainNav: z.array(navItemSchema),
    footer: footerContentSchema,
    defaultSeo: seoFieldsSchema,
  })
  .strict();

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
