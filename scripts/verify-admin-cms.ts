import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  adminContentPageSaveSchema,
  adminFaqCreateSchema,
  adminHomepageSaveSchema,
  adminSiteSettingsSaveSchema,
  adminTreatmentSaveSchema,
} from "../src/lib/validation/admin-cms";

const ROOT = join(__dirname, "..");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFile(relativePath: string): void {
  const fullPath = join(ROOT, relativePath);
  assert(existsSync(fullPath), `Missing required file: ${relativePath}`);
}

function assertFileContains(relativePath: string, needle: string): void {
  const fullPath = join(ROOT, relativePath);
  const content = readFileSync(fullPath, "utf8");
  assert(
    content.includes(needle),
    `Expected "${needle}" in ${relativePath}`,
  );
}

function verifyValidationSchemas(): void {
  const homepage = adminHomepageSaveSchema.safeParse({
    content: {},
  });
  assert(!homepage.success, "Homepage schema must reject empty content");

  const settings = adminSiteSettingsSaveSchema.safeParse({
    businessName: "x",
    therapistName: "x",
    tagline: "x",
    siteUrl: "https://example.com",
    contact: { phone: "", email: "", address: "" },
    whatsapp: { number: "", message: "" },
    socialLinks: [],
    footerBrandSentence: "x",
    defaultSeo: {},
  });
  assert(settings.success, "Site settings schema must accept valid payload");

  const faqCreate = adminFaqCreateSchema.safeParse({
    question: "Q?",
    answer: "A.",
    isPublished: false,
  });
  assert(faqCreate.success, "FAQ create schema must omit id/sortOrder");
  assert(!("id" in (faqCreate.data ?? {})), "FAQ create payload must not include id");

  const treatment = adminTreatmentSaveSchema.safeParse({
    slug: "psychotherapy",
    treatment: {},
  });
  assert(!treatment.success, "Treatment save schema must validate nested treatment");

  const aboutPage = adminContentPageSaveSchema.safeParse({
    slug: "about",
    content: {},
    seo: {},
  });
  assert(!aboutPage.success, "Content page schema must validate content shape");
}

function verifyRepositoryExports(): void {
  assertFileContains(
    "src/lib/db/repositories/index.ts",
    "updateHomepage",
  );
  assertFileContains(
    "src/lib/db/repositories/index.ts",
    "createFaqItem",
  );
  assertFileContains(
    "src/lib/db/repositories/faq-item.repository.ts",
    "randomUUID",
  );
}

function verifyCmsActions(): void {
  const actionFiles = [
    "src/features/admin/homepage/save-homepage.action.ts",
    "src/features/admin/settings/save-site-settings.action.ts",
    "src/features/admin/content-pages/save-content-page.action.ts",
    "src/features/admin/treatments/treatments.actions.ts",
    "src/features/admin/faq/faq.actions.ts",
    "src/features/admin/testimonials/testimonials.actions.ts",
  ];

  for (const file of actionFiles) {
    assertFile(file);
    assertFileContains(file, "withAdminAction");
    assertFileContains(file, "invalidateContent");
  }
}

function verifyAdminRoutes(): void {
  const dbLoadRoutes = [
    "src/app/admin/(shell)/content/homepage/page.tsx",
    "src/app/admin/(shell)/content/about/page.tsx",
    "src/app/admin/(shell)/content/pregnancy-motherhood/page.tsx",
    "src/app/admin/(shell)/content/contact/page.tsx",
    "src/app/admin/(shell)/content/treatments/page.tsx",
    "src/app/admin/(shell)/treatments/page.tsx",
    "src/app/admin/(shell)/treatments/[slug]/page.tsx",
    "src/app/admin/(shell)/faq/page.tsx",
    "src/app/admin/(shell)/faq/[id]/page.tsx",
    "src/app/admin/(shell)/testimonials/page.tsx",
    "src/app/admin/(shell)/testimonials/[id]/page.tsx",
    "src/app/admin/(shell)/settings/page.tsx",
  ];

  for (const route of dbLoadRoutes) {
    assertFile(route);
    assertFileContains(route, "AdminDbErrorState");
    assertFileContains(route, "loadCmsOrError");
  }

  assertFile("src/app/admin/(shell)/faq/new/page.tsx");
  assertFile("src/app/admin/(shell)/testimonials/new/page.tsx");
  assertFileContains(
    "src/app/admin/(shell)/treatments/[slug]/page.tsx",
    "TREATMENT_SLUGS",
  );
}

function verifyPublicSectionVisibilityWiring(): void {
  assertFile("src/lib/content/get-homepage-section-visibility.ts");
  assertFileContains(
    "src/components/features/homepage/HomeJourney/HomeJourney.tsx",
    "sectionVisibility",
  );
}

function main(): void {
  verifyValidationSchemas();
  verifyRepositoryExports();
  verifyCmsActions();
  verifyAdminRoutes();
  verifyPublicSectionVisibilityWiring();

  console.log("admin:verify-cms — all checks passed");
}

main();
