import type { MediaAssetLeanDocument } from "@/lib/db/repositories/media-asset.repository";
import type { ContentImageFitMode, ContentImageObjectPosition } from "@/types/content";
import type { MediaRef } from "@/types/db/persistence";

export type MediaAssetMap = Map<string, MediaAssetLeanDocument>;

export function buildMediaAssetMap(
  assets: MediaAssetLeanDocument[],
): MediaAssetMap {
  const map: MediaAssetMap = new Map();

  for (const asset of assets) {
    map.set(String(asset._id), asset);
  }

  return map;
}

export function collectMediaIdsFromRefs(
  refs: Array<MediaRef | undefined | null>,
): string[] {
  const ids: string[] = [];

  for (const ref of refs) {
    if (!ref?.mediaId) {
      continue;
    }

    ids.push(String(ref.mediaId));
  }

  return ids;
}

export function resolveMediaRefToPublicSrc(
  ref: MediaRef | undefined | null,
  mediaMap: MediaAssetMap,
): string | null {
  if (!ref) {
    return null;
  }

  if (ref.mediaId) {
    const asset = mediaMap.get(String(ref.mediaId));

    if (asset?.url) {
      return asset.url;
    }
  }

  if (ref.src) {
    return ref.src;
  }

  return null;
}

export function resolveMediaRefToContentImage(
  ref: MediaRef | undefined | null,
  mediaMap: MediaAssetMap,
  fallbackAlt: string,
): {
  src: string | null;
  alt: string;
  fitMode?: ContentImageFitMode;
  objectPosition?: ContentImageObjectPosition;
} {
  return {
    src: resolveMediaRefToPublicSrc(ref, mediaMap),
    alt: ref?.alt ?? fallbackAlt,
    fitMode:
      ref?.fitMode === "contain" || ref?.fitMode === "cover"
        ? ref.fitMode
        : undefined,
    objectPosition: ref?.objectPosition
      ? { x: ref.objectPosition.x, y: ref.objectPosition.y }
      : undefined,
  };
}
