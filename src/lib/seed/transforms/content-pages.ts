import { aboutContent } from "@/content/pages/about.data";
import { contactPageContent } from "@/content/pages/contact.data";
import { pregnancyMotherhoodContent } from "@/content/pages/pregnancy-motherhood.data";
import { treatmentsIndexContent } from "@/content/pages/treatments-index.data";
import { CONTENT_PAGE_SLUG_TYPE_MAP } from "@/types/db/persistence";
import type { ContentPageDocumentInput } from "@/lib/validation/content-page";
import { CONTENT_PAGE_SEO_KEY, seoFromMetadataKey } from "./seo";

export function buildContentPagePayloads(): ContentPageDocumentInput[] {
  const pages = [
    {
      slug: "about" as const,
      content: structuredClone(aboutContent),
    },
    {
      slug: "pregnancy-motherhood" as const,
      content: structuredClone(pregnancyMotherhoodContent),
    },
    {
      slug: "contact" as const,
      content: structuredClone(contactPageContent),
    },
    {
      slug: "treatments" as const,
      content: structuredClone(treatmentsIndexContent),
    },
  ];

  return pages.map(({ slug, content }) => {
    const pageType = CONTENT_PAGE_SLUG_TYPE_MAP[slug];
    const seoKey = CONTENT_PAGE_SEO_KEY[slug];

    return {
      slug,
      pageType,
      content,
      seo: seoFromMetadataKey(seoKey),
    } as ContentPageDocumentInput;
  });
}
