import "server-only";

import { mainNavItems } from "@/content/navigation/nav.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readMainNavFromDb } from "@/lib/content/internal/cached-reads";
import type { NavItem } from "@/types/navigation";

export async function getMainNav(): Promise<NavItem[]> {
  return readContent({
    getter: "getMainNav",
    domain: "main-navigation",
    staticRead: () => mainNavItems,
    dbRead: readMainNavFromDb,
    allowFallbackOnMissing: true,
  });
}
