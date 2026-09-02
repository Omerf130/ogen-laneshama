import "server-only";

import { readContent } from "@/lib/content/internal/read-content";
import {
  readSiteDefaultSeoFromDb,
  readStaticSiteDefaultSeo,
} from "@/lib/content/internal/cached-reads";
import type { ResolvedPageSeo } from "@/types/seo";

export async function getSiteDefaultSeo(): Promise<ResolvedPageSeo> {
  return readContent({
    getter: "getSiteDefaultSeo",
    domain: "site-default-seo",
    staticRead: readStaticSiteDefaultSeo,
    dbRead: readSiteDefaultSeoFromDb,
    allowFallbackOnMissing: true,
  });
}
