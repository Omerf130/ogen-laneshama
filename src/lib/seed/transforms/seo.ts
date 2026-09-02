import { pageMetadata } from "@/content/pages/page-metadata";
import type { PageMetadataKey } from "@/types/seo";

export {
  CONTENT_PAGE_SEO_KEY,
  TREATMENT_SEO_KEY,
} from "@/lib/seo/static-seo-fallbacks";

export function seoFromMetadataKey(key: PageMetadataKey): {
  title: string;
  description: string;
} {
  const meta = pageMetadata[key];

  return {
    title: meta.title,
    description: meta.description,
  };
}
