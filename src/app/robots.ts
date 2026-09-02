import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { getSiteUrl } from "@/lib/seo/constants";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await getSiteConfig();
  const siteUrl = getSiteUrl(siteConfig);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
