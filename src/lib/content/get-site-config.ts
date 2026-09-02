import "server-only";

import { siteConfig } from "@/content/site.config";
import { readContent } from "@/lib/content/internal/read-content";
import { readSiteConfigFromDb } from "@/lib/content/internal/cached-reads";
import type { SiteConfig } from "@/types/content";

export async function getSiteConfig(): Promise<SiteConfig> {
  return readContent({
    getter: "getSiteConfig",
    domain: "site-settings",
    staticRead: () => siteConfig,
    dbRead: readSiteConfigFromDb,
    allowFallbackOnMissing: true,
  });
}
