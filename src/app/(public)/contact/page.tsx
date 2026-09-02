import type { Metadata } from "next";
import {
  getContentPageSeo,
  getContentPageSeoPath,
} from "@/lib/content/get-content-page-seo";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { getContactPageContent } from "@/lib/content/get-contact-content";
import { ContactPageContent } from "@/components/features/contact/ContactPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildContactPageSchema } from "@/lib/seo/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, siteConfig] = await Promise.all([
    getContentPageSeo("contact"),
    getSiteConfig(),
  ]);

  return buildPageMetadata(seo, {
    siteConfig,
    path: getContentPageSeoPath("contact"),
  });
}

export default async function ContactPage() {
  const [content, siteConfig] = await Promise.all([
    getContactPageContent(),
    getSiteConfig(),
  ]);

  return (
    <>
      <JsonLd data={buildContactPageSchema(siteConfig)} />
      <ContactPageContent content={content} />
    </>
  );
}
