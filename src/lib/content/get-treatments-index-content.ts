import "server-only";

import { treatmentsIndexContent } from "@/content/pages/treatments-index.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readTreatmentsIndexContentFromDb } from "@/lib/content/internal/cached-reads";
import type { TreatmentsIndexContent } from "@/types/content";

export async function getTreatmentsIndexContent(): Promise<TreatmentsIndexContent> {
  return readContent({
    getter: "getTreatmentsIndexContent",
    domain: "content-page:treatments",
    staticRead: () => treatmentsIndexContent,
    dbRead: readTreatmentsIndexContentFromDb,
    allowFallbackOnMissing: true,
  });
}
