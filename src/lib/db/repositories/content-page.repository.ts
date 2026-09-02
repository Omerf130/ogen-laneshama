import { ContentPageModel } from "@/lib/db/models/content-page.model";
import { ensureDbConnection } from "@/lib/db/repositories/shared";
import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";
import type { ContentPageType } from "@/types/db/persistence";

export interface ContentPageLeanDocument {
  _id: unknown;
  slug: RepositoryContentPageSlug;
  pageType: ContentPageType;
  content: unknown;
  seo?: {
    title?: string;
    description?: string;
    ogImageMediaId?: unknown;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export async function findContentPageBySlug(
  slug: RepositoryContentPageSlug,
): Promise<ContentPageLeanDocument | null> {
  await ensureDbConnection();

  return ContentPageModel.findOne({ slug })
    .lean<ContentPageLeanDocument>()
    .exec();
}
