import "server-only";

import { AdminCmsDbError } from "@/lib/admin/cms/errors";
import { findContentPageForAdmin } from "@/lib/db/repositories/content-page.repository";
import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";
import type { ContentImage } from "@/types/content";

export async function loadContentPageForAdmin(slug: RepositoryContentPageSlug) {
  const doc = await findContentPageForAdmin(slug);

  if (!doc) {
    throw new AdminCmsDbError();
  }

  const content = doc.content as Record<string, unknown>;
  let imagePreview: { src: string | null; alt: string } | null = null;

  if (slug === "about" && content.portrait) {
    const portrait = content.portrait as ContentImage;
    imagePreview = {
      src: portrait.src,
      alt: portrait.alt,
    };
  }

  if (slug === "pregnancy-motherhood" && content.image) {
    const image = content.image as ContentImage;
    imagePreview = {
      src: image.src,
      alt: image.alt,
    };
  }

  return {
    slug: doc.slug,
    pageType: doc.pageType,
    content: doc.content,
    seo: doc.seo,
    imagePreview,
  };
}
