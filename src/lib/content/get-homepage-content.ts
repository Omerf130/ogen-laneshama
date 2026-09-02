import "server-only";

import { homepageContent } from "@/content/homepage/homepage.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readHomepageContentFromDb } from "@/lib/content/internal/cached-reads";
import type { HomepageContent } from "@/types/homepage";

export async function getHomepageContent(): Promise<HomepageContent> {
  return readContent({
    getter: "getHomepageContent",
    domain: "homepage",
    staticRead: () => homepageContent,
    dbRead: readHomepageContentFromDb,
    allowFallbackOnMissing: true,
  });
}
