import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getContactPageContent } from "@/lib/content/get-contact-content";
import { ContactPageContent } from "@/components/features/contact/ContactPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildContactPageSchema } from "@/lib/seo/structured-data";

export const metadata = buildPageMetadata(pageMetadata.contact);

export default async function ContactPage() {
  const content = await getContactPageContent();

  return (
    <>
      <JsonLd data={buildContactPageSchema()} />
      <ContactPageContent content={content} />
    </>
  );
}
