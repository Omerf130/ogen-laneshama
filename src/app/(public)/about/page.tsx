import type { Metadata } from "next";
import {
  getContentPageSeo,
  getContentPageSeoPath,
} from "@/lib/content/get-content-page-seo";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { getAboutContent } from "@/lib/content/get-about-content";
import { AboutPageContent } from "@/components/features/about/AboutPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildPersonSchema } from "@/lib/seo/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, siteConfig] = await Promise.all([
    getContentPageSeo("about"),
    getSiteConfig(),
  ]);

  return buildPageMetadata(seo, {
    siteConfig,
    path: getContentPageSeoPath("about"),
  });
}

export default async function AboutPage() {
  const [content, siteConfig] = await Promise.all([
    getAboutContent(),
    getSiteConfig(),
  ]);

  return (
    <>
      <JsonLd data={buildPersonSchema(siteConfig)} />
      <AboutPageContent content={content} />
    </>
  );
}
