import "server-only";

import { readContentOptional } from "@/lib/content/internal/read-content";
import {
  readStaticTreatmentSeo,
  readTreatmentSeoFromDb,
} from "@/lib/content/internal/cached-reads";
import { getStaticPageSeoFallback } from "@/lib/seo/static-seo-fallbacks";
import { getTreatmentSeoKey } from "@/lib/seo/static-seo-fallbacks";
import type { TreatmentSlug } from "@/types/content";
import type { ResolvedPageSeo } from "@/types/seo";

export async function getTreatmentSeo(
  slug: TreatmentSlug,
): Promise<ResolvedPageSeo | undefined> {
  return readContentOptional({
    getter: "getTreatmentSeo",
    domain: `treatment-seo:${slug}`,
    staticRead: () => readStaticTreatmentSeo(slug),
    dbRead: () => readTreatmentSeoFromDb(slug),
    allowFallbackOnMissing: false,
  });
}

export function getTreatmentSeoPath(slug: TreatmentSlug): string {
  return getStaticPageSeoFallback(getTreatmentSeoKey(slug)).path;
}
