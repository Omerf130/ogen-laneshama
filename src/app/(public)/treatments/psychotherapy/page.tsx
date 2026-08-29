import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTreatmentBySlug } from "@/lib/content/get-treatment-by-slug";
import { TreatmentDetail } from "@/components/features/treatments/TreatmentDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildFaqPageSchema,
  buildServiceSchema,
} from "@/lib/seo/structured-data";

export const metadata = buildPageMetadata(pageMetadata.treatmentPsychotherapy);

export default async function PsychotherapyPage() {
  const treatment = await getTreatmentBySlug("psychotherapy");

  if (!treatment) {
    notFound();
  }

  const faqSchema = treatment.faq ? buildFaqPageSchema(treatment.faq) : null;
  const schema = faqSchema
    ? [buildServiceSchema(treatment), faqSchema]
    : buildServiceSchema(treatment);

  return (
    <>
      <JsonLd data={schema} />
      <TreatmentDetail treatment={treatment} />
    </>
  );
}
