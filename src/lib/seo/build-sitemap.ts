import type { MetadataRoute } from "next";
import {
  isFallbackEnabled,
  isStaticContentSource,
} from "@/lib/content/content-source";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { getTreatments } from "@/lib/content/get-treatments";
import { CONTENT_CACHE_TAGS } from "@/lib/content/content-cache-tags";
import { cachedDbRead } from "@/lib/content/internal/db-cache";
import { getSiteUrl } from "@/lib/seo/constants";
import {
  getStaticPageSeoFallback,
  STATIC_CORE_ROUTE_KEYS,
  STATIC_TREATMENT_METADATA_KEYS,
} from "@/lib/seo/static-seo-fallbacks";
import type { PageMetadataKey } from "@/types/seo";

function buildSitemapEntry(
  siteUrl: string,
  path: string,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  };
}

function staticTreatmentPaths(): string[] {
  return STATIC_TREATMENT_METADATA_KEYS.map(
    (key) => getStaticPageSeoFallback(key).path,
  );
}

function coreStaticPaths(): string[] {
  return STATIC_CORE_ROUTE_KEYS.map(
    (key) => getStaticPageSeoFallback(key as PageMetadataKey).path,
  );
}

async function resolveTreatmentPaths(): Promise<string[]> {
  if (isStaticContentSource()) {
    return staticTreatmentPaths();
  }

  try {
    const treatments = await cachedDbRead(
      ["sitemap-treatments"],
      [CONTENT_CACHE_TAGS.sitemap, CONTENT_CACHE_TAGS.treatments],
      () => getTreatments(),
    );

    return treatments.map((treatment) => `/treatments/${treatment.slug}`);
  } catch (error) {
    if (!isFallbackEnabled()) {
      throw error;
    }

    return staticTreatmentPaths();
  }
}

export async function buildPublicSitemap(): Promise<MetadataRoute.Sitemap> {
  const siteConfig = await getSiteConfig();
  const siteUrl = getSiteUrl(siteConfig);
  const paths = [...coreStaticPaths(), ...(await resolveTreatmentPaths())];
  const uniquePaths = [...new Set(paths)];

  return uniquePaths.map((path) => buildSitemapEntry(siteUrl, path));
}

export function isAdminSitemapPath(path: string): boolean {
  return path.startsWith("/admin");
}
