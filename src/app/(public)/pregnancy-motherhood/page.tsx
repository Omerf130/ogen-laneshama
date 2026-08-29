import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPregnancyMotherhoodContent } from "@/lib/content/get-pregnancy-motherhood-content";
import { PregnancyPageContent } from "@/components/features/pregnancy/PregnancyPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebPageSchema } from "@/lib/seo/structured-data";

export const metadata = buildPageMetadata(pageMetadata.pregnancyMotherhood);

export default async function PregnancyMotherhoodPage() {
  const content = await getPregnancyMotherhoodContent();

  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: content.hero.title,
          description: pageMetadata.pregnancyMotherhood.description,
          path: pageMetadata.pregnancyMotherhood.path,
        })}
      />
      <PregnancyPageContent content={content} />
    </>
  );
}
