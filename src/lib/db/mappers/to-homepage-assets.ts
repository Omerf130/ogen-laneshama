import type { HomepageLeanDocument } from "@/lib/db/repositories/homepage.repository";
import {
  collectMediaIdsFromRefs,
  resolveMediaRefToPublicSrc,
  type MediaAssetMap,
} from "@/lib/db/mappers/media-resolver";
import type { HomepageAssets, HomepageImageAsset } from "@/types/homepage";
import type { ContentImageFitMode } from "@/types/content";
import type { MediaRef } from "@/types/db/persistence";

function normalizeFitMode(fitMode: MediaRef["fitMode"]): ContentImageFitMode | undefined {
  return fitMode === "cover" || fitMode === "contain" ? fitMode : undefined;
}

function mapMediaRefToHomepageImageAsset(
  ref: MediaRef | undefined | null,
  mediaMap: MediaAssetMap,
): HomepageImageAsset {
  return {
    src: resolveMediaRefToPublicSrc(ref, mediaMap),
    fitMode: normalizeFitMode(ref?.fitMode),
    objectPosition: ref?.objectPosition
      ? { x: ref.objectPosition.x, y: ref.objectPosition.y }
      : undefined,
  };
}

export function collectHomepageAssetMediaIds(
  doc: HomepageLeanDocument,
): string[] {
  const assets = doc.assets;

  if (!assets) {
    return [];
  }

  return collectMediaIdsFromRefs([
    assets.hero,
    assets.pregnancySpotlight,
    assets.aboutPortrait,
    assets.botanicalAccent,
  ]);
}

export function mapHomepageToHomepageAssets(
  doc: HomepageLeanDocument,
  mediaMap: MediaAssetMap,
): HomepageAssets {
  const assets = doc.assets;

  return {
    hero: mapMediaRefToHomepageImageAsset(assets?.hero, mediaMap),
    pregnancySpotlight: mapMediaRefToHomepageImageAsset(
      assets?.pregnancySpotlight,
      mediaMap,
    ),
    aboutPortrait: mapMediaRefToHomepageImageAsset(assets?.aboutPortrait, mediaMap),
    botanicalAccent: mapMediaRefToHomepageImageAsset(
      assets?.botanicalAccent,
      mediaMap,
    ),
  };
}
