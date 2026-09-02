import type { MetadataRoute } from "next";
import { buildPublicSitemap } from "@/lib/seo/build-sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildPublicSitemap();
}
