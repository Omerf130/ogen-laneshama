/**
 * Child-process getter runner for verify-content-source.ts.
 * Usage: tsx scripts/verify-content-source-getters.ts static|db
 */
import { isDeepStrictEqual } from "node:util";
import mongoose from "mongoose";
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
import { resetContentSourceCacheForTests } from "../src/lib/content/content-source";
import { TESTIMONIALS_NAV_HREF } from "../src/lib/db/mappers/to-main-nav";
import { getAboutContent } from "../src/lib/content/get-about-content";
import { getContactPageContent } from "../src/lib/content/get-contact-content";
import { getFaqItems } from "../src/lib/content/get-faq";
import { getFooterContent } from "../src/lib/content/get-footer-content";
import { getHomepageAssets } from "../src/lib/content/get-homepage-assets";
import { getHomepageContent } from "../src/lib/content/get-homepage-content";
import { getMainNav } from "../src/lib/content/get-main-nav";
import { getPregnancyMotherhoodContent } from "../src/lib/content/get-pregnancy-motherhood-content";
import { getSiteConfig } from "../src/lib/content/get-site-config";
import { getTestimonials } from "../src/lib/content/get-testimonials";
import { getTreatmentBySlug } from "../src/lib/content/get-treatment-by-slug";
import { getTreatments } from "../src/lib/content/get-treatments";
import { getTreatmentsIndexContent } from "../src/lib/content/get-treatments-index-content";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function compareDomain<T>(domain: string, actual: T, expected: T): void {
  if (!isDeepStrictEqual(actual, expected)) {
    throw new Error(`${domain} mismatch in getter output`);
  }

  console.log(`  ✓ ${domain}`);
}

async function main(): Promise<void> {
  const mode = process.argv[2];

  if (mode !== "static" && mode !== "db") {
    throw new Error('Expected mode argument: "static" or "db"');
  }

  process.env.CONTENT_SOURCE = mode;
  resetContentSourceCacheForTests();

  const connectionStateBefore = mongoose.connection.readyState;
  console.log(`Getter verification (${mode} mode)...`);

  const [
    config,
    nav,
    footer,
    homepage,
    assets,
    faq,
    testimonialSlots,
    treatmentList,
    about,
    pregnancy,
    contact,
    treatmentsIndex,
  ] = await Promise.all([
    getSiteConfig(),
    getMainNav(),
    getFooterContent(),
    getHomepageContent(),
    getHomepageAssets(),
    getFaqItems(),
    getTestimonials(),
    getTreatments(),
    getAboutContent(),
    getPregnancyMotherhoodContent(),
    getContactPageContent(),
    getTreatmentsIndexContent(),
  ]);

  compareDomain("getSiteConfig", config, siteConfig);
  compareDomain("getFooterContent", footer, footerContent);
  compareDomain("getHomepageContent", homepage, homepageContent);
  compareDomain("getHomepageAssets", assets, homepageAssets);
  compareDomain("getFaqItems", faq, faqItems);
  compareDomain("getTestimonials", testimonialSlots, testimonials);
  compareDomain("getTreatments", treatmentList, treatments);
  compareDomain("getAboutContent", about, aboutContent);
  compareDomain(
    "getPregnancyMotherhoodContent",
    pregnancy,
    pregnancyMotherhoodContent,
  );
  compareDomain("getContactPageContent", contact, contactPageContent);
  compareDomain(
    "getTreatmentsIndexContent",
    treatmentsIndex,
    treatmentsIndexContent,
  );

  for (const slug of ["psychotherapy", "aroma-touch", "reiki", "guidance"] as const) {
    const expected = treatments.find((item) => item.slug === slug);
    const actual = await getTreatmentBySlug(slug);
    compareDomain(`getTreatmentBySlug(${slug})`, actual, expected);
  }

  if (mode === "static") {
    compareDomain("getMainNav", nav, mainNavItems);
    assert(
      nav.some((item) => item.href === TESTIMONIALS_NAV_HREF),
      "Static mode must preserve testimonials nav link",
    );
    assert(
      mongoose.connection.readyState === connectionStateBefore,
      "Static mode must not establish a MongoDB connection (repository spy)",
    );
    console.log("  ✓ no MongoDB connection in static mode");
  } else {
    assert(
      mongoose.connection.readyState !== 0,
      "DB mode must connect to MongoDB (repository proof)",
    );
    console.log("  ✓ MongoDB connection established in db mode");

    assert(
      !nav.some((item) => item.href === TESTIMONIALS_NAV_HREF),
      "DB mode nav must hide testimonials link when no published testimonials",
    );
    console.log("  ✓ DB mode nav excludes testimonials when empty");

    assert(
      isDeepStrictEqual(nav, mainNavItems.filter((item) => item.href !== TESTIMONIALS_NAV_HREF)),
      "DB mode nav should match static nav minus testimonials link",
    );
    console.log("  ✓ DB mode nav matches filtered static nav");
  }

  console.log(`Getter verification (${mode} mode) passed.`);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

void main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown getter verification error.";
  console.error(`Getter verification failed: ${message}`);
  process.exit(1);
});
