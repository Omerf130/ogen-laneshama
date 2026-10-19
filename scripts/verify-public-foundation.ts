import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { loadEnvLocal } from "./lib/load-env-local";
import { pageMetadata } from "../src/content/pages/page-metadata";
import { siteConfig } from "../src/content/site.config";
import {
  resetContentSourceCacheForTests,
} from "../src/lib/content/content-source";
import {
  resolveMediaRefToPublicSrc,
  buildMediaAssetMap,
} from "../src/lib/db/mappers/media-resolver";
import {
  resolvePageSeo,
  extractPageSeoOverride,
} from "../src/lib/seo/resolve-page-seo";
import {
  buildPublicSitemap,
  isAdminSitemapPath,
} from "../src/lib/seo/build-sitemap";
import { getSiteUrl } from "../src/lib/seo/constants";
import { OFFICIAL_SITE_URL, resolveSiteUrl } from "../src/lib/seo/site-url";
import {
  CONTENT_PAGE_SEO_KEY,
  TREATMENT_SEO_KEY,
} from "../src/lib/seo/static-seo-fallbacks";

const HERO_IMAGE = "/images/homepage/hero-editorial.webp";
const PREGNANCY_IMAGE = "/images/homepage/pregnancy-editorial.webp";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function compareSeoDomain(
  domain: string,
  actual: { title: string; description: string },
  expected: { title: string; description: string },
): void {
  if (
    actual.title !== expected.title ||
    actual.description !== expected.description
  ) {
    throw new Error(`${domain} SEO mismatch`);
  }

  console.log(`  ✓ ${domain} SEO`);
}

async function verifySeoParity(): Promise<void> {
  console.log("\n1. SEO verification");

  const { getHomepageSeo } = await import("../src/lib/content/get-homepage-seo");
  const { getContentPageSeo } = await import(
    "../src/lib/content/get-content-page-seo"
  );
  const { getTreatmentSeo } = await import("../src/lib/content/get-treatment-seo");

  process.env.CONTENT_SOURCE = "db";
  resetContentSourceCacheForTests();

  compareSeoDomain("Homepage", await getHomepageSeo(), pageMetadata.home);

  for (const slug of Object.keys(CONTENT_PAGE_SEO_KEY) as Array<
    keyof typeof CONTENT_PAGE_SEO_KEY
  >) {
    const key = CONTENT_PAGE_SEO_KEY[slug];
    compareSeoDomain(
      `ContentPage:${slug}`,
      await getContentPageSeo(slug),
      pageMetadata[key],
    );
  }

  for (const slug of Object.keys(TREATMENT_SEO_KEY) as Array<
    keyof typeof TREATMENT_SEO_KEY
  >) {
    const key = TREATMENT_SEO_KEY[slug];
    const seo = await getTreatmentSeo(slug);
    assert(seo, `Treatment SEO missing for ${slug}`);
    compareSeoDomain(`Treatment:${slug}`, seo!, pageMetadata[key]);
  }

  const emptyFallback = resolvePageSeo({
    dbOverride: extractPageSeoOverride({}),
    staticFallback: pageMetadata.home,
    siteConfig,
  });

  assert(
    emptyFallback.title === pageMetadata.home.title,
    "Empty DB SEO must fall back to static title",
  );
  assert(
    emptyFallback.description === pageMetadata.home.description,
    "Empty DB SEO must fall back to static description",
  );
  console.log("  ✓ empty DB SEO falls back to static metadata");
}

async function verifySiteUrlResolution(): Promise<void> {
  console.log("\n1b. Site URL resolution");

  assert(
    resolveSiteUrl("https://example.com") === OFFICIAL_SITE_URL,
    "Placeholder example.com must resolve to official domain",
  );
  assert(
    resolveSiteUrl("https://ogenlaneshima.co.il/") === OFFICIAL_SITE_URL,
    "Official domain must normalize without trailing slash",
  );
  assert(
    resolveSiteUrl("https://custom.example.org") === "https://custom.example.org",
    "Non-placeholder CMS URLs must be preserved",
  );
  console.log("  ✓ site URL placeholder resolution");
}

async function verifySitemap(): Promise<void> {
  console.log("\n2. Sitemap verification");

  process.env.CONTENT_SOURCE = "db";
  resetContentSourceCacheForTests();

  const { getSiteConfig } = await import("../src/lib/content/get-site-config");
  const resolvedSiteUrl = getSiteUrl(await getSiteConfig());

  const sitemap = await buildPublicSitemap();
  const urls = sitemap.map((entry) => entry.url);
  assert(
    urls.every((url) => url.startsWith(`${resolvedSiteUrl}/`) || url === resolvedSiteUrl),
    "Sitemap URLs must use resolved site URL (not raw placeholder)",
  );
  const paths = urls.map((url) => url.replace(resolvedSiteUrl, ""));

  const requiredCore = ["/", "/about", "/pregnancy-motherhood", "/contact", "/treatments"];
  for (const path of requiredCore) {
    assert(paths.includes(path), `Missing core sitemap path: ${path}`);
  }
  console.log("  ✓ core static routes present");

  const treatmentPaths = paths.filter((path) => path.startsWith("/treatments/"));
  assert(treatmentPaths.length === 4, "Expected 4 active treatment URLs in DB mode");
  console.log("  ✓ active treatment URLs present");

  assert(
    paths.length === new Set(paths).size,
    "Sitemap must not contain duplicate URLs",
  );
  console.log("  ✓ no duplicate URLs");

  assert(
    !paths.some(isAdminSitemapPath),
    "Sitemap must not include admin routes",
  );
  console.log("  ✓ no admin URLs");

  process.env.CONTENT_SOURCE = "static";
  resetContentSourceCacheForTests();

  const staticSitemap = await buildPublicSitemap();
  assert(staticSitemap.length === 9, "Static mode sitemap should have 9 routes");
  console.log("  ✓ static mode preserves 9-route sitemap");
}

async function verifyHomepageMedia(): Promise<void> {
  console.log("\n3. Homepage media verification");

  process.env.CONTENT_SOURCE = "db";
  resetContentSourceCacheForTests();

  const { getHomepageAssets } = await import(
    "../src/lib/content/get-homepage-assets"
  );
  const assets = await getHomepageAssets();

  assert(assets.hero.src === HERO_IMAGE, "DB hero image path mismatch");
  assert(
    assets.pregnancySpotlight.src === PREGNANCY_IMAGE,
    "DB pregnancy spotlight image path mismatch",
  );
  console.log("  ✓ DB homepage hero and pregnancy spotlight paths");

  const mediaMap = buildMediaAssetMap([
    {
      _id: "media-1",
      url: "/images/from-media-asset.webp",
      provider: "local",
      providerKey: "/images/from-media-asset.webp",
      mimeType: "image/webp",
      filename: "from-media-asset.webp",
    },
  ] as never);

  const mediaIdResolved = resolveMediaRefToPublicSrc(
    { mediaId: "media-1", alt: "test" },
    mediaMap,
  );
  assert(
    mediaIdResolved === "/images/from-media-asset.webp",
    "mediaId resolution failed",
  );

  const srcFallback = resolveMediaRefToPublicSrc(
    { src: "/images/fallback.webp", alt: "test" },
    mediaMap,
  );
  assert(srcFallback === "/images/fallback.webp", "src fallback failed");

  const nullFallback = resolveMediaRefToPublicSrc(null, mediaMap);
  assert(nullFallback === null, "null fallback failed");

  console.log("  ✓ media resolver: mediaId, src, null");
}

function runStaticGetterSection(): void {
  const scriptPath = resolve(process.cwd(), "scripts/verify-content-source-getters.ts");
  const stubPath = resolve(process.cwd(), "scripts/lib/register-server-only-stub.cjs");
  const tsxCli = resolve(process.cwd(), "node_modules/tsx/dist/cli.mjs");

  const result = spawnSync(
    process.execPath,
    [tsxCli, "--require", stubPath, scriptPath, "static"],
    {
      env: { ...process.env, CONTENT_SOURCE: "static" },
      stdio: "inherit",
    },
  );

  assert(result.status === 0, "Static getter regression failed after 4E changes");
  console.log("\n4. Existing content-source static getter regression passed");
}

async function main(): Promise<void> {
  loadEnvLocal();

  console.log("Public foundation verification (read-only)...");

  await verifySeoParity();
  await verifySiteUrlResolution();
  await verifySitemap();
  await verifyHomepageMedia();
  runStaticGetterSection();

  console.log("\nPublic foundation verification passed.");
  process.exit(0);
}

void main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown verification error.";
  console.error(`Public foundation verification failed: ${message}`);
  process.exit(1);
});
