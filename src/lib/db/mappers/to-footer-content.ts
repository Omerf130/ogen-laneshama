import type { SiteSettingsLeanDocument } from "@/lib/db/repositories/site-settings.repository";
import { parseWithMapperValidation } from "@/lib/db/mappers/errors";
import { normalizeNavItem } from "@/lib/db/mappers/to-main-nav";
import { footerContentSchema } from "@/lib/validation/common";
import type { FooterContent } from "@/types/navigation";

export function mapSiteSettingsToFooterContent(
  doc: SiteSettingsLeanDocument,
): FooterContent {
  const validated = parseWithMapperValidation(
    "SiteSettings",
    "footer",
    footerContentSchema,
    doc.footer,
  );

  return {
    brandSentence: validated.brandSentence,
    navItems: validated.navItems.map(normalizeNavItem),
  };
}
