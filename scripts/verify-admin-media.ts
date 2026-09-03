import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  adminMediaCreateFromBlobSchema,
  adminMediaDeleteSchema,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
  VERCEL_BLOB_PROVIDER,
} from "../src/lib/validation/admin-phase7";
import { ADMIN_MEDIA_UPLOAD_URL } from "../src/lib/admin/media/constants";

const ROOT = join(__dirname, "..");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFile(relativePath: string): void {
  assert(existsSync(join(ROOT, relativePath)), `Missing required file: ${relativePath}`);
}

function assertFileContains(relativePath: string, needle: string): void {
  const content = readFileSync(join(ROOT, relativePath), "utf8");
  assert(content.includes(needle), `Expected "${needle}" in ${relativePath}`);
}

function verifyMediaSchemas(): void {
  const valid = adminMediaCreateFromBlobSchema.safeParse({
    originalFilename: "photo.jpg",
    filename: "photo.jpg",
    alt: "Alt text",
    mimeType: "image/jpeg",
    providerKey: "site-media/abc.jpg",
    url: "https://example.blob.vercel-storage.com/site-media/abc.jpg",
    size: 1024,
  });
  assert(valid.success, "Valid media create payload must pass");

  const video = adminMediaCreateFromBlobSchema.safeParse({
    originalFilename: "clip.mp4",
    filename: "clip.mp4",
    alt: "Video",
    mimeType: "video/mp4",
    providerKey: "site-media/clip.mp4",
    url: "https://example.blob.vercel-storage.com/site-media/clip.mp4",
  });
  assert(!video.success, "Video MIME type must be rejected");

  const oversized = adminMediaCreateFromBlobSchema.safeParse({
    originalFilename: "big.jpg",
    filename: "big.jpg",
    alt: "Big",
    mimeType: "image/jpeg",
    providerKey: "site-media/big.jpg",
    url: "https://example.blob.vercel-storage.com/site-media/big.jpg",
    size: MAX_IMAGE_UPLOAD_BYTES + 1,
  });
  assert(!oversized.success, "Oversized upload metadata must be rejected");

  const deleteSchema = adminMediaDeleteSchema.safeParse({ mediaId: "abc" });
  assert(deleteSchema.success, "Media delete schema must accept mediaId");

  assert(ALLOWED_IMAGE_MIME_TYPES.length === 4, "Expected four allowed image MIME types");
  assert(VERCEL_BLOB_PROVIDER === "vercel-blob", "Unexpected blob provider constant");
}

function verifyUploadCookiePathInvariant(): void {
  const cookieOptions = readFileSync(
    join(ROOT, "src/lib/admin/auth/cookies.ts"),
    "utf8",
  );
  assert(
    cookieOptions.includes('path: "/admin"'),
    "Admin session cookie must remain scoped to /admin",
  );
  assert(
    ADMIN_MEDIA_UPLOAD_URL.startsWith("/admin/"),
    `Blob upload token URL must be under /admin (got ${ADMIN_MEDIA_UPLOAD_URL})`,
  );
  assert(
    !existsSync(join(ROOT, "src/app/api/admin/media/upload/route.ts")),
    "Legacy /api/admin/media/upload route must be removed (cookie path mismatch)",
  );
}

function verifyNextImageBlobConfig(): void {
  const config = readFileSync(join(ROOT, "next.config.ts"), "utf8");
  assert(
    config.includes("*.public.blob.vercel-storage.com"),
    "next.config.ts must allow Vercel Blob public hostnames for next/image",
  );
  assert(
    config.includes('protocol: "https"') || config.includes("protocol: 'https'"),
    "next.config.ts Blob remote pattern must require https",
  );
  assert(
    config.includes("/site-media/**"),
    "next.config.ts Blob remote pattern must restrict pathname to site-media uploads",
  );
}

function verifyMediaSurface(): void {
  assertFile("src/app/admin/api/media/upload/route.ts");
  assertFile("src/features/admin/media/media.actions.ts");
  assertFile("src/components/admin/media/MediaLibraryManager.tsx");
  assertFile("src/components/admin/media/AdminMediaPicker.tsx");
  assertFile("src/components/admin/forms/AdminImageField.tsx");
  assertFile("src/lib/admin/media/find-media-references.ts");
  assertFile("src/app/admin/(shell)/media/page.tsx");

  assertFileContains("src/app/admin/api/media/upload/route.ts", "getCurrentAdmin");
  assertFileContains("src/app/admin/api/media/upload/route.ts", "site-media/");
  assertFileContains(
    "src/components/admin/media/MediaLibraryManager.tsx",
    "ADMIN_MEDIA_UPLOAD_URL",
  );
  assertFileContains(
    "src/components/admin/media/AdminMediaPicker.tsx",
    "ADMIN_MEDIA_UPLOAD_URL",
  );
  assertFileContains("src/features/admin/media/media.actions.ts", "isLocalProvider");
  assertFileContains("src/features/admin/media/media.actions.ts", "findMediaAssetReferences");
  assertFileContains("src/lib/admin/media/find-media-references.ts", "mediaId");
  assertFileContains("src/components/admin/forms/AdminImageField.tsx", "AdminImagePlacementControl");
  assertFileContains("src/lib/validation/common.ts", "contentImageFitModeSchema");
  assertFileContains("src/lib/validation/common.ts", "contentImageObjectPositionSchema");
  assertFileContains("src/components/admin/cms/homepage/HomepageEditor.tsx", "AdminImageField");
}

function main(): void {
  verifyMediaSchemas();
  verifyUploadCookiePathInvariant();
  verifyNextImageBlobConfig();
  verifyMediaSurface();
  console.log("admin:verify-media — all checks passed");
}

main();
