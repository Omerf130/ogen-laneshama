import { isDeepStrictEqual } from "node:util";
import { loadEnvLocal } from "./lib/load-env-local";
import { aboutContent } from "../src/content/pages/about.data";
import { contactPageContent } from "../src/content/pages/contact.data";
import { pregnancyMotherhoodContent } from "../src/content/pages/pregnancy-motherhood.data";
import { treatmentsIndexContent } from "../src/content/pages/treatments-index.data";
import { homepageContent } from "../src/content/homepage/homepage.data";
import { homepageAssets } from "../src/content/homepage/homepage.assets";
import { faqItems } from "../src/content/homepage/faq.data";
import { testimonials } from "../src/content/homepage/testimonials.data";
import { treatments } from "../src/content/treatments/treatments.data";
import { siteConfig } from "../src/content/site.config";
import { mainNavItems } from "../src/content/navigation/nav.data";
import { footerContent } from "../src/content/navigation/footer.data";
import {
  ACTIVE_TREATMENTS_FILTER,
  ACTIVE_TREATMENTS_SORT,
  CONTENT_PAGE_SLUGS,
  PUBLISHED_FAQ_FILTER,
  PUBLISHED_FAQ_SORT,
  PUBLISHED_TESTIMONIAL_FILTER,
  PUBLISHED_TESTIMONIAL_SORT,
} from "../src/lib/db/repositories/constants";
import { findActiveTreatments } from "../src/lib/db/repositories/treatment.repository";
import { findContentPageBySlug } from "../src/lib/db/repositories/content-page.repository";
import { findHomepage } from "../src/lib/db/repositories/homepage.repository";
import { findMediaAssetsByIds } from "../src/lib/db/repositories/media-asset.repository";
import { findPublishedFaqItems } from "../src/lib/db/repositories/faq-item.repository";
import { findPublishedTestimonials } from "../src/lib/db/repositories/testimonial.repository";
import { findSiteSettings } from "../src/lib/db/repositories/site-settings.repository";
import { buildMediaAssetMap } from "../src/lib/db/mappers/media-resolver";
import { collectHomepageAssetMediaIds, mapHomepageToHomepageAssets } from "../src/lib/db/mappers/to-homepage-assets";
import { mapHomepageToHomepageContent } from "../src/lib/db/mappers/to-homepage-content";
import {
  mapContentPageToAboutContent,
  mapContentPageToContactPageContent,
  mapContentPageToPregnancyMotherhoodContent,
  mapContentPageToTreatmentsIndexContent,
} from "../src/lib/db/mappers/to-content-page";
import { mapSiteSettingsToFooterContent } from "../src/lib/db/mappers/to-footer-content";
import { mapSiteSettingsToMainNav } from "../src/lib/db/mappers/to-main-nav";
import { mapSiteSettingsToSiteConfig } from "../src/lib/db/mappers/to-site-config";
import { mapFaqItemDocumentsToFaqItems } from "../src/lib/db/mappers/to-faq-item";
import { mapTestimonialDocumentsToTestimonialSlots } from "../src/lib/db/mappers/to-testimonial-slot";
import { mapTreatmentDocumentsToTreatments } from "../src/lib/db/mappers/to-treatment";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function compareDomain<T>(domain: string, actual: T, expected: T): void {
  if (!isDeepStrictEqual(actual, expected)) {
    throw new Error(`${domain} parity mismatch`);
  }

  console.log(`  ✓ ${domain}`);
}

function verifyRepositoryFilterDefinitions(): void {
  assert(
    ACTIVE_TREATMENTS_FILTER.isActive === true,
    "Treatment repository must filter isActive=true",
  );
  assert(
    ACTIVE_TREATMENTS_SORT.sortOrder === 1,
    "Treatment repository must sort by sortOrder ascending",
  );
  assert(
    PUBLISHED_FAQ_FILTER.isPublished === true,
    "FAQ repository must filter isPublished=true",
  );
  assert(
    PUBLISHED_FAQ_SORT.sortOrder === 1,
    "FAQ repository must sort by sortOrder ascending",
  );
  assert(
    PUBLISHED_TESTIMONIAL_FILTER.isPublished === true,
    "Testimonial repository must filter isPublished=true",
  );
  assert(
    PUBLISHED_TESTIMONIAL_SORT.sortOrder === 1,
    "Testimonial repository must sort by sortOrder ascending",
  );

  console.log("  ✓ repository publication/active filter definitions");
}

async function main(): Promise<void> {
  loadEnvLocal();

  console.log("Content parity verification (read-only)...");

  verifyRepositoryFilterDefinitions();

  const siteSettingsDoc = await findSiteSettings();
  assert(siteSettingsDoc, "SiteSettings singleton missing in database");

  compareDomain(
    "SiteConfig",
    mapSiteSettingsToSiteConfig(siteSettingsDoc),
    siteConfig,
  );

  compareDomain(
    "Main navigation",
    mapSiteSettingsToMainNav(siteSettingsDoc),
    mainNavItems,
  );

  compareDomain(
    "Footer",
    mapSiteSettingsToFooterContent(siteSettingsDoc),
    footerContent,
  );

  const homepageDoc = await findHomepage();
  assert(homepageDoc, "Homepage singleton missing in database");

  compareDomain(
    "HomepageContent",
    mapHomepageToHomepageContent(homepageDoc),
    homepageContent,
  );

  const homepageMediaIds = collectHomepageAssetMediaIds(homepageDoc);
  const homepageMediaAssets = await findMediaAssetsByIds(homepageMediaIds);
  const homepageMediaMap = buildMediaAssetMap(homepageMediaAssets);

  compareDomain(
    "HomepageAssets",
    mapHomepageToHomepageAssets(homepageDoc, homepageMediaMap),
    homepageAssets,
  );

  for (const slug of CONTENT_PAGE_SLUGS) {
    const contentPageDoc = await findContentPageBySlug(slug);
    assert(contentPageDoc, `ContentPage missing for slug: ${slug}`);

    if (slug === "about") {
      compareDomain(
        "AboutContent",
        mapContentPageToAboutContent(contentPageDoc),
        aboutContent,
      );
    }

    if (slug === "pregnancy-motherhood") {
      compareDomain(
        "PregnancyMotherhoodContent",
        mapContentPageToPregnancyMotherhoodContent(contentPageDoc),
        pregnancyMotherhoodContent,
      );
    }

    if (slug === "contact") {
      compareDomain(
        "ContactPageContent",
        mapContentPageToContactPageContent(contentPageDoc),
        contactPageContent,
      );
    }

    if (slug === "treatments") {
      compareDomain(
        "TreatmentsIndexContent",
        mapContentPageToTreatmentsIndexContent(contentPageDoc),
        treatmentsIndexContent,
      );
    }
  }

  const treatmentDocs = await findActiveTreatments();
  compareDomain(
    "Treatments",
    mapTreatmentDocumentsToTreatments(treatmentDocs),
    treatments,
  );

  const faqDocs = await findPublishedFaqItems();
  compareDomain("FAQ", mapFaqItemDocumentsToFaqItems(faqDocs), faqItems);

  const testimonialDocs = await findPublishedTestimonials();
  compareDomain(
    "Testimonials",
    mapTestimonialDocumentsToTestimonialSlots(testimonialDocs),
    testimonials,
  );

  console.log("Content parity verification passed (read-only).");
  process.exit(0);
}

void main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown parity verification error.";
  console.error(`Content parity verification failed: ${message}`);
  process.exit(1);
});
