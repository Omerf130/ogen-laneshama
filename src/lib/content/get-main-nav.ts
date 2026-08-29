import { mainNavItems } from "@/content/navigation/nav.data";
import type { NavItem } from "@/types/navigation";

export async function getMainNav(): Promise<NavItem[]> {
  return mainNavItems;
}
