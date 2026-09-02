import "server-only";

import { aboutContent } from "@/content/pages/about.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readAboutContentFromDb } from "@/lib/content/internal/cached-reads";
import type { AboutContent } from "@/types/content";

export async function getAboutContent(): Promise<AboutContent> {
  return readContent({
    getter: "getAboutContent",
    domain: "content-page:about",
    staticRead: () => aboutContent,
    dbRead: readAboutContentFromDb,
    allowFallbackOnMissing: true,
  });
}
