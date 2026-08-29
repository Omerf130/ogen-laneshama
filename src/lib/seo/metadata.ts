import type { Metadata } from "next";
import { siteConfig } from "@/content/site.config";
import {
  DEFAULT_OG_LOCALE,
  DEFAULT_OG_TYPE,
  SITE_URL,
} from "@/lib/seo/constants";
import type { PageMetadata } from "@/types/seo";

export function buildPageMetadata(page: PageMetadata): Metadata {
  const title = `${page.title} | ${siteConfig.businessName}`;
  const url = `${SITE_URL}${page.path}`;

  return {
    title,
    description: page.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: page.description,
      url,
      locale: DEFAULT_OG_LOCALE,
      type: DEFAULT_OG_TYPE,
      siteName: siteConfig.businessName,
    },
  };
}

export function buildRootMetadata(): Metadata {
  const home = {
    path: "/",
    title: siteConfig.businessName,
    description: `ליווי רגשי ורוחני לנשים — ${siteConfig.therapistName}`,
  };

  return {
    ...buildPageMetadata(home),
    metadataBase: new URL(SITE_URL),
  };
}
