import "server-only";

import { footerContent } from "@/content/navigation/footer.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readFooterContentFromDb } from "@/lib/content/internal/cached-reads";
import type { FooterContent } from "@/types/navigation";

export async function getFooterContent(): Promise<FooterContent> {
  return readContent({
    getter: "getFooterContent",
    domain: "footer",
    staticRead: () => footerContent,
    dbRead: readFooterContentFromDb,
    allowFallbackOnMissing: true,
  });
}
