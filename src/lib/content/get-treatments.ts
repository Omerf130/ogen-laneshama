import { treatments } from "@/content/treatments/treatments.data";
import type { Treatment } from "@/types/content";

/**
 * Returns all treatments.
 * Phase 0: static import
 * Future: Mongoose query — same return type, no UI changes required
 */
export async function getTreatments(): Promise<Treatment[]> {
  return treatments;
}
