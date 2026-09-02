import { Schema, type InferSchemaType } from "mongoose";
import { timestampsOptions } from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const testimonialSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    context: { type: String, trim: true },
    sortOrder: { type: Number, required: true, default: 0, min: 0 },
    isPublished: { type: Boolean, required: true, default: false },
  },
  timestampsOptions,
);

testimonialSchema.index({ isPublished: 1, sortOrder: 1 });

export type TestimonialDocument = InferSchemaType<typeof testimonialSchema>;

export const TestimonialModel = registerModel("Testimonial", testimonialSchema);
