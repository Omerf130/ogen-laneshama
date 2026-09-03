import { Schema } from "mongoose";
import { TREATMENT_SLUG_REGEX } from "@/lib/validation/common";

export const seoFieldsSchema = new Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    ogImageMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
  },
  { _id: false },
);

export const mediaRefSchema = new Schema(
  {
    mediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
    src: { type: String, default: null },
    alt: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const pageCtaSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const contactInfoSchema = new Schema(
  {
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { _id: false },
);

export const whatsAppInfoSchema = new Schema(
  {
    number: { type: String, default: "" },
    message: { type: String, default: "" },
  },
  { _id: false },
);

export const socialLinkSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ["facebook", "instagram", "youtube", "linkedin", "other"],
    },
    url: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const navItemSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    external: { type: Boolean, default: false },
  },
  { _id: false },
);

export const footerContentSchema = new Schema(
  {
    brandSentence: { type: String, required: true, trim: true },
    navItems: { type: [navItemSchema], default: [] },
  },
  { _id: false },
);

export const contentBlockSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    body: { type: Schema.Types.Mixed, required: true },
    variant: {
      type: String,
      enum: ["default", "emphasis", "aside"],
      default: "default",
    },
  },
  { _id: false },
);

export const contentImageSchema = new Schema(
  {
    src: { type: String, default: null },
    alt: { type: String, required: true, trim: true },
    mediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
  },
  { _id: false },
);

export const embeddedFaqItemSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const processStepSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const treatmentSlugValidator = {
  validator: (value: string) => TREATMENT_SLUG_REGEX.test(value),
  message: "Slug must be lowercase URL-safe (letters, numbers, hyphens)",
};

export const exactlyFourProcessStepsValidator = {
  validator: (steps: unknown[]) => Array.isArray(steps) && steps.length === 4,
  message: "Process section requires exactly 4 steps (frontend design constraint)",
};

export const exactlyFourWhoIsItForItemsValidator = {
  validator: (items: unknown[]) => Array.isArray(items) && items.length === 4,
  message:
    "Who Is It For requires exactly 4 items (frontend design constraint)",
};

export const timestampsOptions = {
  timestamps: true,
} as const;
