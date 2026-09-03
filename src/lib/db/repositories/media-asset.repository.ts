import { Types } from "mongoose";
import { MediaAssetModel } from "@/lib/db/models/media-asset.model";
import { ensureDbConnection, returnUpdatedDocument } from "@/lib/db/repositories/shared";
import type { MediaAssetDocumentInput } from "@/lib/validation/media";

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

export async function findMediaAssetById(
  id: string,
): Promise<MediaAssetLeanDocument | null> {
  await ensureDbConnection();

  return MediaAssetModel.findById(id).lean<MediaAssetLeanDocument>().exec();
}

export async function findAllMediaAssetsForAdmin(): Promise<MediaAssetLeanDocument[]> {
  await ensureDbConnection();

  return MediaAssetModel.find({}).sort({ createdAt: -1 }).lean<MediaAssetLeanDocument[]>().exec();
}

export async function createMediaAsset(
  input: MediaAssetDocumentInput,
): Promise<MediaAssetLeanDocument> {
  await ensureDbConnection();

  const doc = await MediaAssetModel.create(input);

  return doc.toObject() as MediaAssetLeanDocument;
}

export async function updateMediaAssetAlt(
  id: string,
  alt: string,
): Promise<MediaAssetLeanDocument | null> {
  await ensureDbConnection();

  return MediaAssetModel.findByIdAndUpdate(
    id,
    { $set: { alt } },
    { ...returnUpdatedDocument, runValidators: true },
  )
    .lean<MediaAssetLeanDocument>()
    .exec();
}

export async function deleteMediaAssetById(id: string): Promise<boolean> {
  await ensureDbConnection();

  const result = await MediaAssetModel.deleteOne({ _id: id }).exec();

  return result.deletedCount === 1;
}
