import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTreatmentSeo,
  getTreatmentSeoPath,
} from "@/lib/content/get-treatment-seo";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { getTreatmentBySlug } from "@/lib/content/get-treatment-by-slug";
import { TreatmentDetail } from "@/components/features/treatments/TreatmentDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildFaqPageSchema,
  buildServiceSchema,
} from "@/lib/seo/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const slug = "aroma-touch" as const;
  const [treatment, seo, siteConfig] = await Promise.all([
    getTreatmentBySlug(slug),
    getTreatmentSeo(slug),
    getSiteConfig(),
  ]);

  if (!treatment || !seo) {
    return { title: "לא נמצא" };
  }

  return buildPageMetadata(seo, {
    siteConfig,
    path: getTreatmentSeoPath(slug),
  });
}

export default async function AromaTouchPage() {
  const [treatment, siteConfig] = await Promise.all([
    getTreatmentBySlug("aroma-touch"),
    getSiteConfig(),
  ]);

  if (!treatment) {
    notFound();
  }

  const faqSchema = treatment.faq ? buildFaqPageSchema(treatment.faq) : null;
  const schema = faqSchema
    ? [buildServiceSchema(siteConfig, treatment), faqSchema]
    : buildServiceSchema(siteConfig, treatment);

  return (
    <>
      <JsonLd data={schema} />
      <TreatmentDetail treatment={treatment} />
    </>
  );
}
