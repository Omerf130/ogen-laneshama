import type { Metadata } from "next";
import {
  getContentPageSeo,
  getContentPageSeoPath,
} from "@/lib/content/get-content-page-seo";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { getTreatments } from "@/lib/content/get-treatments";
import { getTreatmentsIndexContent } from "@/lib/content/get-treatments-index-content";
import { TreatmentsIndexContent } from "@/components/features/treatments/TreatmentsIndexContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, siteConfig] = await Promise.all([
    getContentPageSeo("treatments"),
    getSiteConfig(),
  ]);

  return buildPageMetadata(seo, {
    siteConfig,
    path: getContentPageSeoPath("treatments"),
  });
}

export default async function TreatmentsPage() {
  const [treatments, content, siteConfig, seo] = await Promise.all([
    getTreatments(),
    getTreatmentsIndexContent(),
    getSiteConfig(),
    getContentPageSeo("treatments"),
  ]);

  return (
    <>
      <JsonLd
        data={buildWebPageSchema(siteConfig, {
          name: content.title,
          description: seo.description,
          path: getContentPageSeoPath("treatments"),
        })}
      />
      <TreatmentsIndexContent content={content} treatments={treatments} />
    </>
  );
}
