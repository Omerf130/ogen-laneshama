import "server-only";

import { treatments } from "@/content/treatments/treatments.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readTreatmentsFromDb } from "@/lib/content/internal/cached-reads";
import type { Treatment } from "@/types/content";

export async function getTreatments(): Promise<Treatment[]> {
  return readContent({
    getter: "getTreatments",
    domain: "treatments",
    staticRead: () => treatments,
    dbRead: readTreatmentsFromDb,
    allowFallbackOnMissing: false,
  });
}
