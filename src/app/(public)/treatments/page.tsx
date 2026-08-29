import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTreatments } from "@/lib/content/get-treatments";
import { getTreatmentsIndexContent } from "@/lib/content/get-treatments-index-content";
import { TreatmentsIndexContent } from "@/components/features/treatments/TreatmentsIndexContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebPageSchema } from "@/lib/seo/structured-data";

export const metadata = buildPageMetadata(pageMetadata.treatments);

export default async function TreatmentsPage() {
  const [treatments, content] = await Promise.all([
    getTreatments(),
    getTreatmentsIndexContent(),
  ]);

  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: content.title,
          description: pageMetadata.treatments.description,
          path: pageMetadata.treatments.path,
        })}
      />
      <TreatmentsIndexContent content={content} treatments={treatments} />
    </>
  );
}
