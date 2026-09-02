import "server-only";

import { faqItems } from "@/content/homepage/faq.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readFaqItemsFromDb } from "@/lib/content/internal/cached-reads";
import type { FaqItem } from "@/types/homepage";

export async function getFaqItems(): Promise<FaqItem[]> {
  return readContent({
    getter: "getFaqItems",
    domain: "faq",
    staticRead: () => faqItems,
    dbRead: readFaqItemsFromDb,
    allowFallbackOnMissing: false,
  });
}
