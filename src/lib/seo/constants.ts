import { siteConfig as staticSiteConfig } from "@/content/site.config";
import type { SiteConfig } from "@/types/content";
import { resolveSiteUrl } from "@/lib/seo/site-url";

export const DEFAULT_OG_LOCALE = "he_IL";

export const DEFAULT_OG_TYPE = "website" as const;

export function getSiteUrl(siteConfig: SiteConfig): string {
  return resolveSiteUrl(siteConfig.siteUrl);
}

/** Legacy static SITE_URL — prefer getSiteUrl(await getSiteConfig()) in server code. */
export const SITE_URL = getSiteUrl(staticSiteConfig);
