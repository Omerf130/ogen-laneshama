import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import mongoose from "mongoose";
import { loadEnvLocal } from "../../lib/load-env-local";
import { connectDB } from "../../../src/lib/db/mongoose";
import {
  HomepageModel,
  ContentPageModel,
  TreatmentModel,
} from "../../../src/lib/db/models";
import type { TreatmentSlug } from "@/types/content";
import {
  CP2B,
  LEGACY_SEED,
  seoForContentPageSlug,
  seoForTreatmentSlug,
} from "./targets";
import {
  formatDatabaseIdentity,
  getMongoDatabaseIdentityFromEnv,
} from "./database-identity";

type PlannedUpdate =
  | {
      status: "apply";
      collection: string;
      documentId: string;
      field: string;
      reason: string;
      before: string;
      after: string;
    }
  | {
      status: "skip";
      collection: string;
      documentId: string;
      field: string;
      reason: string;
      current: string;
    }
  | {
      status: "conflict";
      collection: string;
      documentId: string;
      field: string;
      reason: string;
      current: string;
      proposed: string;
    }
  | {
      status: "missing";
      collection: string;
      documentId: string;
      field: string;
      reason: string;
    };

interface DryRunSnapshot {
  version: 1;
  createdAt: string;
  databaseIdentity: ReturnType<typeof getMongoDatabaseIdentityFromEnv>;
  databaseIdentityLabel: string;
  updates: Extract<PlannedUpdate, { status: "apply" }>[];
  skipped: Extract<PlannedUpdate, { status: "skip" }>[];
  conflicts: Extract<PlannedUpdate, { status: "conflict" }>[];
  missing: Extract<PlannedUpdate, { status: "missing" }>[];
}

const TREATMENT_SLUGS: TreatmentSlug[] = [
  "psychotherapy",
  "reiki",
  "aroma-touch",
  "guidance",
];

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function appendIfMissing(
  current: string,
  suffix: string,
  alreadyIncludes: string,
): { action: "skip" | "apply"; next: string } {
  if (current.includes(alreadyIncludes)) {
    return { action: "skip", next: current };
  }
  if (current.endsWith(suffix.trim())) {
    return { action: "skip", next: current };
  }
  return { action: "apply", next: `${current}${suffix}` };
}

function planHomepageUpdates(
  doc: Record<string, unknown> | null,
): PlannedUpdate[] {
  const id = "homepage";
  if (!doc) {
    return [
      {
        status: "missing",
        collection: "homepages",
        documentId: id,
        field: "(document)",
        reason: "Homepage document not found",
      },
    ];
  }

  const content = doc.content as Record<string, unknown> | undefined;
  const hero = content?.hero as Record<string, unknown> | undefined;
  const aboutPreview = content?.aboutPreview as
    | Record<string, unknown>
    | undefined;
  const seo = doc.seo as Record<string, unknown> | undefined;

  const plans: PlannedUpdate[] = [];

  const subtitle = normalizeText(hero?.subtitle);
  const targetSubtitle = CP2B.homepage.heroSubtitle;
  if (subtitle === targetSubtitle) {
    plans.push({
      status: "skip",
      collection: "homepages",
      documentId: id,
      field: "content.hero.subtitle",
      reason: "Already matches CP2 target",
      current: subtitle,
    });
  } else if (
    subtitle.includes("בדיקה") ||
    subtitle === LEGACY_SEED.homepageHeroSubtitleBase ||
    subtitle === `${LEGACY_SEED.homepageHeroSubtitleBase} בדיקה`.trim() ||
    subtitle.startsWith(LEGACY_SEED.homepageHeroSubtitleBase)
  ) {
    plans.push({
      status: "apply",
      collection: "homepages",
      documentId: id,
      field: "content.hero.subtitle",
      reason: "CP2 hero subtitle + remove test suffix",
      before: subtitle,
      after: targetSubtitle,
    });
  } else {
    plans.push({
      status: "conflict",
      collection: "homepages",
      documentId: id,
      field: "content.hero.subtitle",
      reason: "Custom subtitle — not seed/test pattern",
      current: subtitle,
      proposed: targetSubtitle,
    });
  }

  const supporting = normalizeText(aboutPreview?.supportingCopy);
  const targetSupporting = CP2B.homepage.aboutPreviewSupportingCopy;
  if (supporting === targetSupporting) {
    plans.push({
      status: "skip",
      collection: "homepages",
      documentId: id,
      field: "content.aboutPreview.supportingCopy",
      reason: "Already matches CP2 target",
      current: supporting,
    });
  } else if (
    supporting === LEGACY_SEED.homepageAboutPreviewSupportingCopy ||
    supporting === targetSupporting.replace(" — בקליניקה ברמת ישי.", ".")
  ) {
    plans.push({
      status: "apply",
      collection: "homepages",
      documentId: id,
      field: "content.aboutPreview.supportingCopy",
      reason: "CP2 location in about preview",
      before: supporting,
      after: targetSupporting,
    });
  } else if (supporting.includes("בקליניקה ברמת ישי")) {
    plans.push({
      status: "skip",
      collection: "homepages",
      documentId: id,
      field: "content.aboutPreview.supportingCopy",
      reason: "Already mentions Ramat Yishai clinic",
      current: supporting,
    });
  } else {
    plans.push({
      status: "conflict",
      collection: "homepages",
      documentId: id,
      field: "content.aboutPreview.supportingCopy",
      reason: "Custom supporting copy",
      current: supporting,
      proposed: targetSupporting,
    });
  }

  const seoTitle = normalizeText(seo?.title);
  const seoDesc = normalizeText(seo?.description);
  if (seoTitle === CP2B.homepage.seo.title) {
    plans.push({
      status: "skip",
      collection: "homepages",
      documentId: id,
      field: "seo.title",
      reason: "Already CP2 SEO title",
      current: seoTitle,
    });
  } else if (seoTitle === LEGACY_SEED.homepageSeo.title || seoTitle === "") {
    plans.push({
      status: "apply",
      collection: "homepages",
      documentId: id,
      field: "seo.title",
      reason: "CP2 local SEO title",
      before: seoTitle,
      after: CP2B.homepage.seo.title,
    });
  } else {
    plans.push({
      status: "conflict",
      collection: "homepages",
      documentId: id,
      field: "seo.title",
      reason: "Custom SEO title",
      current: seoTitle,
      proposed: CP2B.homepage.seo.title,
    });
  }

  if (seoDesc === CP2B.homepage.seo.description) {
    plans.push({
      status: "skip",
      collection: "homepages",
      documentId: id,
      field: "seo.description",
      reason: "Already CP2 SEO description",
      current: seoDesc,
    });
  } else if (seoDesc === LEGACY_SEED.homepageSeo.description || seoDesc === "") {
    plans.push({
      status: "apply",
      collection: "homepages",
      documentId: id,
      field: "seo.description",
      reason: "CP2 local SEO description",
      before: seoDesc,
      after: CP2B.homepage.seo.description,
    });
  } else if (!seoDesc.includes("קליניקה ברמת ישי")) {
    plans.push({
      status: "conflict",
      collection: "homepages",
      documentId: id,
      field: "seo.description",
      reason: "Custom SEO description",
      current: seoDesc,
      proposed: CP2B.homepage.seo.description,
    });
  }

  return plans;
}

function planSeoPair(
  collection: string,
  documentId: string,
  currentSeo: Record<string, unknown> | undefined,
  target: { title: string; description: string },
  legacy?: { title?: string; description?: string },
): PlannedUpdate[] {
  const plans: PlannedUpdate[] = [];
  const title = normalizeText(currentSeo?.title);
  const description = normalizeText(currentSeo?.description);

  if (title === target.title) {
    plans.push({
      status: "skip",
      collection,
      documentId,
      field: "seo.title",
      reason: "Already CP2 SEO title",
      current: title,
    });
  } else if (legacy?.title && title !== legacy.title && title !== "") {
    plans.push({
      status: "conflict",
      collection,
      documentId,
      field: "seo.title",
      reason: "Custom SEO title",
      current: title,
      proposed: target.title,
    });
  } else if (title !== target.title) {
    plans.push({
      status: "apply",
      collection,
      documentId,
      field: "seo.title",
      reason: "CP2 local SEO title",
      before: title,
      after: target.title,
    });
  }

  if (description === target.description) {
    plans.push({
      status: "skip",
      collection,
      documentId,
      field: "seo.description",
      reason: "Already CP2 SEO description",
      current: description,
    });
  } else if (
    legacy?.description &&
    description !== legacy.description &&
    description !== "" &&
    !description.includes("קליניקה ברמת ישי")
  ) {
    plans.push({
      status: "conflict",
      collection,
      documentId,
      field: "seo.description",
      reason: "Custom SEO description",
      current: description,
      proposed: target.description,
    });
  } else if (description !== target.description) {
    plans.push({
      status: "apply",
      collection,
      documentId,
      field: "seo.description",
      reason: "CP2 local SEO description",
      before: description,
      after: target.description,
    });
  }

  return plans;
}

async function buildPlan(): Promise<PlannedUpdate[]> {
  const plans: PlannedUpdate[] = [];

  const homepage = await HomepageModel.findById("homepage").lean();
  plans.push(...planHomepageUpdates(homepage as Record<string, unknown> | null));

  const about = await ContentPageModel.findOne({ slug: "about" }).lean();
  if (!about) {
    plans.push({
      status: "missing",
      collection: "contentpages",
      documentId: "about",
      field: "(document)",
      reason: "About content page not found",
    });
  } else {
    const content = about.content as Record<string, unknown>;
    const introduction = content?.introduction as Record<string, unknown>;
    const body = Array.isArray(introduction?.body)
      ? (introduction.body as string[])
      : [];
    const first = normalizeText(body[0] ?? "");
    const suffix = CP2B.about.introductionLocationSuffix;
    const marker = "הקליניקה שלי נמצאת ברמת ישי";
    if (first.includes(marker)) {
      plans.push({
        status: "skip",
        collection: "contentpages",
        documentId: String(about._id),
        field: "content.introduction.body[0]",
        reason: "Location sentence already present",
        current: first,
      });
    } else {
      const { action, next } = appendIfMissing(first, suffix, marker);
      if (action === "skip") {
        plans.push({
          status: "skip",
          collection: "contentpages",
          documentId: String(about._id),
          field: "content.introduction.body[0]",
          reason: "No append needed",
          current: first,
        });
      } else {
        plans.push({
          status: "apply",
          collection: "contentpages",
          documentId: String(about._id),
          field: "content.introduction.body[0]",
          reason: "CP2 clinic location in introduction",
          before: first,
          after: next,
        });
      }
    }

    plans.push(
      ...planSeoPair(
        "contentpages",
        String(about._id),
        about.seo as Record<string, unknown> | undefined,
        CP2B.about.seo,
        {
          title: "אודות רחלי נגרין",
          description:
            "הכירו את רחלי נגרין — ליווי רגשי ורוחני לנשים, בגישה אישית, חמה ומכבדת.",
        },
      ),
    );
  }

  const treatments = await ContentPageModel.findOne({ slug: "treatments" }).lean();
  if (!treatments) {
    plans.push({
      status: "missing",
      collection: "contentpages",
      documentId: "treatments",
      field: "(document)",
      reason: "Treatments index page not found",
    });
  } else {
    const content = treatments.content as Record<string, unknown>;
    const intro = normalizeText(content?.intro);
    const marker = "הפגישות מתקיימות בקליניקה ברמת ישי";
    if (intro.includes(marker)) {
      plans.push({
        status: "skip",
        collection: "contentpages",
        documentId: String(treatments._id),
        field: "content.intro",
        reason: "Clinic sentence already present",
        current: intro,
      });
    } else {
      const { action, next } = appendIfMissing(
        intro,
        CP2B.treatmentsIndex.introLocationSuffix,
        marker,
      );
      if (action === "apply") {
        plans.push({
          status: "apply",
          collection: "contentpages",
          documentId: String(treatments._id),
          field: "content.intro",
          reason: "CP2 clinic location in treatments intro",
          before: intro,
          after: next,
        });
      }
    }

    plans.push(
      ...planSeoPair(
        "contentpages",
        String(treatments._id),
        treatments.seo as Record<string, unknown> | undefined,
        CP2B.treatmentsIndex.seo,
        {
          title: "דרכי ליווי",
          description:
            "פסיכותרפיה, רייקי, Aroma Touch והכוונה — דרכים שונות לליווי רגשי לנשים, בהתאם למה שמתאים לך.",
        },
      ),
    );
  }

  const contact = await ContentPageModel.findOne({ slug: "contact" }).lean();
  if (!contact) {
    plans.push({
      status: "missing",
      collection: "contentpages",
      documentId: "contact",
      field: "(document)",
      reason: "Contact page not found",
    });
  } else {
    const content = contact.content as Record<string, unknown>;
    const intro = normalizeText(content?.intro);
    const marker = "הפגישות מתקיימות בקליניקה ברמת ישי";
    if (intro.includes(marker)) {
      plans.push({
        status: "skip",
        collection: "contentpages",
        documentId: String(contact._id),
        field: "content.intro",
        reason: "Clinic sentence already present",
        current: intro,
      });
    } else {
      const { action, next } = appendIfMissing(
        intro,
        CP2B.contact.introLocationSuffix,
        marker,
      );
      if (action === "apply") {
        plans.push({
          status: "apply",
          collection: "contentpages",
          documentId: String(contact._id),
          field: "content.intro",
          reason: "CP2 clinic location in contact intro",
          before: intro,
          after: next,
        });
      }
    }

    plans.push(
      ...planSeoPair(
        "contentpages",
        String(contact._id),
        contact.seo as Record<string, unknown> | undefined,
        CP2B.contact.seo,
        {
          title: "יצירת קשר",
          description: "צרו קשר עם רחלי נגרין — בואי נדבר, בקצב שנוח לך.",
        },
      ),
    );
  }

  const pregnancy = await ContentPageModel.findOne({
    slug: "pregnancy-motherhood",
  }).lean();
  if (!pregnancy) {
    plans.push({
      status: "missing",
      collection: "contentpages",
      documentId: "pregnancy-motherhood",
      field: "(document)",
      reason: "Pregnancy page not found",
    });
  } else {
    const content = pregnancy.content as Record<string, unknown>;
    const howSupport = content?.howSupportHelps as Record<string, unknown>;
    const body = Array.isArray(howSupport?.body)
      ? [...(howSupport.body as string[])]
      : [];
    const firstItem = normalizeText(body[0] ?? "");
    const targetItem = CP2B.pregnancyMotherhood.howSupportFirstItem;
    if (body.some((line) => normalizeText(line) === targetItem)) {
      plans.push({
        status: "skip",
        collection: "contentpages",
        documentId: String(pregnancy._id),
        field: "content.howSupportHelps.body",
        reason: "CP2 support item already in list",
        current: firstItem,
      });
    } else {
      plans.push({
        status: "apply",
        collection: "contentpages",
        documentId: String(pregnancy._id),
        field: "content.howSupportHelps.body",
        reason: "Prepend CP2 in-clinic support item",
        before: JSON.stringify(body),
        after: JSON.stringify([targetItem, ...body]),
      });
    }

    plans.push(
      ...planSeoPair(
        "contentpages",
        String(pregnancy._id),
        pregnancy.seo as Record<string, unknown> | undefined,
        CP2B.pregnancyMotherhood.seo,
        {
          title: "ליווי בדרך להריון ולאימהות",
          description:
            "תמיכה רגשית ורוחנית לנשים בדרך להריון, בהריון ובאימהות — ליווי אישי, לא טיפול פוריות.",
        },
      ),
    );
  }

  for (const slug of TREATMENT_SLUGS) {
    const treatment = await TreatmentModel.findOne({ slug }).lean();
    if (!treatment) {
      plans.push({
        status: "missing",
        collection: "treatments",
        documentId: slug,
        field: "(document)",
        reason: `Treatment ${slug} not found`,
      });
      continue;
    }

    const target = seoForTreatmentSlug(slug);
    const legacyTitles: Record<TreatmentSlug, string> = {
      psychotherapy: "פסיכותרפיה וליווי רגשי",
      reiki: "רייקי",
      "aroma-touch": "Aroma Touch",
      guidance: "תקשור והכוונה",
    };
    const legacyDescriptions: Record<TreatmentSlug, string> = {
      psychotherapy:
        "ליווי רגשי ופסיכותרפיה לנשים — מרחב בטוח לעיבוד, תמיכה והקשבה. לא תחליף לטיפול רפואי.",
      reiki:
        "רייקי — גישה מרגיעה לתמיכה רגשית. שירות משלים, לא תחליף לטיפול רפואי או פסיכולוגי.",
      "aroma-touch":
        "טכניקת שמנים אתריים לרגיעה ואיזון — שירות משלים, לא תחליף לטיפול רפואי או פסיכולוגי.",
      guidance:
        "הכוונה רוחנית עדינה בתוך מסגרת תומכת — לא תחליף לטיפול מקצועי.",
    };

    plans.push(
      ...planSeoPair(
        "treatments",
        String(treatment._id),
        treatment.seo as Record<string, unknown> | undefined,
        target,
        {
          title: legacyTitles[slug],
          description: legacyDescriptions[slug],
        },
      ),
    );
  }

  return plans;
}

function printDryRunReport(
  identityLabel: string,
  plans: PlannedUpdate[],
  snapshotPath: string,
): void {
  const updates = plans.filter((p) => p.status === "apply");
  const skipped = plans.filter((p) => p.status === "skip");
  const conflicts = plans.filter((p) => p.status === "conflict");
  const missing = plans.filter((p) => p.status === "missing");

  console.log("\n=== CP2B Dry Run ===\n");
  console.log(`Database: ${identityLabel}`);
  console.log(`Snapshot: ${snapshotPath}`);
  console.log(`Planned updates: ${updates.length}`);
  console.log(`Skipped (already OK): ${skipped.length}`);
  console.log(`Conflicts: ${conflicts.length}`);
  console.log(`Missing: ${missing.length}`);

  if (updates.length > 0) {
    console.log("\n--- Fields to update ---");
    for (const u of updates) {
      console.log(`\n[${u.collection}] ${u.documentId} → ${u.field}`);
      console.log(`  Reason: ${u.reason}`);
      console.log(`  Before: ${u.before.slice(0, 120)}${u.before.length > 120 ? "…" : ""}`);
      console.log(`  After:  ${u.after.slice(0, 120)}${u.after.length > 120 ? "…" : ""}`);
    }
  }

  if (conflicts.length > 0) {
    console.log("\n--- Conflicts (will skip on execute) ---");
    for (const c of conflicts) {
      console.log(`\n[${c.collection}] ${c.documentId} → ${c.field}`);
      console.log(`  ${c.reason}`);
    }
  }

  if (missing.length > 0) {
    console.log("\n--- Missing ---");
    for (const m of missing) {
      console.log(`  ${m.collection} / ${m.documentId}: ${m.reason}`);
    }
  }

  console.log(
    "\nNo writes performed. To apply after approval:\n" +
      "  npx tsx --require ./scripts/lib/register-server-only-stub.cjs " +
      "scripts/migrations/cp2b/cp2b-local-seo-migration.ts --execute --snapshot <path>\n",
  );
}

async function exportBackup(backupDir: string): Promise<void> {
  const homepage = await HomepageModel.findById("homepage").lean();
  const contentPages = await ContentPageModel.find({}).lean();
  const treatments = await TreatmentModel.find({}).lean();

  writeFileSync(
    resolve(backupDir, "homepage.json"),
    JSON.stringify(homepage, null, 2),
    "utf8",
  );
  writeFileSync(
    resolve(backupDir, "content-pages.json"),
    JSON.stringify(contentPages, null, 2),
    "utf8",
  );
  writeFileSync(
    resolve(backupDir, "treatments.json"),
    JSON.stringify(treatments, null, 2),
    "utf8",
  );
  writeFileSync(
    resolve(backupDir, "README.txt"),
    [
      "CP2B CMS backup — do not commit.",
      "Contains homepage, all content pages, all treatments (full documents).",
      "No credentials.",
    ].join("\n"),
    "utf8",
  );
}

async function readFieldValue(
  collection: string,
  documentId: string,
  field: string,
): Promise<string> {
  if (collection === "homepages") {
    const doc = await HomepageModel.findById(documentId).lean();
    if (!doc) return "";
    return readPath(doc as Record<string, unknown>, field);
  }
  if (collection === "contentpages") {
    const doc = await ContentPageModel.findById(documentId).lean();
    if (!doc) return "";
    return readPath(doc as Record<string, unknown>, field);
  }
  if (collection === "treatments") {
    const doc = await TreatmentModel.findById(documentId).lean();
    if (!doc) return "";
    return readPath(doc as Record<string, unknown>, field);
  }
  return "";
}

function readPath(doc: Record<string, unknown>, field: string): string {
  if (field === "content.howSupportHelps.body") {
    const content = doc.content as Record<string, unknown>;
    const how = content?.howSupportHelps as Record<string, unknown>;
    const body = how?.body;
    return JSON.stringify(body ?? []);
  }
  if (field === "content.introduction.body[0]") {
    const content = doc.content as Record<string, unknown>;
    const intro = content?.introduction as Record<string, unknown>;
    const body = intro?.body as string[] | undefined;
    return normalizeText(body?.[0] ?? "");
  }

  const parts = field.split(".");
  let current: unknown = doc;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : normalizeText(current);
}

async function applyUpdate(update: Extract<PlannedUpdate, { status: "apply" }>): Promise<void> {
  const { collection, documentId, field, after } = update;

  if (collection === "homepages") {
    await HomepageModel.updateOne(
      { _id: documentId },
      { $set: { [field]: after } },
    );
    return;
  }

  if (collection === "contentpages") {
    if (field === "content.howSupportHelps.body") {
      const parsed = JSON.parse(after) as string[];
      await ContentPageModel.updateOne(
        { _id: documentId },
        { $set: { "content.howSupportHelps.body": parsed } },
      );
      return;
    }
    if (field === "content.introduction.body[0]") {
      const doc = await ContentPageModel.findById(documentId).lean();
      const content = doc?.content as Record<string, unknown>;
      const intro = content?.introduction as Record<string, unknown>;
      const body = Array.isArray(intro?.body)
        ? [...(intro.body as string[])]
        : [];
      body[0] = after;
      await ContentPageModel.updateOne(
        { _id: documentId },
        { $set: { "content.introduction.body": body } },
      );
      return;
    }
    await ContentPageModel.updateOne(
      { _id: documentId },
      { $set: { [field]: after } },
    );
    return;
  }

  if (collection === "treatments") {
    await TreatmentModel.updateOne(
      { _id: documentId },
      { $set: { [field]: after } },
    );
  }
}

async function executeFromSnapshot(snapshotPath: string): Promise<void> {
  const raw = readFileSync(snapshotPath, "utf8");
  const snapshot = JSON.parse(raw) as DryRunSnapshot;

  if (snapshot.conflicts.length > 0) {
    console.warn(
      `Warning: snapshot recorded ${snapshot.conflicts.length} conflict(s); those fields will be skipped.`,
    );
  }

  const identity = getMongoDatabaseIdentityFromEnv();
  const label = formatDatabaseIdentity(identity);
  if (label !== snapshot.databaseIdentityLabel) {
    throw new Error(
      "Database identity does not match dry-run snapshot. Aborting.",
    );
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupRoot = resolve(process.cwd(), ".backups");
  const backupDir = resolve(backupRoot, `cp2b-pre-migrate-${timestamp}`);
  if (existsSync(backupDir)) {
    throw new Error(`Backup directory already exists: ${backupDir}`);
  }
  mkdirSync(backupDir, { recursive: true });

  console.log(`Creating backup in ${backupDir}...`);
  await exportBackup(backupDir);

  let applied = 0;
  let skippedStale = 0;

  for (const update of snapshot.updates) {
    const current = await readFieldValue(
      update.collection,
      update.documentId,
      update.field,
    );
    if (current !== update.before) {
      console.warn(
        `SKIP stale field [${update.collection}] ${update.field}: value changed since dry run`,
      );
      skippedStale++;
      continue;
    }
    await applyUpdate(update);
    applied++;
  }

  console.log(`\nApplied ${applied} field update(s).`);
  if (skippedStale > 0) {
    console.log(`Skipped ${skippedStale} stale field(s).`);
  }
  console.log(`Backup: ${backupDir}`);
}

function parseArgs(argv: string[]): {
  dryRun: boolean;
  execute: boolean;
  snapshotPath: string | null;
} {
  const execute = argv.includes("--execute");
  const snapshotIndex = argv.indexOf("--snapshot");
  const snapshotPath =
    snapshotIndex >= 0 ? argv[snapshotIndex + 1] ?? null : null;

  return {
    dryRun: !execute,
    execute,
    snapshotPath,
  };
}

async function main(): Promise<void> {
  loadEnvLocal();
  const { dryRun, execute, snapshotPath } = parseArgs(process.argv.slice(2));

  const identity = getMongoDatabaseIdentityFromEnv();
  const identityLabel = formatDatabaseIdentity(identity);

  await connectDB();

  if (execute) {
    if (!snapshotPath || !existsSync(snapshotPath)) {
      throw new Error("--execute requires --snapshot <dry-run.json> from a prior dry run.");
    }
    await executeFromSnapshot(snapshotPath);
    await mongoose.disconnect();
    return;
  }

  const plans = await buildPlan();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const snapshotDir = resolve(process.cwd(), ".backups", `cp2b-dry-run-${timestamp}`);
  if (existsSync(snapshotDir)) {
    throw new Error(`Dry-run directory already exists: ${snapshotDir}`);
  }
  mkdirSync(snapshotDir, { recursive: true });

  const snapshot: DryRunSnapshot = {
    version: 1,
    createdAt: new Date().toISOString(),
    databaseIdentity: identity,
    databaseIdentityLabel: identityLabel,
    updates: plans.filter((p) => p.status === "apply") as Extract<
      PlannedUpdate,
      { status: "apply" }
    >[],
    skipped: plans.filter((p) => p.status === "skip") as Extract<
      PlannedUpdate,
      { status: "skip" }
    >[],
    conflicts: plans.filter((p) => p.status === "conflict") as Extract<
      PlannedUpdate,
      { status: "conflict" }
    >[],
    missing: plans.filter((p) => p.status === "missing") as Extract<
      PlannedUpdate,
      { status: "missing" }
    >[],
  };

  const snapshotPathOut = resolve(snapshotDir, "dry-run.json");
  writeFileSync(snapshotPathOut, JSON.stringify(snapshot, null, 2), "utf8");

  printDryRunReport(identityLabel, plans, snapshotPathOut);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
