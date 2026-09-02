import type { HomepageLeanDocument } from "@/lib/db/repositories/homepage.repository";
import {
  collectMediaIdsFromRefs,
  resolveMediaRefToPublicSrc,
  type MediaAssetMap,
} from "@/lib/db/mappers/media-resolver";
import type { HomepageAssets } from "@/types/homepage";

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
    hero: resolveMediaRefToPublicSrc(assets?.hero, mediaMap),
    pregnancySpotlight: resolveMediaRefToPublicSrc(
      assets?.pregnancySpotlight,
      mediaMap,
    ),
    aboutPortrait: resolveMediaRefToPublicSrc(assets?.aboutPortrait, mediaMap),
    botanicalAccent: resolveMediaRefToPublicSrc(
      assets?.botanicalAccent,
      mediaMap,
    ),
  };
}
