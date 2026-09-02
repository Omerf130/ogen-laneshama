import { Types } from "mongoose";
import { MediaAssetModel } from "@/lib/db/models/media-asset.model";
import { ensureDbConnection } from "@/lib/db/repositories/shared";

export interface MediaAssetLeanDocument {
  _id: Types.ObjectId;
  originalFilename: string;
  filename: string;
  alt: string;
  mimeType: string;
  width?: number;
  height?: number;
  provider: string;
  providerKey: string;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function normalizeIds(ids: string[]): Types.ObjectId[] {
  const unique = [...new Set(ids.filter(Boolean))];

  return unique.map((id) => new Types.ObjectId(id));
}

export async function findMediaAssetsByIds(
  ids: string[],
): Promise<MediaAssetLeanDocument[]> {
  if (ids.length === 0) {
    return [];
  }

  await ensureDbConnection();

  return MediaAssetModel.find({ _id: { $in: normalizeIds(ids) } })
    .lean<MediaAssetLeanDocument[]>()
    .exec();
}

export async function findMediaAssetByProviderKey(
  provider: string,
  providerKey: string,
): Promise<MediaAssetLeanDocument | null> {
  await ensureDbConnection();

  return MediaAssetModel.findOne({ provider, providerKey })
    .lean<MediaAssetLeanDocument>()
    .exec();
}
