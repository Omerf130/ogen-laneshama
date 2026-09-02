import "server-only";

import { cache } from "react";
import { pageMetadata } from "@/content/pages/page-metadata";
import { siteConfig as staticSiteConfig } from "@/content/site.config";
import {
  CONTENT_CACHE_TAGS,
  contentPageSeoTag,
  contentPageTag,
  treatmentSeoTag,
} from "@/lib/content/content-cache-tags";
import { cachedDbRead } from "@/lib/content/internal/db-cache";
import { findSiteSettings } from "@/lib/db/repositories/site-settings.repository";
import { findHomepage } from "@/lib/db/repositories/homepage.repository";
import { findContentPageBySlug } from "@/lib/db/repositories/content-page.repository";
import {
  findActiveTreatments,
  findActiveTreatmentBySlug,
} from "@/lib/db/repositories/treatment.repository";
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
import {
  getStaticPageSeoFallback,
  getContentPageSeoKey,
  getTreatmentSeoKey,
} from "@/lib/seo/static-seo-fallbacks";
import {
  extractPageSeoOverride,
  resolvePageSeo,
  resolveRootSeo,
} from "@/lib/seo/resolve-page-seo";
import type { SiteConfig, Treatment, TreatmentSlug } from "@/types/content";
import type { NavItem, FooterContent } from "@/types/navigation";
import type {
  FaqItem,
  HomepageAssets,
  HomepageContent,
  HomepageSectionVisibility,
  TestimonialSlot,
} from "@/types/homepage";
import type {
  AboutContent,
  ContactPageContent,
  PregnancyMotherhoodContent,
  TreatmentsIndexContent,
} from "@/types/content";
import type { ResolvedPageSeo } from "@/types/seo";
import type { SeoFields } from "@/types/db/persistence";

export const loadSiteSettingsDocument = cache(async () =>
  cachedDbRead(
    ["site-settings-doc"],
    [CONTENT_CACHE_TAGS.siteSettings],
    () => findSiteSettings(),
  ),
);

export const loadHomepageDocument = cache(async () =>
  cachedDbRead(["homepage-doc"], [CONTENT_CACHE_TAGS.homepage], () =>
    findHomepage(),
  ),
);

export const loadPublishedTestimonialSlotsFromDb = cache(async (): Promise<
  TestimonialSlot[]
> => {
  const docs = await cachedDbRead(
    ["published-testimonials"],
    [CONTENT_CACHE_TAGS.testimonials],
    () => findPublishedTestimonials(),
  );
  return mapTestimonialDocumentsToTestimonialSlots(docs);
});

async function resolveSeoWithMedia(
  seo: SeoFields | undefined | null,
  staticKey: Parameters<typeof getStaticPageSeoFallback>[0],
  siteConfig: SiteConfig,
): Promise<ResolvedPageSeo> {
  const override = extractPageSeoOverride(seo);
  const ogImageMediaId = override?.ogImageMediaId;
  const mediaAssets = ogImageMediaId
    ? await findMediaAssetsByIds([ogImageMediaId])
    : [];
  const mediaMap = buildMediaAssetMap(mediaAssets);

  return resolvePageSeo({
    dbOverride: override,
    staticFallback: getStaticPageSeoFallback(staticKey),
    siteConfig,
    mediaMap,
  });
}

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

export async function readHomepageSectionVisibilityFromDb(): Promise<
  HomepageSectionVisibility | undefined
> {
  const doc = requireDocument(
    await loadHomepageDocument(),
    "Homepage",
    "homepage",
  );

  return doc.sectionVisibility ?? undefined;
}

export async function readHomepageAssetsFromDb(): Promise<HomepageAssets> {
  const doc = requireDocument(
    await loadHomepageDocument(),
    "Homepage",
    "homepage",
  );
  const mediaIds = collectHomepageAssetMediaIds(doc);
  const mediaAssets = await cachedDbRead(
    ["homepage-asset-media", ...mediaIds.sort()],
    [CONTENT_CACHE_TAGS.homepageAssets],
    () => findMediaAssetsByIds(mediaIds),
  );
  const mediaMap = buildMediaAssetMap(mediaAssets);

  return mapHomepageToHomepageAssets(doc, mediaMap);
}

export async function readHomepageSeoFromDb(): Promise<ResolvedPageSeo> {
  const doc = requireDocument(
    await loadHomepageDocument(),
    "Homepage",
    "homepage",
  );
  const siteConfig = await readSiteConfigFromDb();

  return cachedDbRead(
    ["homepage-seo"],
    [CONTENT_CACHE_TAGS.homepageSeo],
    () => resolveSeoWithMedia(doc.seo as SeoFields | undefined, "home", siteConfig),
  );
}

export async function readSiteDefaultSeoFromDb(): Promise<ResolvedPageSeo> {
  const doc = requireDocument(
    await loadSiteSettingsDocument(),
    "SiteSettings",
    "site",
  );
  const siteConfig = mapSiteSettingsToSiteConfig(doc);
  const override = extractPageSeoOverride(doc.defaultSeo as SeoFields | undefined);
  const ogImageMediaId = override?.ogImageMediaId;
  const mediaAssets = ogImageMediaId
    ? await findMediaAssetsByIds([ogImageMediaId])
    : [];
  const mediaMap = buildMediaAssetMap(mediaAssets);

  return resolveRootSeo({
    siteConfig,
    dbDefaultOverride: override,
    mediaMap,
  });
}

export async function readContentPageSeoFromDb(
  slug: RepositoryContentPageSlug,
): Promise<ResolvedPageSeo> {
  const doc = requireDocument(
    await cachedDbRead(
      ["content-page-doc", slug],
      [contentPageSeoTag(slug)],
      () => findContentPageBySlug(slug),
    ),
    "ContentPage",
    slug,
  );
  const siteConfig = await readSiteConfigFromDb();
  const staticKey = getContentPageSeoKey(slug);

  return resolveSeoWithMedia(doc.seo as SeoFields | undefined, staticKey, siteConfig);
}

export async function readTreatmentSeoFromDb(
  slug: TreatmentSlug,
): Promise<ResolvedPageSeo | undefined> {
  const doc = await cachedDbRead(
    ["treatment-doc", slug],
    [treatmentSeoTag(slug)],
    () => findActiveTreatmentBySlug(slug),
  );

  if (!doc) {
    return undefined;
  }

  const siteConfig = await readSiteConfigFromDb();
  const staticKey = getTreatmentSeoKey(slug);

  return resolveSeoWithMedia(doc.seo as SeoFields | undefined, staticKey, siteConfig);
}

export async function readFaqItemsFromDb(): Promise<FaqItem[]> {
  const docs = await cachedDbRead(
    ["published-faq"],
    [CONTENT_CACHE_TAGS.faq],
    () => findPublishedFaqItems(),
  );
  return mapFaqItemDocumentsToFaqItems(docs);
}

export async function readTestimonialsFromDb(): Promise<TestimonialSlot[]> {
  return loadPublishedTestimonialSlotsFromDb();
}

export async function readTreatmentsFromDb(): Promise<Treatment[]> {
  const docs = await cachedDbRead(
    ["active-treatments"],
    [CONTENT_CACHE_TAGS.treatments],
    () => findActiveTreatments(),
  );
  return mapTreatmentDocumentsToTreatments(docs);
}

export async function readTreatmentBySlugFromDb(
  slug: TreatmentSlug,
): Promise<Treatment | undefined> {
  const doc = await cachedDbRead(
    ["treatment-doc", slug],
    [CONTENT_CACHE_TAGS.treatments, `treatment:${slug}`],
    () => findActiveTreatmentBySlug(slug),
  );

  if (!doc) {
    return undefined;
  }

  return mapTreatmentDocumentToTreatment(doc);
}

async function readContentPageFromDb<T>(
  slug: RepositoryContentPageSlug,
  mapFn: (
    doc: NonNullable<Awaited<ReturnType<typeof findContentPageBySlug>>>,
  ) => T,
): Promise<T> {
  const doc = requireDocument(
    await cachedDbRead(
      ["content-page-doc", slug],
      [contentPageTag(slug)],
      () => findContentPageBySlug(slug),
    ),
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

export function readStaticHomepageSeo(): ResolvedPageSeo {
  return resolvePageSeo({
    staticFallback: pageMetadata.home,
    siteConfig: staticSiteConfig,
  });
}

export function readStaticSiteDefaultSeo(): ResolvedPageSeo {
  return resolveRootSeo({ siteConfig: staticSiteConfig });
}

export function readStaticContentPageSeo(
  slug: RepositoryContentPageSlug,
): ResolvedPageSeo {
  return resolvePageSeo({
    staticFallback: getStaticPageSeoFallback(getContentPageSeoKey(slug)),
    siteConfig: staticSiteConfig,
  });
}

export function readStaticTreatmentSeo(slug: TreatmentSlug): ResolvedPageSeo {
  return resolvePageSeo({
    staticFallback: getStaticPageSeoFallback(getTreatmentSeoKey(slug)),
    siteConfig: staticSiteConfig,
  });
}
