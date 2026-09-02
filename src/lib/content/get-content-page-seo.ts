import "server-only";

import { readContent } from "@/lib/content/internal/read-content";
import {
  readContentPageSeoFromDb,
  readStaticContentPageSeo,
} from "@/lib/content/internal/cached-reads";
import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";
import {
  getStaticPageSeoFallback,
  getContentPageSeoKey,
} from "@/lib/seo/static-seo-fallbacks";
import type { ResolvedPageSeo } from "@/types/seo";

export async function getContentPageSeo(
  slug: RepositoryContentPageSlug,
): Promise<ResolvedPageSeo> {
  return readContent({
    getter: "getContentPageSeo",
    domain: `content-page-seo:${slug}`,
    staticRead: () => readStaticContentPageSeo(slug),
    dbRead: () => readContentPageSeoFromDb(slug),
    allowFallbackOnMissing: true,
  });
}

export function getContentPageSeoPath(slug: RepositoryContentPageSlug): string {
  return getStaticPageSeoFallback(getContentPageSeoKey(slug)).path;
}
