import "server-only";

import { treatments } from "@/content/treatments/treatments.data";
import { readContentOptional } from "@/lib/content/internal/read-content";
import { readTreatmentBySlugFromDb } from "@/lib/content/internal/cached-reads";
import type { Treatment, TreatmentSlug } from "@/types/content";

export async function getTreatmentBySlug(
  slug: TreatmentSlug,
): Promise<Treatment | undefined> {
  return readContentOptional({
    getter: "getTreatmentBySlug",
    domain: `treatment:${slug}`,
    staticRead: () => treatments.find((treatment) => treatment.slug === slug),
    dbRead: () => readTreatmentBySlugFromDb(slug),
    allowFallbackOnMissing: false,
  });
}
