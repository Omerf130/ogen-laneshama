import { Schema, type InferSchemaType } from "mongoose";
import { timestampsOptions } from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const adminUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, trim: true },
    isActive: { type: Boolean, required: true, default: true },
    lastLoginAt: { type: Date },
  },
  timestampsOptions,
);

export type AdminUserDocument = InferSchemaType<typeof adminUserSchema>;

export const AdminUserModel = registerModel("AdminUser", adminUserSchema);
