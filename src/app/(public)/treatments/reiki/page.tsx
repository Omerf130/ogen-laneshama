import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTreatmentBySlug } from "@/lib/content/get-treatment-by-slug";
import { TreatmentDetail } from "@/components/features/treatments/TreatmentDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildServiceSchema } from "@/lib/seo/structured-data";

export const metadata = buildPageMetadata(pageMetadata.treatmentReiki);

export default async function ReikiPage() {
  const treatment = await getTreatmentBySlug("reiki");

  if (!treatment) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildServiceSchema(treatment)} />
      <TreatmentDetail treatment={treatment} />
    </>
  );
}
