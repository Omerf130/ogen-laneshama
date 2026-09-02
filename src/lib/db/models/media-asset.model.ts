import { Schema, type InferSchemaType } from "mongoose";
import { timestampsOptions } from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const mediaAssetSchema = new Schema(
  {
    originalFilename: { type: String, required: true, trim: true },
    filename: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    width: { type: Number, min: 1 },
    height: { type: Number, min: 1 },
    provider: { type: String, required: true, trim: true },
    providerKey: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  timestampsOptions,
);

export type MediaAssetDocument = InferSchemaType<typeof mediaAssetSchema>;

export const MediaAssetModel = registerModel("MediaAsset", mediaAssetSchema);
