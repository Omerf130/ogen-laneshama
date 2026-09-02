import { Schema, type InferSchemaType } from "mongoose";
import { timestampsOptions } from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const adminLoginRateLimitSchema = new Schema(
  {
    keyHash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
    },
    windowStart: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  timestampsOptions,
);

adminLoginRateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AdminLoginRateLimitDocument = InferSchemaType<
  typeof adminLoginRateLimitSchema
>;

export const AdminLoginRateLimitModel = registerModel(
  "AdminLoginRateLimit",
  adminLoginRateLimitSchema,
);
