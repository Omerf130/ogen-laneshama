import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAboutContent } from "@/lib/content/get-about-content";
import { AboutPageContent } from "@/components/features/about/AboutPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPersonSchema } from "@/lib/seo/structured-data";

export const metadata = buildPageMetadata(pageMetadata.about);

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <>
      <JsonLd data={buildPersonSchema()} />
      <AboutPageContent content={content} />
    </>
  );
}
