import mongoose, { type Types } from "mongoose";
import {
  SEED_HOMEPAGE_ID,
  SEED_SITE_SETTINGS_ID,
  type SeedPlan,
} from "@/lib/seed/build-seed-plan";
import type { SeedCliOptions } from "@/lib/seed/cli-args";
import { isProductionEnvironment } from "@/lib/seed/cli-args";
import { LOCAL_IMAGE_PROVIDER } from "@/lib/seed/local-images";
import { ContentPageModel } from "@/lib/db/models/content-page.model";
import { FaqItemModel } from "@/lib/db/models/faq-item.model";
import { HomepageModel } from "@/lib/db/models/homepage.model";
import { MediaAssetModel } from "@/lib/db/models/media-asset.model";
import { SiteSettingsModel } from "@/lib/db/models/site-settings.model";
import { TreatmentModel } from "@/lib/db/models/treatment.model";
import type { HomepageDocumentInput } from "@/lib/validation/homepage";

export interface SeedOperationSummary {
  siteSettings: "create" | "update" | "skip";
  homepage: "create" | "update" | "skip";
  contentPages: Array<{ slug: string; action: "create" | "update" | "skip" }>;
  treatments: Array<{ slug: string; action: "create" | "update" | "skip" }>;
  faqItems: Array<{ id: string; action: "create" | "update" | "skip" }>;
  mediaAssets: Array<{ providerKey: string; action: "create" | "update" | "skip" }>;
}

type SeedAction = SeedOperationSummary["siteSettings"];

async function resolveAction(
  exists: boolean,
  options: SeedCliOptions,
): Promise<SeedAction> {
  if (!exists) {
    return "create";
  }

  if (isProductionEnvironment() && !options.force) {
    return "skip";
  }

  return "update";
}

export async function planSeedOperations(
  plan: SeedPlan,
  options: SeedCliOptions,
): Promise<SeedOperationSummary> {
  const [
    siteExists,
    homepageExists,
    contentPageExists,
    treatmentExists,
    faqExists,
    mediaExists,
  ] = await Promise.all([
    SiteSettingsModel.exists({ _id: SEED_SITE_SETTINGS_ID }),
    HomepageModel.exists({ _id: SEED_HOMEPAGE_ID }),
    Promise.all(
      plan.contentPages.map((page) =>
        ContentPageModel.exists({ slug: page.slug }).then((found) => ({
          slug: page.slug,
          exists: Boolean(found),
        })),
      ),
    ),
    Promise.all(
      plan.treatments.map((treatment) =>
        TreatmentModel.exists({ slug: treatment.slug }).then((found) => ({
          slug: treatment.slug,
          exists: Boolean(found),
        })),
      ),
    ),
    Promise.all(
      plan.faqItems.map((faq) =>
        FaqItemModel.exists({ id: faq.id }).then((found) => ({
          id: faq.id,
          exists: Boolean(found),
        })),
      ),
    ),
    Promise.all(
      plan.mediaAssets.map((asset) =>
        MediaAssetModel.exists({
          provider: LOCAL_IMAGE_PROVIDER,
          providerKey: asset.providerKey,
        }).then((found) => ({
          providerKey: asset.providerKey,
          exists: Boolean(found),
        })),
      ),
    ),
  ]);

  return {
    siteSettings: await resolveAction(Boolean(siteExists), options),
    homepage: await resolveAction(Boolean(homepageExists), options),
    contentPages: await Promise.all(
      contentPageExists.map(async ({ slug, exists }) => ({
        slug,
        action: await resolveAction(exists, options),
      })),
    ),
    treatments: await Promise.all(
      treatmentExists.map(async ({ slug, exists }) => ({
        slug,
        action: await resolveAction(exists, options),
      })),
    ),
    faqItems: await Promise.all(
      faqExists.map(async ({ id, exists }) => ({
        id,
        action: await resolveAction(exists, options),
      })),
    ),
    mediaAssets: await Promise.all(
      mediaExists.map(async ({ providerKey, exists }) => ({
        providerKey,
        action: await resolveAction(exists, options),
      })),
    ),
  };
}

function buildHomepageDocument(
  plan: SeedPlan,
  mediaIdsByProviderKey: Map<string, Types.ObjectId>,
): HomepageDocumentInput & { _id: string } {
  const homepage = structuredClone(plan.homepage);

  if (homepage.assets?.hero?.src) {
    const mediaId = mediaIdsByProviderKey.get(homepage.assets.hero.src);

    if (mediaId) {
      homepage.assets.hero.mediaId = mediaId.toString();
    }
  }

  if (homepage.assets?.pregnancySpotlight?.src) {
    const mediaId = mediaIdsByProviderKey.get(
      homepage.assets.pregnancySpotlight.src,
    );

    if (mediaId) {
      homepage.assets.pregnancySpotlight.mediaId = mediaId.toString();
    }
  }

  return {
    _id: SEED_HOMEPAGE_ID,
    ...homepage,
  };
}

async function upsertIfAllowed(
  action: SeedAction,
  upsert: () => Promise<void>,
): Promise<void> {
  if (action === "skip") {
    return;
  }

  await upsert();
}

function sanitizeSeedError(error: unknown): Error {
  if (error instanceof Error) {
    if (
      error.message.includes("MONGODB_URI") ||
      error.message.includes("mongodb://") ||
      error.message.includes("mongodb+srv://")
    ) {
      return new Error("Seed transaction failed due to a database error.");
    }

    return new Error(`Seed transaction failed: ${error.message}`);
  }

  return new Error("Seed transaction failed due to an unknown error.");
}

/** Index/collection catalog must be ready before starting a transaction. */
async function ensureSeedIndexesReady(): Promise<void> {
  await Promise.all([
    MediaAssetModel.createIndexes(),
    SiteSettingsModel.createIndexes(),
    HomepageModel.createIndexes(),
    ContentPageModel.createIndexes(),
    TreatmentModel.createIndexes(),
    FaqItemModel.createIndexes(),
  ]);
}

export async function executeSeed(
  plan: SeedPlan,
  options: SeedCliOptions,
): Promise<SeedOperationSummary> {
  if (isProductionEnvironment() && !options.dryRun && !options.ackProduction) {
    throw new Error(
      "Production seed requires --ack-production. Use --dry-run to preview without writes.",
    );
  }

  const operations = await planSeedOperations(plan, options);

  if (options.dryRun) {
    return operations;
  }

  await ensureSeedIndexesReady();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const mediaIdsByProviderKey = new Map<string, Types.ObjectId>();

    for (const [index, asset] of plan.mediaAssets.entries()) {
      const action = operations.mediaAssets[index]?.action ?? "skip";

      if (action === "skip") {
        const existing = await MediaAssetModel.findOne(
          {
            provider: LOCAL_IMAGE_PROVIDER,
            providerKey: asset.providerKey,
          },
          { _id: 1 },
          { session },
        );

        if (!existing) {
          throw new Error(
            `MediaAsset ${asset.providerKey} is missing and update was skipped in production.`,
          );
        }

        mediaIdsByProviderKey.set(asset.providerKey, existing._id);
        continue;
      }

      const result = await MediaAssetModel.findOneAndUpdate(
        {
          provider: LOCAL_IMAGE_PROVIDER,
          providerKey: asset.providerKey,
        },
        { $set: asset.payload },
        { upsert: true, returnDocument: "after", session, setDefaultsOnInsert: true },
      );

      if (!result) {
        throw new Error(`MediaAsset upsert returned no document: ${asset.providerKey}`);
      }

      mediaIdsByProviderKey.set(asset.providerKey, result._id);
    }

    await upsertIfAllowed(operations.siteSettings, async () => {
      await SiteSettingsModel.findOneAndUpdate(
        { _id: SEED_SITE_SETTINGS_ID },
        { $set: { _id: SEED_SITE_SETTINGS_ID, ...plan.siteSettings } },
        { upsert: true, session, setDefaultsOnInsert: true },
      );
    });

    await upsertIfAllowed(operations.homepage, async () => {
      const homepageDocument = buildHomepageDocument(plan, mediaIdsByProviderKey);

      await HomepageModel.findOneAndUpdate(
        { _id: SEED_HOMEPAGE_ID },
        { $set: homepageDocument },
        { upsert: true, session, setDefaultsOnInsert: true },
      );
    });

    for (const [index, page] of plan.contentPages.entries()) {
      const action = operations.contentPages[index]?.action ?? "skip";

      await upsertIfAllowed(action, async () => {
        await ContentPageModel.findOneAndUpdate(
          { slug: page.slug },
          { $set: page },
          { upsert: true, session, setDefaultsOnInsert: true },
        );
      });
    }

    for (const [index, treatment] of plan.treatments.entries()) {
      const action = operations.treatments[index]?.action ?? "skip";

      await upsertIfAllowed(action, async () => {
        await TreatmentModel.findOneAndUpdate(
          { slug: treatment.slug },
          { $set: treatment },
          { upsert: true, session, setDefaultsOnInsert: true },
        );
      });
    }

    for (const [index, faq] of plan.faqItems.entries()) {
      const action = operations.faqItems[index]?.action ?? "skip";

      await upsertIfAllowed(action, async () => {
        await FaqItemModel.findOneAndUpdate(
          { id: faq.id },
          { $set: faq },
          { upsert: true, session, setDefaultsOnInsert: true },
        );
      });
    }

    await session.commitTransaction();
    return operations;
  } catch (error) {
    await session.abortTransaction();
    throw sanitizeSeedError(error);
  } finally {
    await session.endSession();
  }
}

export function printSeedSummary(
  operations: SeedOperationSummary,
  counts: {
    contentPages: number;
    treatments: number;
    faqs: number;
    mediaAssets: number;
  },
  dryRun: boolean,
): void {
  console.log(`Database connection: ${dryRun ? "not required (dry-run)" : "ready"}`);
  console.log(`SiteSettings: ${operations.siteSettings}`);
  console.log(`Homepage: ${operations.homepage}`);
  console.log(`ContentPages: ${counts.contentPages}`);
  console.log(`Treatments: ${counts.treatments}`);
  console.log(`FAQs: ${counts.faqs}`);
  console.log(`MediaAssets: ${counts.mediaAssets}`);
  console.log("Testimonials: 0 (skipped)");
  console.log("Leads: 0 (skipped)");
  console.log("AdminUsers: 0 (skipped)");

  if (dryRun) {
    console.log("Dry-run complete: zero database writes performed.");
  }
}
