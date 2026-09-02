import type { SiteSettingsLeanDocument } from "@/lib/db/repositories/site-settings.repository";
import { parseWithMapperValidation } from "@/lib/db/mappers/errors";
import { navItemSchema } from "@/lib/validation/common";
import { z } from "zod";
import type { NavItem } from "@/types/navigation";

const mainNavSchema = z.array(navItemSchema);

export function normalizeNavItem(item: z.infer<typeof navItemSchema>): NavItem {
  const normalized: NavItem = {
    label: item.label,
    href: item.href,
  };

  if (item.external) {
    normalized.external = true;
  }

  return normalized;
}

export function mapSiteSettingsToMainNav(
  doc: SiteSettingsLeanDocument,
): NavItem[] {
  const validated = parseWithMapperValidation(
    "SiteSettings",
    "mainNav",
    mainNavSchema,
    doc.mainNav,
  );

  return validated.map(normalizeNavItem);
}

export const TESTIMONIALS_NAV_HREF = "/#testimonials";

export function filterTestimonialsNavItem(
  navItems: NavItem[],
  hasPublishedTestimonials: boolean,
): NavItem[] {
  if (hasPublishedTestimonials) {
    return navItems;
  }

  return navItems.filter((item) => item.href !== TESTIMONIALS_NAV_HREF);
}
