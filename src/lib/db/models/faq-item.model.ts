import { Schema, type InferSchemaType } from "mongoose";
import { timestampsOptions } from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const faqItemSchema = new Schema(
  {
    id: { type: String, required: true, trim: true, unique: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    sortOrder: { type: Number, required: true, default: 0, min: 0 },
    isPublished: { type: Boolean, required: true, default: true },
  },
  timestampsOptions,
);

faqItemSchema.index({ isPublished: 1, sortOrder: 1 });

export type FaqItemDocument = InferSchemaType<typeof faqItemSchema>;

export const FaqItemModel = registerModel("FaqItem", faqItemSchema);
