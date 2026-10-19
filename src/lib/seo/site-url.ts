/** Production domain — used when CMS/env still hold launch placeholders. */
export const OFFICIAL_SITE_URL = "https://ogenlaneshima.co.il";

const PLACEHOLDER_SITE_URLS = new Set([
  "https://example.com",
  "http://example.com",
]);

/**
 * Normalizes site URL for metadata, sitemap, robots, and JSON-LD.
 * Preserves a non-placeholder CMS or env URL; replaces known dev placeholders only.
 */
export function resolveSiteUrl(raw: string | undefined | null): string {
  const trimmed = raw?.trim() ?? "";
  const normalized = trimmed.replace(/\/$/, "");

  if (!normalized || PLACEHOLDER_SITE_URLS.has(normalized)) {
    return OFFICIAL_SITE_URL;
  }

  return normalized;
}
