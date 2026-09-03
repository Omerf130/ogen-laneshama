import "server-only";

import {
  findMediaAssetReferences,
  isLocalProvider,
} from "@/lib/admin/media/find-media-references";
import {
  findAllMediaAssetsForAdmin,
  type MediaAssetLeanDocument,
} from "@/lib/db/repositories/media-asset.repository";

export type AdminMediaLibraryItem = Omit<
  MediaAssetLeanDocument,
  "_id" | "createdAt" | "updatedAt"
> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  isLocal: boolean;
  referenceLabels: string[];
  canDelete: boolean;
};

async function enrichMediaAssetForAdmin(
  asset: MediaAssetLeanDocument,
): Promise<AdminMediaLibraryItem> {
  const mediaId = String(asset._id);
  const isLocal = isLocalProvider(asset.provider);
  const references = isLocal
    ? []
    : await findMediaAssetReferences({ mediaId, url: asset.url });

  return {
    _id: mediaId,
    originalFilename: asset.originalFilename,
    filename: asset.filename,
    alt: asset.alt,
    mimeType: asset.mimeType,
    width: asset.width,
    height: asset.height,
    provider: asset.provider,
    providerKey: asset.providerKey,
    url: asset.url,
    createdAt: asset.createdAt?.toISOString(),
    updatedAt: asset.updatedAt?.toISOString(),
    isLocal,
    referenceLabels: references.map((ref) => ref.label),
    canDelete: !isLocal && references.length === 0,
  };
}

export async function loadMediaAssetsForAdmin(): Promise<AdminMediaLibraryItem[]> {
  const assets = await findAllMediaAssetsForAdmin();

  return Promise.all(assets.map(enrichMediaAssetForAdmin));
}

export async function loadMediaPickerItemsForAdmin() {
  const assets = await loadMediaAssetsForAdmin();

  return assets.map(({ _id, url, alt, filename, provider }) => ({
    _id,
    url,
    alt,
    filename,
    provider,
  }));
}
