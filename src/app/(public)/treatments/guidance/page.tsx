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
import { buildServiceSchema } from "@/lib/seo/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const slug = "guidance" as const;
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

export default async function GuidancePage() {
  const [treatment, siteConfig] = await Promise.all([
    getTreatmentBySlug("guidance"),
    getSiteConfig(),
  ]);

  if (!treatment) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildServiceSchema(siteConfig, treatment)} />
      <TreatmentDetail treatment={treatment} />
    </>
  );
}
