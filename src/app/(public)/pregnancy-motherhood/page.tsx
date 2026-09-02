import type { Metadata } from "next";
import {
  getContentPageSeo,
  getContentPageSeoPath,
} from "@/lib/content/get-content-page-seo";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { getPregnancyMotherhoodContent } from "@/lib/content/get-pregnancy-motherhood-content";
import { PregnancyPageContent } from "@/components/features/pregnancy/PregnancyPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, siteConfig] = await Promise.all([
    getContentPageSeo("pregnancy-motherhood"),
    getSiteConfig(),
  ]);

  return buildPageMetadata(seo, {
    siteConfig,
    path: getContentPageSeoPath("pregnancy-motherhood"),
  });
}

export default async function PregnancyMotherhoodPage() {
  const [content, siteConfig, seo] = await Promise.all([
    getPregnancyMotherhoodContent(),
    getSiteConfig(),
    getContentPageSeo("pregnancy-motherhood"),
  ]);

  return (
    <>
      <JsonLd
        data={buildWebPageSchema(siteConfig, {
          name: content.hero.title,
          description: seo.description,
          path: getContentPageSeoPath("pregnancy-motherhood"),
        })}
      />
      <PregnancyPageContent content={content} />
    </>
  );
}
