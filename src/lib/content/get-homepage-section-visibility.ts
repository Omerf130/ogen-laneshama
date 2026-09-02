import "server-only";

import { readContent } from "@/lib/content/internal/read-content";
import { readHomepageSectionVisibilityFromDb } from "@/lib/content/internal/cached-reads";
import type { HomepageSectionVisibility } from "@/types/homepage";

export async function getHomepageSectionVisibility(): Promise<
  HomepageSectionVisibility | undefined
> {
  return readContent({
    getter: "getHomepageSectionVisibility",
    domain: "homepage",
    staticRead: () => undefined,
    dbRead: readHomepageSectionVisibilityFromDb,
    allowFallbackOnMissing: true,
  });
}
