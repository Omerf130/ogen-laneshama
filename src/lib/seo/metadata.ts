import type { Metadata } from "next";
import type { SiteConfig } from "@/types/content";
import type { ResolvedPageSeo } from "@/types/seo";
import {
  DEFAULT_OG_LOCALE,
  DEFAULT_OG_TYPE,
  getSiteUrl,
} from "@/lib/seo/constants";

export function buildPageMetadata(
  resolved: ResolvedPageSeo,
  ctx: { siteConfig: SiteConfig; path: string },
): Metadata {
  const title = `${resolved.title} | ${ctx.siteConfig.businessName}`;
  const url = `${getSiteUrl(ctx.siteConfig)}${ctx.path}`;

  return {
    title,
    description: resolved.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: resolved.description,
      url,
      locale: DEFAULT_OG_LOCALE,
      type: DEFAULT_OG_TYPE,
      siteName: ctx.siteConfig.businessName,
      ...(resolved.ogImageUrl
        ? { images: [{ url: resolved.ogImageUrl }] }
        : {}),
    },
  };
}

export function buildRootMetadata(
  siteConfig: SiteConfig,
  resolved: ResolvedPageSeo,
): Metadata {
  const metadata = buildPageMetadata(resolved, {
    siteConfig,
    path: "/",
  });

  return {
    ...metadata,
    title: resolved.title,
    metadataBase: new URL(getSiteUrl(siteConfig)),
  };
}
