import "server-only";

import { findHomepageForAdmin } from "@/lib/db/repositories/homepage.repository";
import { findSiteSettingsForAdmin } from "@/lib/db/repositories/site-settings.repository";
import { findContentPageForAdmin } from "@/lib/db/repositories/content-page.repository";
import { findAllTreatmentsForAdmin } from "@/lib/db/repositories/treatment.repository";
import { CONTENT_PAGE_SLUGS } from "@/lib/db/repositories/constants";
import type { ContentImage } from "@/types/content";
import type { MediaRef } from "@/types/db/persistence";

export type MediaReferenceLocation = {
  label: string;
};

function idMatches(value: unknown, mediaId: string): boolean {
  if (!value) {
    return false;
  }

  return String(value) === mediaId;
}

function contentImageMatches(image: ContentImage | undefined, mediaId: string, url: string): boolean {
  if (!image) {
    return false;
  }

  if (image.mediaId && idMatches(image.mediaId, mediaId)) {
    return true;
  }

  return Boolean(image.src && url && image.src === url);
}

function mediaRefMatches(ref: MediaRef | undefined | null, mediaId: string, url: string): boolean {
  if (!ref) {
    return false;
  }

  if (ref.mediaId && idMatches(ref.mediaId, mediaId)) {
    return true;
  }

  return Boolean(ref.src && url && ref.src === url);
}

export async function findMediaAssetReferences(input: {
  mediaId: string;
  url: string;
}): Promise<MediaReferenceLocation[]> {
  const locations: MediaReferenceLocation[] = [];
  const { mediaId, url } = input;

  const homepage = await findHomepageForAdmin();
  if (homepage?.assets) {
    const assetLabels: Record<string, string> = {
      hero: "דף הבית — Hero",
      aboutPortrait: "דף הבית — דיוקן",
      pregnancySpotlight: "דף הבית — הריון ואימהות",
      botanicalAccent: "דף הבית — אלמנט דקורטיבי",
    };

    for (const [key, label] of Object.entries(assetLabels)) {
      const ref = homepage.assets[key as keyof typeof homepage.assets];
      if (mediaRefMatches(ref, mediaId, url)) {
        locations.push({ label });
      }
    }

    if (idMatches(homepage.seo?.ogImageMediaId, mediaId)) {
      locations.push({ label: "דף הבית — תמונת SEO" });
    }
  }

  const siteSettings = await findSiteSettingsForAdmin();
  if (siteSettings && idMatches(siteSettings.logoMediaId, mediaId)) {
    locations.push({ label: "הגדרות האתר — לוגו" });
  }
  if (siteSettings && idMatches(siteSettings.defaultSeo?.ogImageMediaId, mediaId)) {
    locations.push({ label: "הגדרות האתר — תמונת SEO" });
  }

  for (const slug of CONTENT_PAGE_SLUGS) {
    const page = await findContentPageForAdmin(slug);
    if (!page) {
      continue;
    }

    if (idMatches(page.seo?.ogImageMediaId, mediaId)) {
      locations.push({ label: `עמוד ${slug} — תמונת SEO` });
    }

    const content = page.content as Record<string, unknown>;
    if (slug === "about" && contentImageMatches(content.portrait as ContentImage, mediaId, url)) {
      locations.push({ label: "אודות — דיוקן" });
    }
    if (
      slug === "pregnancy-motherhood" &&
      contentImageMatches(content.image as ContentImage, mediaId, url)
    ) {
      locations.push({ label: "הריון ואימהות — תמונה" });
    }
  }

  const treatments = await findAllTreatmentsForAdmin();
  for (const treatment of treatments) {
    if (contentImageMatches(treatment.image as ContentImage, mediaId, url)) {
      locations.push({ label: `טיפול — ${treatment.title}` });
    }
    if (idMatches(treatment.seo?.ogImageMediaId, mediaId)) {
      locations.push({ label: `טיפול — ${treatment.title} (SEO)` });
    }
  }

  return locations;
}

export function isLocalProvider(provider: string): boolean {
  return provider === "local";
}
