import { Schema, type InferSchemaType } from "mongoose";
import { timestampsOptions } from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const adminSessionSchema = new Schema(
  {
    adminUserId: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  timestampsOptions,
);

adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AdminSessionDocument = InferSchemaType<typeof adminSessionSchema>;

export const AdminSessionModel = registerModel("AdminSession", adminSessionSchema);
