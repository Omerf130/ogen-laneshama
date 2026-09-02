import { Schema, type InferSchemaType } from "mongoose";
import { timestampsOptions } from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const leadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: ["NEW", "CONTACTED", "IN_PROGRESS", "CLOSED", "ARCHIVED"],
      default: "NEW",
    },
    isRead: { type: Boolean, required: true, default: false },
    internalNotes: { type: String, trim: true },
    sourcePage: { type: String, required: true, trim: true },
    sourceReferrer: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    ipHash: { type: String, trim: true },
    archivedAt: { type: Date, default: null },
  },
  timestampsOptions,
);

leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ isRead: 1, createdAt: -1 });

export type LeadDocument = InferSchemaType<typeof leadSchema>;

export const LeadModel = registerModel("Lead", leadSchema);
