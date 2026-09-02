import type { SiteConfig } from "@/types/content";
import type { SeoFields } from "@/types/db/persistence";
import type { PageMetadata, PageSeoOverride, ResolvedPageSeo } from "@/types/seo";
import type { MediaAssetMap } from "@/lib/db/mappers/media-resolver";
import { getSiteUrl } from "@/lib/seo/constants";

function nonEmpty(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

export function extractPageSeoOverride(
  seo: SeoFields | undefined | null,
): PageSeoOverride | undefined {
  if (!seo) {
    return undefined;
  }

  const override: PageSeoOverride = {};

  if (nonEmpty(seo.title)) {
    override.title = seo.title!.trim();
  }

  if (nonEmpty(seo.description)) {
    override.description = seo.description!.trim();
  }

  if (seo.ogImageMediaId) {
    override.ogImageMediaId = String(seo.ogImageMediaId);
  }

  return Object.keys(override).length > 0 ? override : undefined;
}

export function resolveOgImageUrl(
  ogImageMediaId: string | undefined,
  mediaMap: MediaAssetMap,
  siteConfig: SiteConfig,
): string | undefined {
  if (!ogImageMediaId) {
    return undefined;
  }

  const asset = mediaMap.get(ogImageMediaId);

  if (!asset?.url) {
    return undefined;
  }

  const url = asset.url.trim();

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const siteUrl = getSiteUrl(siteConfig).replace(/\/$/, "");
  return url.startsWith("/") ? `${siteUrl}${url}` : `${siteUrl}/${url}`;
}

export function resolvePageSeo(options: {
  dbOverride?: PageSeoOverride;
  staticFallback: PageMetadata;
  siteConfig: SiteConfig;
  mediaMap?: MediaAssetMap;
}): ResolvedPageSeo {
  const { dbOverride, staticFallback, siteConfig, mediaMap } = options;

  const title =
    nonEmpty(dbOverride?.title) ??
    nonEmpty(staticFallback.title) ??
    siteConfig.businessName;

  const description =
    nonEmpty(dbOverride?.description) ??
    nonEmpty(staticFallback.description) ??
    `${siteConfig.tagline} — ${siteConfig.therapistName}`;

  const ogImageUrl =
    mediaMap && dbOverride?.ogImageMediaId
      ? resolveOgImageUrl(dbOverride.ogImageMediaId, mediaMap, siteConfig)
      : undefined;

  return {
    title,
    description,
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
}

export function resolveRootSeo(options: {
  siteConfig: SiteConfig;
  dbDefaultOverride?: PageSeoOverride;
  mediaMap?: MediaAssetMap;
}): ResolvedPageSeo {
  return resolvePageSeo({
    dbOverride: options.dbDefaultOverride,
    staticFallback: {
      path: "/",
      title: options.siteConfig.businessName,
      description: `ליווי רגשי ורוחני לנשים — ${options.siteConfig.therapistName}`,
    },
    siteConfig: options.siteConfig,
    mediaMap: options.mediaMap,
  });
}
