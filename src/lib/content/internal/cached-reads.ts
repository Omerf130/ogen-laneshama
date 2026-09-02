import "server-only";

import { cache } from "react";
import { findSiteSettings } from "@/lib/db/repositories/site-settings.repository";
import { findHomepage } from "@/lib/db/repositories/homepage.repository";
import { findContentPageBySlug } from "@/lib/db/repositories/content-page.repository";
import { findActiveTreatments, findActiveTreatmentBySlug } from "@/lib/db/repositories/treatment.repository";
import { findPublishedFaqItems } from "@/lib/db/repositories/faq-item.repository";
import { findPublishedTestimonials } from "@/lib/db/repositories/testimonial.repository";
import { findMediaAssetsByIds } from "@/lib/db/repositories/media-asset.repository";
import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";
import { mapSiteSettingsToSiteConfig } from "@/lib/db/mappers/to-site-config";
import {
  filterTestimonialsNavItem,
  mapSiteSettingsToMainNav,
} from "@/lib/db/mappers/to-main-nav";
import { mapSiteSettingsToFooterContent } from "@/lib/db/mappers/to-footer-content";
import { mapHomepageToHomepageContent } from "@/lib/db/mappers/to-homepage-content";
import {
  collectHomepageAssetMediaIds,
  mapHomepageToHomepageAssets,
} from "@/lib/db/mappers/to-homepage-assets";
import {
  mapContentPageToAboutContent,
  mapContentPageToContactPageContent,
  mapContentPageToPregnancyMotherhoodContent,
  mapContentPageToTreatmentsIndexContent,
} from "@/lib/db/mappers/to-content-page";
import {
  mapTreatmentDocumentToTreatment,
  mapTreatmentDocumentsToTreatments,
} from "@/lib/db/mappers/to-treatment";
import { mapFaqItemDocumentsToFaqItems } from "@/lib/db/mappers/to-faq-item";
import { mapTestimonialDocumentsToTestimonialSlots } from "@/lib/db/mappers/to-testimonial-slot";
import { buildMediaAssetMap } from "@/lib/db/mappers/media-resolver";
import { requireDocument } from "@/lib/content/internal/read-content";
import type { SiteConfig, Treatment, TreatmentSlug } from "@/types/content";
import type { NavItem, FooterContent } from "@/types/navigation";
import type {
  FaqItem,
  HomepageAssets,
  HomepageContent,
  TestimonialSlot,
} from "@/types/homepage";
import type {
  AboutContent,
  ContactPageContent,
  PregnancyMotherhoodContent,
  TreatmentsIndexContent,
} from "@/types/content";

export const loadSiteSettingsDocument = cache(async () => findSiteSettings());

export const loadHomepageDocument = cache(async () => findHomepage());

export const loadPublishedTestimonialSlotsFromDb = cache(async (): Promise<
  TestimonialSlot[]
> => {
  const docs = await findPublishedTestimonials();
  return mapTestimonialDocumentsToTestimonialSlots(docs);
});

export async function readSiteConfigFromDb(): Promise<SiteConfig> {
  const doc = requireDocument(
    await loadSiteSettingsDocument(),
    "SiteSettings",
    "site",
  );
  return mapSiteSettingsToSiteConfig(doc);
}

export async function readMainNavFromDb(): Promise<NavItem[]> {
  const doc = requireDocument(
    await loadSiteSettingsDocument(),
    "SiteSettings",
    "site",
  );
  const nav = mapSiteSettingsToMainNav(doc);
  const testimonials = await loadPublishedTestimonialSlotsFromDb();
  const hasPublishedTestimonials = testimonials.some((item) => item.quote);

  return filterTestimonialsNavItem(nav, hasPublishedTestimonials);
}

export async function readFooterContentFromDb(): Promise<FooterContent> {
  const doc = requireDocument(
    await loadSiteSettingsDocument(),
    "SiteSettings",
    "site",
  );
  return mapSiteSettingsToFooterContent(doc);
}

export async function readHomepageContentFromDb(): Promise<HomepageContent> {
  const doc = requireDocument(
    await loadHomepageDocument(),
    "Homepage",
    "homepage",
  );
  return mapHomepageToHomepageContent(doc);
}

export async function readHomepageAssetsFromDb(): Promise<HomepageAssets> {
  const doc = requireDocument(
    await loadHomepageDocument(),
    "Homepage",
    "homepage",
  );
  const mediaIds = collectHomepageAssetMediaIds(doc);
  const mediaAssets = await findMediaAssetsByIds(mediaIds);
  const mediaMap = buildMediaAssetMap(mediaAssets);

  return mapHomepageToHomepageAssets(doc, mediaMap);
}

export async function readFaqItemsFromDb(): Promise<FaqItem[]> {
  const docs = await findPublishedFaqItems();
  return mapFaqItemDocumentsToFaqItems(docs);
}

export async function readTestimonialsFromDb(): Promise<TestimonialSlot[]> {
  return loadPublishedTestimonialSlotsFromDb();
}

export async function readTreatmentsFromDb(): Promise<Treatment[]> {
  const docs = await findActiveTreatments();
  return mapTreatmentDocumentsToTreatments(docs);
}

export async function readTreatmentBySlugFromDb(
  slug: TreatmentSlug,
): Promise<Treatment | undefined> {
  const doc = await findActiveTreatmentBySlug(slug);

  if (!doc) {
    return undefined;
  }

  return mapTreatmentDocumentToTreatment(doc);
}

async function readContentPageFromDb<T>(
  slug: RepositoryContentPageSlug,
  mapFn: (doc: NonNullable<Awaited<ReturnType<typeof findContentPageBySlug>>>) => T,
): Promise<T> {
  const doc = requireDocument(
    await findContentPageBySlug(slug),
    "ContentPage",
    slug,
  );
  return mapFn(doc);
}

export async function readAboutContentFromDb(): Promise<AboutContent> {
  return readContentPageFromDb("about", mapContentPageToAboutContent);
}

export async function readPregnancyMotherhoodContentFromDb(): Promise<PregnancyMotherhoodContent> {
  return readContentPageFromDb(
    "pregnancy-motherhood",
    mapContentPageToPregnancyMotherhoodContent,
  );
}

export async function readContactPageContentFromDb(): Promise<ContactPageContent> {
  return readContentPageFromDb("contact", mapContentPageToContactPageContent);
}

export async function readTreatmentsIndexContentFromDb(): Promise<TreatmentsIndexContent> {
  return readContentPageFromDb(
    "treatments",
    mapContentPageToTreatmentsIndexContent,
  );
}
