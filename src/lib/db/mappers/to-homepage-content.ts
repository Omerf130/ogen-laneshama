import type { HomepageLeanDocument } from "@/lib/db/repositories/homepage.repository";
import { parseWithMapperValidation } from "@/lib/db/mappers/errors";
import { homepageContentSchema } from "@/lib/validation/homepage";
import type { HomepageContent } from "@/types/homepage";

export function mapHomepageToHomepageContent(
  doc: HomepageLeanDocument,
): HomepageContent {
  return parseWithMapperValidation(
    "Homepage",
    "content",
    homepageContentSchema,
    doc.content,
  );
}
