import type { MetadataRoute } from "next";
import { pageMetadata } from "@/content/pages/page-metadata";
import { SITE_URL } from "@/lib/seo/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Object.values(pageMetadata);

  return routes.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: page.path === "/" ? 1 : 0.8,
  }));
}
