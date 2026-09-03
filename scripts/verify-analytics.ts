import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { isLikelyBotUserAgent } from "../src/lib/analytics/bot-filter";
import { hashVisitorCookieUuid } from "../src/lib/analytics/visitor-hash";
import {
  HOMEPAGE_VISITOR_COOKIE_NAME,
  HOMEPAGE_VISITOR_MAX_AGE_SECONDS,
} from "../src/lib/analytics/visitor-cookie";

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

function assertFileNotContains(relativePath: string, needle: string): void {
  const content = readFileSync(join(ROOT, relativePath), "utf8");
  assert(!content.includes(needle), `Did not expect "${needle}" in ${relativePath}`);
}

function verifyVisitorHash(): void {
  const uuid = "550e8400-e29b-41d4-a716-446655440000";
  const hash = hashVisitorCookieUuid(uuid);
  const expected = createHash("sha256").update(uuid, "utf8").digest("hex");

  assert(hash === expected, "Visitor hash must be SHA256(cookieUuid)");
  assert(hash !== uuid, "Visitor hash must not equal raw cookie UUID");
  assert(hash.length === 64, "Visitor hash must be 64 hex chars");
}

function verifyBotFilter(): void {
  assert(isLikelyBotUserAgent("Googlebot/2.1"), "Googlebot must be detected");
  assert(isLikelyBotUserAgent("facebookexternalhit/1.1"), "Preview bot must be detected");
  assert(!isLikelyBotUserAgent("Mozilla/5.0 Chrome/120"), "Normal browser must pass");
  assert(!isLikelyBotUserAgent(null), "Missing UA must not be treated as bot");
}

function verifyAnalyticsSurface(): void {
  assert(HOMEPAGE_VISITOR_COOKIE_NAME === "ogen_homepage_visitor", "Unexpected cookie name");
  assert(HOMEPAGE_VISITOR_MAX_AGE_SECONDS > 0, "Cookie max age must be positive");

  assertFile("src/lib/db/models/homepage-visitor.model.ts");
  assertFile("src/lib/db/repositories/homepage-visitor.repository.ts");
  assertFile("src/app/api/analytics/homepage-visit/route.ts");
  assertFile("src/components/analytics/HomepageVisitorTracker.tsx");

  assertFileContains("src/lib/db/models/homepage-visitor.model.ts", "visitorIdHash");
  assertFileNotContains("src/lib/db/models/homepage-visitor.model.ts", "ipHash");
  assertFileNotContains("src/lib/db/models/homepage-visitor.model.ts", "userAgent");

  assertFileContains("src/app/api/analytics/homepage-visit/route.ts", "isLikelyBotUserAgent");
  assertFileContains("src/app/api/analytics/homepage-visit/route.ts", "hashVisitorCookieUuid");
  assertFileContains(
    "src/components/features/homepage/JourneyShell/JourneyShell.tsx",
    "HomepageVisitorTracker",
  );
  assertFileContains(
    "src/components/admin/dashboard/KpiCardGrid/KpiCardGrid.tsx",
    "homepageVisitorsLast7Days",
  );
}

function main(): void {
  verifyVisitorHash();
  verifyBotFilter();
  verifyAnalyticsSurface();
  console.log("analytics:verify — all checks passed");
}

main();
