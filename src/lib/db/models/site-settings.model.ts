import { Schema, type InferSchemaType } from "mongoose";
import {
  contactInfoSchema,
  footerContentSchema,
  navItemSchema,
  seoFieldsSchema,
  socialLinkSchema,
  timestampsOptions,
  whatsAppInfoSchema,
} from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const siteSettingsSchema = new Schema(
  {
    _id: { type: String, default: "site", required: true },
    businessName: { type: String, required: true, trim: true },
    therapistName: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    siteUrl: { type: String, required: true, trim: true },
    contact: { type: contactInfoSchema, required: true, default: () => ({}) },
    whatsapp: { type: whatsAppInfoSchema, required: true, default: () => ({}) },
    socialLinks: { type: [socialLinkSchema], default: [] },
    logoMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
    mainNav: { type: [navItemSchema], default: [] },
    footer: { type: footerContentSchema, required: true },
    defaultSeo: { type: seoFieldsSchema, default: undefined },
  },
  timestampsOptions,
);

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema>;

export const SiteSettingsModel = registerModel(
  "SiteSettings",
  siteSettingsSchema,
);
