import { treatments } from "@/content/treatments/treatments.data";
import type { Treatment, TreatmentSlug } from "@/types/content";

/**
 * Returns a single treatment by slug.
 * Phase 0: static lookup
 * Future: Mongoose findOne({ slug })
 */
export async function getTreatmentBySlug(
  slug: TreatmentSlug,
): Promise<Treatment | undefined> {
  return treatments.find((treatment) => treatment.slug === slug);
}
