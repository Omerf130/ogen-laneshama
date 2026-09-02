import "server-only";

import { readContent } from "@/lib/content/internal/read-content";
import {
  readHomepageSeoFromDb,
  readStaticHomepageSeo,
} from "@/lib/content/internal/cached-reads";
import type { ResolvedPageSeo } from "@/types/seo";

export async function getHomepageSeo(): Promise<ResolvedPageSeo> {
  return readContent({
    getter: "getHomepageSeo",
    domain: "homepage-seo",
    staticRead: readStaticHomepageSeo,
    dbRead: readHomepageSeoFromDb,
    allowFallbackOnMissing: true,
  });
}
