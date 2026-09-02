import "server-only";

import { contactPageContent } from "@/content/pages/contact.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readContactPageContentFromDb } from "@/lib/content/internal/cached-reads";
import type { ContactPageContent } from "@/types/content";

export async function getContactPageContent(): Promise<ContactPageContent> {
  return readContent({
    getter: "getContactPageContent",
    domain: "content-page:contact",
    staticRead: () => contactPageContent,
    dbRead: readContactPageContentFromDb,
    allowFallbackOnMissing: true,
  });
}
