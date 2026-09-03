import { Schema, type InferSchemaType } from "mongoose";
import { timestampsOptions } from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const homepageVisitorSchema = new Schema(
  {
    visitorIdHash: { type: String, required: true, trim: true, unique: true },
    firstSeenAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
    visitCount: { type: Number, required: true, default: 1, min: 1 },
  },
  timestampsOptions,
);

homepageVisitorSchema.index({ lastSeenAt: -1 });

export type HomepageVisitorDocument = InferSchemaType<typeof homepageVisitorSchema>;

export const HomepageVisitorModel = registerModel(
  "HomepageVisitor",
  homepageVisitorSchema,
);
