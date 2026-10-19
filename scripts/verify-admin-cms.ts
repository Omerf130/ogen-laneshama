import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  adminContentPageSaveSchema,
  adminFaqCreateSchema,
  adminHomepageSaveSchema,
  adminSiteSettingsSaveSchema,
  adminTreatmentSaveSchema,
} from "../src/lib/validation/admin-cms";
import {
  contentImageObjectPositionSchema,
  contentImageSchema,
} from "../src/lib/validation/common";
import {
  CENTER_OBJECT_POSITION,
  formatObjectPositionCss,
  getContentImagePositionStyle,
} from "../src/lib/content/content-image-position";

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

function verifyContentImagePlacement(): void {
  assertFile("src/lib/content/content-image-position.ts");
  assertFile("src/lib/content/content-image-display.ts");
  assertFile("src/components/admin/forms/AdminImagePlacementControl.tsx");
  assertFile("src/components/features/content/PlacedContentImage/PlacedContentImage.tsx");
  assertFileContains("src/components/admin/forms/AdminImageField.tsx", "placement");
  assertFileContains(
    "src/components/features/inner-pages/ContentImageBlock/ContentImageBlock.tsx",
    "PlacedContentImage",
  );

  const centered = getContentImagePositionStyle(undefined);
  assert(centered === undefined, "Missing objectPosition must not override CSS defaults");

  const explicit = getContentImagePositionStyle({ x: 30, y: 70 });
  assert(
    explicit?.objectPosition === "30% 70%",
    "Public renderer must apply saved object position",
  );

  assert(
    formatObjectPositionCss(CENTER_OBJECT_POSITION) === "50% 50%",
    "Default centered position must be 50% 50%",
  );

  const validPosition = contentImageObjectPositionSchema.safeParse({ x: 50, y: 50 });
  assert(validPosition.success, "Valid object position must pass");

  const invalidX = contentImageObjectPositionSchema.safeParse({ x: 101, y: 50 });
  assert(!invalidX.success, "objectPosition x above 100 must be rejected");

  const invalidY = contentImageObjectPositionSchema.safeParse({ x: 50, y: -1 });
  assert(!invalidY.success, "objectPosition y below 0 must be rejected");

  const legacyImage = contentImageSchema.safeParse({
    src: "/images/about/portrait.webp",
    alt: "Alt text",
  });
  assert(legacyImage.success, "ContentImage without fitMode must remain valid");

  const containImage = contentImageSchema.safeParse({
    src: "/images/about/portrait.webp",
    alt: "Alt text",
    fitMode: "contain",
  });
  assert(containImage.success, "ContentImage with contain fitMode must pass validation");

  const invalidFitMode = contentImageSchema.safeParse({
    src: "/images/about/portrait.webp",
    alt: "Alt text",
    fitMode: "stretch",
  });
  assert(!invalidFitMode.success, "Arbitrary fitMode strings must be rejected");

  const positionedImage = contentImageSchema.safeParse({
    src: "https://example.public.blob.vercel-storage.com/site-media/a.jpg",
    alt: "Alt text",
    mediaId: "abc",
    fitMode: "cover",
    objectPosition: { x: 20, y: 80 },
  });
  assert(positionedImage.success, "ContentImage with cover fitMode and objectPosition must pass");
}

function verifyPublicSectionVisibilityWiring(): void {
  assertFile("src/lib/content/get-homepage-section-visibility.ts");
  assertFileContains(
    "src/components/features/homepage/HomeJourney/HomeJourney.tsx",
    "sectionVisibility",
  );
}

function verifyEditorBaselineLifecycle(): void {
  const editors = [
    "src/components/admin/cms/homepage/HomepageEditor.tsx",
    "src/components/admin/cms/content-pages/ContentPageEditor.tsx",
    "src/components/admin/cms/treatments/TreatmentEditor.tsx",
    "src/components/admin/cms/settings/SiteSettingsEditor.tsx",
  ];

  for (const relativePath of editors) {
    const content = readFileSync(join(ROOT, relativePath), "utf8");
    assert(
      content.includes("useAdminBaselineOnSaveComplete"),
      `${relativePath} must sync baseline via useAdminBaselineOnSaveComplete`,
    );
    assert(
      !content.includes("[state.success, resetBaseline, values]"),
      `${relativePath} must not reset baseline on every values change`,
    );
  }

  assertFileContains(
    "src/components/admin/forms/useAdminCmsSubmit.ts",
    "shouldSyncBaselineOnSaveComplete",
  );
}

function main(): void {
  verifyValidationSchemas();
  verifyRepositoryExports();
  verifyCmsActions();
  verifyAdminRoutes();
  verifyContentImagePlacement();
  verifyPublicSectionVisibilityWiring();
  verifyEditorBaselineLifecycle();

  console.log("admin:verify-cms — all checks passed");
}

main();
