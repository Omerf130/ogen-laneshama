import { siteConfig } from "@/content/site.config";
import type { SiteConfig } from "@/types/content";

/**
 * Returns site-wide configuration.
 * Phase 0: static import from site.config.ts
 * Future: fetch from MongoDB / admin-managed settings
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  return siteConfig;
}
