import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTreatmentBySlug } from "@/lib/content/get-treatment-by-slug";
import { TreatmentDetail } from "@/components/features/treatments/TreatmentDetail";

export const metadata = buildPageMetadata(pageMetadata.treatmentGuidance);

export default async function GuidancePage() {
  const treatment = await getTreatmentBySlug("guidance");

  if (!treatment) {
    notFound();
  }

  return <TreatmentDetail treatment={treatment} />;
}
