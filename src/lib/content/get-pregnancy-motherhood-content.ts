import "server-only";

import { pregnancyMotherhoodContent } from "@/content/pages/pregnancy-motherhood.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readPregnancyMotherhoodContentFromDb } from "@/lib/content/internal/cached-reads";
import type { PregnancyMotherhoodContent } from "@/types/content";

export async function getPregnancyMotherhoodContent(): Promise<PregnancyMotherhoodContent> {
  return readContent({
    getter: "getPregnancyMotherhoodContent",
    domain: "content-page:pregnancy-motherhood",
    staticRead: () => pregnancyMotherhoodContent,
    dbRead: readPregnancyMotherhoodContentFromDb,
    allowFallbackOnMissing: true,
  });
}
