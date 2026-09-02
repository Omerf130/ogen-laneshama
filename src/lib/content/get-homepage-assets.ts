import "server-only";

import { homepageAssets } from "@/content/homepage/homepage.assets";
import { readContent } from "@/lib/content/internal/read-content";
import { readHomepageAssetsFromDb } from "@/lib/content/internal/cached-reads";
import type { HomepageAssets } from "@/types/homepage";

export async function getHomepageAssets(): Promise<HomepageAssets> {
  return readContent({
    getter: "getHomepageAssets",
    domain: "homepage-assets",
    staticRead: () => homepageAssets,
    dbRead: readHomepageAssetsFromDb,
    allowFallbackOnMissing: true,
  });
}
