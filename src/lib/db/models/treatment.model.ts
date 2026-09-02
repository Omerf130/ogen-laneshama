import { Schema, type InferSchemaType } from "mongoose";
import {
  contentBlockSchema,
  contentImageSchema,
  embeddedFaqItemSchema,
  pageCtaSchema,
  seoFieldsSchema,
  timestampsOptions,
  treatmentSlugValidator,
} from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const treatmentSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: treatmentSlugValidator,
    },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    emotionalOpening: { type: String, required: true, trim: true },
    whatItIs: { type: contentBlockSchema, required: true },
    whoItSuits: { type: contentBlockSchema, required: true },
    sessionProcess: { type: contentBlockSchema, required: true },
    supportiveGoals: { type: contentBlockSchema, required: true },
    expectations: { type: contentBlockSchema, required: true },
    disclaimer: { type: String, trim: true },
    cta: { type: pageCtaSchema, required: true },
    image: { type: contentImageSchema, required: true },
    faq: { type: [embeddedFaqItemSchema], default: undefined },
    layoutVariant: {
      type: String,
      required: true,
      enum: ["standard", "immersive", "process-focused"],
    },
    isActive: { type: Boolean, required: true, default: true },
    sortOrder: { type: Number, required: true, default: 0, min: 0 },
    seo: { type: seoFieldsSchema, default: undefined },
  },
  timestampsOptions,
);

treatmentSchema.index({ isActive: 1, sortOrder: 1 });

export type TreatmentDocument = InferSchemaType<typeof treatmentSchema>;

export const TreatmentModel = registerModel("Treatment", treatmentSchema);
