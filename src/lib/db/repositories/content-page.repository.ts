import { ContentPageModel } from "@/lib/db/models/content-page.model";
import { ensureDbConnection } from "@/lib/db/repositories/shared";
import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";
import type { ContentPageType } from "@/types/db/persistence";
import { CONTENT_PAGE_SLUG_TYPE_MAP } from "@/types/db/persistence";

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

export async function findContentPageForAdmin(
  slug: RepositoryContentPageSlug,
): Promise<ContentPageLeanDocument | null> {
  return findContentPageBySlug(slug);
}

export async function updateContentPageBySlug(input: {
  slug: RepositoryContentPageSlug;
  content: unknown;
  seo?: ContentPageLeanDocument["seo"];
}): Promise<ContentPageLeanDocument> {
  await ensureDbConnection();

  const pageType = CONTENT_PAGE_SLUG_TYPE_MAP[input.slug];

  const doc = await ContentPageModel.findOneAndUpdate(
    { slug: input.slug },
    {
      $set: {
        pageType,
        content: input.content,
        seo: input.seo,
      },
    },
    { new: true, upsert: false, runValidators: true },
  ).lean<ContentPageLeanDocument>();

  if (!doc) {
    throw new Error(`ContentPage not found: ${input.slug}`);
  }

  return doc;
}
