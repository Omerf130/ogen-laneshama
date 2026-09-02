import { pagesAssets } from "@/content/pages/pages.assets";

/**
 * @legacy No current consumers; deprecation candidate — not migrated in 4D.2C.
 * Remains static-only rollback infrastructure.
 */
export async function getPagesAssets() {
  return pagesAssets;
}
