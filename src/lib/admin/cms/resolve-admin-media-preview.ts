import "server-only";

import {
  buildMediaAssetMap,
  resolveMediaRefToContentImage,
} from "@/lib/db/mappers/media-resolver";
import { findMediaAssetsByIds } from "@/lib/db/repositories/media-asset.repository";
import type { ContentImageFitMode } from "@/types/content";
import type { MediaRef } from "@/types/db/persistence";

export async function resolveAdminMediaPreview(
  ref: MediaRef | undefined | null,
  fallbackAlt: string,
): Promise<{
  src: string | null;
  alt: string;
  fitMode?: ContentImageFitMode;
  objectPosition?: { x: number; y: number };
}> {
  if (!ref) {
    return { src: null, alt: fallbackAlt };
  }

  const mediaId = ref.mediaId ? String(ref.mediaId) : null;

  if (!mediaId) {
    return {
      src: ref.src ?? null,
      alt: ref.alt ?? fallbackAlt,
      fitMode:
        ref.fitMode === "cover" || ref.fitMode === "contain" ? ref.fitMode : undefined,
      objectPosition: ref.objectPosition
        ? { x: ref.objectPosition.x, y: ref.objectPosition.y }
        : undefined,
    };
  }

  const assets = await findMediaAssetsByIds([mediaId]);
  const mediaMap = buildMediaAssetMap(assets);

  return resolveMediaRefToContentImage(ref, mediaMap, fallbackAlt);
}
