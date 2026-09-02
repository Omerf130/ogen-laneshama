import "server-only";

import {
  buildMediaAssetMap,
  resolveMediaRefToContentImage,
} from "@/lib/db/mappers/media-resolver";
import { findMediaAssetsByIds } from "@/lib/db/repositories/media-asset.repository";
import type { MediaRef } from "@/types/db/persistence";

export async function resolveAdminMediaPreview(
  ref: MediaRef | undefined | null,
  fallbackAlt: string,
): Promise<{ src: string | null; alt: string }> {
  if (!ref) {
    return { src: null, alt: fallbackAlt };
  }

  const mediaId = ref.mediaId ? String(ref.mediaId) : null;

  if (!mediaId) {
    return {
      src: ref.src ?? null,
      alt: ref.alt ?? fallbackAlt,
    };
  }

  const assets = await findMediaAssetsByIds([mediaId]);
  const mediaMap = buildMediaAssetMap(assets);

  return resolveMediaRefToContentImage(ref, mediaMap, fallbackAlt);
}
