import { Schema, type InferSchemaType } from "mongoose";
import {
  exactlyFourProcessStepsValidator,
  exactlyFourWhoIsItForItemsValidator,
  mediaRefSchema,
  processStepSchema,
  seoFieldsSchema,
  timestampsOptions,
} from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const homepageContentSchema = new Schema(
  {
    hero: {
      eyebrow: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      ctaPrimary: { type: String, required: true, trim: true },
    },
    recognition: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      supportingStatements: { type: [String], required: true, default: [] },
      featuredStatement: { type: String, required: true, trim: true },
      featuredAccent: { type: String, trim: true },
      whoIsItFor: {
        eyebrow: { type: String, required: true, trim: true },
        titleLines: {
          type: [String],
          required: true,
          validate: {
            validator: (lines: string[]) =>
              Array.isArray(lines) && lines.length === 2,
            message: "titleLines must contain exactly 2 lines",
          },
        },
        items: {
          type: [String],
          required: true,
          validate: exactlyFourWhoIsItForItemsValidator,
        },
      },
    },
    aboutPreview: {
      eyebrow: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      featuredStatement: { type: String, required: true, trim: true },
      featuredAccent: { type: String, trim: true },
      supportingCopy: { type: String, required: true, trim: true },
      whyRacheli: {
        title: { type: String, required: true, trim: true },
        points: { type: [String], required: true, default: [] },
      },
      ctaLabel: { type: String, required: true, trim: true },
    },
    treatmentsPreview: {
      eyebrow: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      ctaLabel: { type: String, required: true, trim: true },
    },
    pregnancySpotlight: {
      eyebrow: { type: String, required: true, trim: true },
      featuredStatement: { type: String, required: true, trim: true },
      excerpt: { type: String, required: true, trim: true },
      disclaimer: { type: String, required: true, trim: true },
      ctaLabel: { type: String, required: true, trim: true },
    },
    process: {
      eyebrow: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      steps: {
        type: [processStepSchema],
        required: true,
        validate: exactlyFourProcessStepsValidator,
      },
    },
    testimonialsSection: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
    },
    faqSection: {
      eyebrow: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
    },
    contactCta: {
      eyebrow: { type: String, required: true, trim: true },
      featuredStatement: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      ctaLabel: { type: String, required: true, trim: true },
    },
  },
  { _id: false },
);

const homepageSchema = new Schema(
  {
    _id: { type: String, default: "homepage", required: true },
    content: { type: homepageContentSchema, required: true },
    assets: {
      hero: { type: mediaRefSchema },
      aboutPortrait: { type: mediaRefSchema },
      pregnancySpotlight: { type: mediaRefSchema },
      botanicalAccent: { type: mediaRefSchema },
    },
    sectionVisibility: {
      faq: { type: Boolean },
      testimonials: { type: Boolean },
    },
    seo: { type: seoFieldsSchema, default: undefined },
  },
  timestampsOptions,
);

export type HomepageDocument = InferSchemaType<typeof homepageSchema>;

export const HomepageModel = registerModel("Homepage", homepageSchema);
