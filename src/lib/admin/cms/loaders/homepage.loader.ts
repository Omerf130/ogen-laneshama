import "server-only";

import { AdminCmsDbError } from "@/lib/admin/cms/errors";
import { findHomepageForAdmin } from "@/lib/db/repositories/homepage.repository";
import { countPublishedFaqItems } from "@/lib/db/repositories/faq-item.repository";
import { countPublishedTestimonials } from "@/lib/db/repositories/testimonial.repository";
import { resolveAdminMediaPreview } from "@/lib/admin/cms/resolve-admin-media-preview";
import type { HomepageDocumentInput } from "@/lib/validation/homepage";

export type AdminHomepageEditorData = {
  document: HomepageDocumentInput;
  assetPreviews: {
    hero: { src: string | null; alt: string };
    aboutPortrait: { src: string | null; alt: string };
    pregnancySpotlight: { src: string | null; alt: string };
    botanicalAccent: { src: string | null; alt: string };
  };
  publishedFaqCount: number;
  publishedTestimonialCount: number;
};

export async function loadHomepageForAdmin(): Promise<AdminHomepageEditorData> {
  const doc = await findHomepageForAdmin();

  if (!doc) {
    throw new AdminCmsDbError();
  }

  const assets = doc.assets ?? {};

  const [hero, aboutPortrait, pregnancySpotlight, botanicalAccent, publishedFaqCount, publishedTestimonialCount] =
    await Promise.all([
      resolveAdminMediaPreview(assets.hero, "תמונת Hero"),
      resolveAdminMediaPreview(assets.aboutPortrait, "דיוקן"),
      resolveAdminMediaPreview(assets.pregnancySpotlight, "הריון ואימהות"),
      resolveAdminMediaPreview(assets.botanicalAccent, "אלמנט דקורטיבי"),
      countPublishedFaqItems(),
      countPublishedTestimonials(),
    ]);

  return {
    document: {
      content: doc.content,
      assets: doc.assets,
      sectionVisibility: doc.sectionVisibility,
      seo: doc.seo,
    },
    assetPreviews: {
      hero,
      aboutPortrait,
      pregnancySpotlight,
      botanicalAccent,
    },
    publishedFaqCount,
    publishedTestimonialCount,
  };
}
